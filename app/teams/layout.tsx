import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cricket Teams - Cricket Insights",
  description: "Explore international and domestic cricket teams with detailed statistics, player information, and match history.",
  keywords: "cricket teams, international cricket, domestic cricket, team statistics, cricket players",
  openGraph: {
    title: "Cricket Teams - Cricket Insights",
    description: "Explore international and domestic cricket teams with detailed statistics, player information, and match history.",
    type: "website",
  },
}

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}