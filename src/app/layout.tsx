import type { Metadata } from "next";
import ToastProvider from "@/components/providers/ToastProvider";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: {
    default: "Geo App",
    template: "%s | Geo App",
  },
  applicationName: "Geo App",
  description: "Geo App created using next app",
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
