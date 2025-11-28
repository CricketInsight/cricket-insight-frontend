import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cricket Matches - Live Scores & Results | Cricket Insights",
  description: "Follow live cricket matches, scores, results and upcoming fixtures from international and domestic cricket tournaments.",
  keywords: "cricket matches, live cricket scores, cricket results, cricket fixtures, match updates",
  openGraph: {
    title: "Cricket Matches - Live Scores & Results",
    description: "Follow live cricket matches, scores, results and upcoming fixtures from international and domestic cricket tournaments.",
    type: "website",
  },
}

export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}