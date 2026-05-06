import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MuiProvider from "./components/MuiProvider";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "CampusNotify – Campus Notification Platform",
  description:
    "Stay on top of your campus notifications — Placements, Results, and Events in one place. Never miss what matters most.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: "#0D0D1A", minHeight: "100vh" }}>
        <MuiProvider>
          <Navbar />
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
