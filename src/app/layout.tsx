import type { Metadata, Viewport } from "next";
import PwaRegister from "./pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crescent RFI",
  description: "Crescent Contractors RFI and quality inspection portal.",
  applicationName: "Crescent RFI",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crescent RFI"
  },
  icons: {
    icon: "/crescent-rfi-512.png",
    shortcut: "/crescent-rfi-192.png",
    apple: "/crescent-rfi-512.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#091426",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PwaRegister />{children}</body></html>;
}
