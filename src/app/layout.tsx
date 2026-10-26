import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Crescent | Request for Inspection", description: "Standalone Request for Inspection portal for project quality and inspection tracking." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
