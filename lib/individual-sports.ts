const INDIVIDUAL_SPORTS = new Set(['Tennis', 'Badminton', 'Bordtennis', 'Golf', 'Snooker', 'Dart', 'Darts', 'MMA', 'Boksning'])

export const isIndividualSport = (sport: string) => INDIVIDUAL_SPORTS.has(sport)
