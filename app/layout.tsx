import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"BetTracker — SportsGameOdds",description:"SportsGameOdds arbitrage test"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="da"><body>{children}</body></html>}