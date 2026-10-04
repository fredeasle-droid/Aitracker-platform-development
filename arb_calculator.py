# arb_calculator.py
# Sports Betting Arbitrage Finder — SportsGameOdds API
# Scans bookmakers for odds discrepancies and calculates guaranteed profit
# Docs: https://sportsgameodds.com/docs/examples/arbitrage-calculator

import requests
import os
import time
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────────────

API_KEY = os.environ.get('SPORTSGAMEODDS_KEY')
API_BASE = 'https://api.sportsgameodds.com/v2'

LEAGUES = ['EPL']              # Only scan the English Premier League
TOTAL_STAKE = 100                  # Total stake in dollars for profit calculations
MIN_PROFIT_PCT = 0.0               # Minimum profit % to display (0 = show all arbs)
MONITOR_MODE = False               # Set True to run continuously
MONITOR_INTERVAL = 60              # Seconds between scans in monitor mode

# Telegram alerts (optional — set in .env)
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')

# ─── API ──────────────────────────────────────────────────────────────────────

def fetch_events(league):
    """Fetch upcoming events with odds for a given league."""
    if not API_KEY:
        raise SystemExit(
            'Error: SPORTSGAMEODDS_KEY is not set.\n'
            'Get a free key at https://sportsgameodds.com/pricing'
        )
    try:
        response = requests.get(
            f'{API_BASE}/events',
            params={
                'leagueID': league,
                'finalized': 'false',
                'oddsAvailable': 'true',
                'limit': 100,
            },
            headers={'x-api-key': API_KEY},
        )
        response.raise_for_status()
        return response.json().get('data', [])
    except requests.exceptions.RequestException as e:
        print(f'  Error fetching {league} events: {e}')
        return []

# ─── Maths ────────────────────────────────────────────────────────────────────

def american_to_decimal(american_odds):
    """Convert American odds to decimal odds.
    e.g. +150 -> 2.50,  -110 -> 1.909
    """
    if american_odds > 0:
        return (american_odds / 100) + 1
    return (100 / abs(american_odds)) + 1


def calculate_arbitrage(odds_list):
    """
    Determine whether arbitrage exists across a set of decimal odds.

    Returns:
        has_arb (bool): True when implied probability sum < 1
        profit_pct (float): Guaranteed profit as a percentage of total stake
        stakes (list): Optimal stake amounts as percentages of total stake
    """
    implied_prob_sum = sum(1 / odd for odd in odds_list)
    has_arb = implied_prob_sum < 1

    if not has_arb:
        return False, 0.0, []

    profit_pct = ((1 / implied_prob_sum) - 1) * 100
    stakes = [(100 / odd) / implied_prob_sum for odd in odds_list]

    return True, profit_pct, stakes


def validate_arbitrage(opportunity):
    """Sanity check — verify stakes sum to 100% and all legs are profitable."""
    total = sum(leg['stake_pct'] for leg in opportunity['legs'])
    assert abs(total - 100) < 0.01, f"Stakes sum to {total:.2f}%, expected 100%"

    for leg in opportunity['legs']:
        payout = leg['stake_pct'] * leg['decimal_odds']
        assert payout > 100, f"Negative profit on {leg['side']}: payout {payout:.2f}"

# ─── Scanner ──────────────────────────────────────────────────────────────────

def find_arbitrage_opportunities(events):
    """
    Scan events for arbitrage across spread, moneyline, and total markets.
    Returns a list of opportunity dicts sorted by profit % descending.
    """
    opportunities = []

    for event in events:
        away_name = event['teams']['away']['names']['long']
        home_name = event['teams']['home']['names']['long']
        matchup = f"{away_name} @ {home_name}"

        # Group by the complete API market identity (stat/entity), then period,
        # exact line, side, and bookmaker offers. The entity is required so
        # home-team totals cannot be paired with away-team totals.
        markets = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(list))))

        for odd_id, odd in (event.get('odds') or {}).items():
            bet_type = odd['betTypeID']
            side = odd['sideID']
            period_id = odd.get('periodID', 'game')
            odd_parts = odd_id.rsplit('-', 3)
            market_identity = odd_parts[0] if len(odd_parts) == 4 else odd_id

            # Full-match markets use `reg` in SportsGameOdds soccer data.
            # Keep `game` for feeds that use the generic period name.
            if period_id not in ('game', 'reg'):
                continue

            for bookmaker_id, bm_data in (odd.get('byBookmaker') or {}).items():
                if not bm_data.get('available', True):
                    continue

                odds_str = bm_data.get('odds')
                if not odds_str:
                    continue

                try:
                    price = int(odds_str)
                except (ValueError, TypeError):
                    continue

                raw_line = bm_data.get('spread') if bet_type == 'sp' else bm_data.get('overUnder')
                try:
                    line = float(raw_line) if raw_line is not None else None
                except (TypeError, ValueError):
                    continue
                if bet_type in ('sp', 'ou') and line is None:
                    continue
                line_key = f'{line:.4f}' if line is not None else 'none'

                markets[f'{market_identity}|{bet_type}'][period_id][line_key][side].append({
                    'bookmaker': bookmaker_id,
                    'american': price,
                    'decimal': american_to_decimal(price),
                    'line': line,
                })

        # Check each market for arbitrage
        for market_key, periods in markets.items():
            market_identity, bet_type = market_key.rsplit('|', 1)
            for period_id, lines in periods.items():
                for line_key, sides in lines.items():

                    if bet_type in ('sp', 'ml'):
                        side_a, side_b = 'home', 'away'
                        market_label = 'spread' if bet_type == 'sp' else 'moneyline'
                    elif bet_type == 'ou':
                        side_a, side_b = 'over', 'under'
                        market_label = 'total'
                    else:
                        continue

                    if not (sides.get(side_a) and sides.get(side_b)):
                        continue
                    if bet_type in ('sp', 'ou') and any(offer.get('line') != float(line_key) for side in (side_a, side_b) for offer in (sides.get(side) or [])):
                        continue

                    best_a = max(sides[side_a], key=lambda x: x['decimal'])
                    best_b = max(sides[side_b], key=lambda x: x['decimal'])

                    has_arb, profit_pct, stakes = calculate_arbitrage(
                        [best_a['decimal'], best_b['decimal']]
                    )

                    if has_arb and profit_pct >= MIN_PROFIT_PCT:
                        opp = {
                            'matchup': matchup,
                            'market': market_label,
                            'profit_pct': profit_pct,
                            'legs': [
                                {
                                    'side': side_a,
                                    'bookmaker': best_a['bookmaker'],
                                    'odds': round(best_a['decimal'], 3),
                                    'decimal_odds': best_a['decimal'],
                                    'line': best_a.get('line'),
                                    'stake_pct': stakes[0],
                                },
                                {
                                    'side': side_b,
                                    'bookmaker': best_b['bookmaker'],
                                    'odds': round(best_b['decimal'], 3),
                                    'decimal_odds': best_b['decimal'],
                                    'line': best_b.get('line'),
                                    'stake_pct': stakes[1],
                                },
                            ],
                        }
                        try:
                            validate_arbitrage(opp)
                            opportunities.append(opp)
                        except AssertionError as e:
                            print(f'  Validation failed for {matchup}: {e}')

    opportunities.sort(key=lambda x: x['profit_pct'], reverse=True)
    return opportunities

# ─── Middle finder ────��───────────────────────────────────────────────────────

def find_middles(events):
    """
    Find 'middle' opportunities — where you can win both sides
    if the result lands in the gap between two different lines.
    e.g. Lakers -5.5 @ Book A + Celtics +6.0 @ Book B
    If Lakers win by exactly 6, both bets win.
    """
    middles = []

    for event in events:
        away_name = event['teams']['away']['names']['long']
        home_name = event['teams']['home']['names']['long']
        matchup = f"{away_name} @ {home_name}"

        sides = defaultdict(list)

        for odd_id, odd in (event.get('odds') or {}).items():
            if odd['betTypeID'] != 'sp' or odd.get('periodID') != 'game':
                continue

            side = odd['sideID']
            for bm_id, bm_data in (odd.get('byBookmaker') or {}).items():
                if not bm_data.get('available') or not bm_data.get('odds'):
                    continue
                try:
                    sides[side].append({
                        'bookmaker': bm_id,
                        'american': int(bm_data['odds']),
                        'line': bm_data.get('spread'),
                    })
                except (ValueError, TypeError):
                    continue

        for home_offer in sides.get('home', []):
            for away_offer in sides.get('away', []):
                try:
                    home_line = float(home_offer['line'] or 0)
                    away_line = float(away_offer['line'] or 0)
                except (TypeError, ValueError):
                    continue

                gap = abs(home_line) - abs(away_line)
                if gap >= 0.5:
                    middles.append({
                        'matchup': matchup,
                        'gap': gap,
                        'home': home_offer,
                        'away': away_offer,
                    })

    return middles

# ─── Alerts ───────────────────────────────────────────────────────────────────

def send_telegram_alert(opportunity):
    """Send a Telegram notification for an arbitrage opportunity."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return

    lines = [
        '📈 *Arbitrage Alert*',
        f"*{opportunity['matchup']}*",
        f"Market: {opportunity['market'].upper()}",
        f"Profit: {opportunity['profit_pct']:.2f}%",
    ]
    for leg in opportunity['legs']:
        line_str = f" {leg['line']}" if leg.get('line') else ''
        lines.append(f"  {leg['side'].upper()}{line_str} @ {leg['odds']:+d} ({leg['bookmaker']})")

    try:
        requests.post(
            f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage',
            json={'chat_id': TELEGRAM_CHAT_ID, 'text': '\n'.join(lines), 'parse_mode': 'Markdown'},
        )
    except requests.exceptions.RequestException as e:
        print(f'  Telegram alert failed: {e}')

# ─── Display ──────────────────────────────────────────────────────────────────

def display_opportunities(opportunities):
    """Print arbitrage opportunities to the console."""
    if not opportunities:
        print('No arbitrage opportunities found.')
        print('Note: True arbitrage is rare — markets are usually efficient.\n')
        return

    word = 'OPPORTUNITY' if len(opportunities) == 1 else 'OPPORTUNITIES'
    print(f'\n  Found {len(opportunities)} ARBITRAGE {word}!\n')

    for i, opp in enumerate(opportunities, 1):
        print('  ' + '=' * 58)
        print(f"  #{i} — {opp['matchup']}")
        print(f"  Market: {opp['market'].upper()}")
        print(f"  Guaranteed Profit: {opp['profit_pct']:.2f}%")
        print('  ' + '-' * 58)

        for leg in opp['legs']:
            stake = TOTAL_STAKE * (leg['stake_pct'] / 100)
            payout = stake * leg['decimal_odds']
            line_str = f" {leg['line']}" if leg.get('line') else ''
            print(f"  {leg['side'].upper()}{line_str} @ {leg['odds']:.2f} ({leg['bookmaker']})")
            print(f"  Stake: ${stake:.2f}  →  Payout: ${payout:.2f}")
            print()

        profit = TOTAL_STAKE * (opp['profit_pct'] / 100)
        print(f"  Total Stake:        ${TOTAL_STAKE:.2f}")
        print(f"  Guaranteed Profit:  ${profit:.2f}")
        print('  ' + '=' * 58 + '\n')

        send_telegram_alert(opp)

# ─── Main ─────────────────────────────────────────────────────────────────────

def scan():
    print(f"Scanning {', '.join(LEAGUES)} for arbitrage opportunities...\n")

    all_events = []
    for league in LEAGUES:
        print(f'  Fetching {league} events...')
        events = fetch_events(league)
        print(f"  {'Found' if events else 'No'} {len(events)} {league} event(s)")
        all_events.extend(events)

    print()
    opportunities = find_arbitrage_opportunities(all_events)
    display_opportunities(opportunities)


def main():
    if MONITOR_MODE:
        print(f'Monitor mode — scanning every {MONITOR_INTERVAL}s. Press Ctrl+C to stop.\n')
        while True:
            scan()
            time.sleep(MONITOR_INTERVAL)
    else:
        scan()


if __name__ == '__main__':
    main()
