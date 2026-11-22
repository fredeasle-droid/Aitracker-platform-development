/** Surebets shown on the Surebets page (after rows for the same market are grouped). */
export const MAX_OPPORTUNITIES = 50
/**
 * Raw scanner rows kept in the database. One surebet often has many rows (one per bookmaker pair),
 * so this must be well above MAX_OPPORTUNITIES or the grouped list ends up much shorter than 50.
 */
export const MAX_STORED_OPPORTUNITIES = 400
