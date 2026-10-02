import { integer, numeric, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const opportunities = pgTable('opportunities', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  country: text('country').notNull(),
  countryCode: text('country_code').notNull(),
  league: text('league').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  market: text('market').notNull(),
  kickoff: timestamp('kickoff', { withTimezone: true }).notNull(),
  aLabel: text('a_label').notNull(),
  aBookmaker: text('a_bookmaker').notNull(),
  aOdds: numeric('a_odds', { precision: 6, scale: 2 }).notNull(),
  bLabel: text('b_label').notNull(),
  bBookmaker: text('b_bookmaker').notNull(),
  bOdds: numeric('b_odds', { precision: 6, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const appUsers = pgTable('app_users', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const favorites = pgTable(
  'favorites',
  {
    userId: text('user_id').notNull(),
    opportunityId: integer('opportunity_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.opportunityId] })],
)

export const bets = pgTable('bets', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  opportunityId: integer('opportunity_id'),
  sport: text('sport').notNull().default('Fodbold'),
  match: text('match').notNull(),
  market: text('market').notNull(),
  stake: numeric('stake', { precision: 12, scale: 2 }).notNull(),
  expectedProfit: numeric('expected_profit', { precision: 12, scale: 2 }).notNull(),
  profit: numeric('profit', { precision: 12, scale: 2 }),
  status: text('status').notNull().default('open'),
  kickoff: timestamp('kickoff', { withTimezone: true }).notNull(),
  placedAt: timestamp('placed_at', { withTimezone: true }).notNull().defaultNow(),
  settledAt: timestamp('settled_at', { withTimezone: true }),
})
