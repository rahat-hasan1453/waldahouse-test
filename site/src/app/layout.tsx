import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Jost, Marcellus } from "next/font/google";
import { CraftDefs } from "@/components/craft-defs";
import "./globals.css";

const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Hotel Waldhaus am See · St. Moritz — On the lake since 1885",
    template: "%s · Waldhaus am See, St. Moritz",
  },
  description:
    "The only hotel directly on Lake St. Moritz. Family-run since 1885, home of Devil's Place — Guinness World Record holder for the world's largest whisky selection — and 1,300+ fine wines.",
};

/*
 * Runs before first paint: reveal hidden-states only exist under html.js (content stays visible
 * without JavaScript), and html.intro-seen shortens the hero intro on later visits in a session.
 */
const bootstrap = `document.documentElement.classList.add('js');try{sessionStorage.getItem('wh-intro')&&document.documentElement.classList.add('intro-seen');sessionStorage.setItem('wh-intro','1')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body className="antialiased">
        <CraftDefs />
        {children}
      </body>
    </html>
  );
}
