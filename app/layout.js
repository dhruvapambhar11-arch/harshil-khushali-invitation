import "./globals.css";

export const metadata = {
  title: "Harshil weds Khushali",
  description:
    "Harshil ke jeevan ki khili Khushali - 23rd & 24th November 2026, Rajkot.",
  openGraph: {
    title: "Harshil weds Khushali",
    description: "23rd & 24th November 2026, Rajkot.",
    type: "website",
  },
};

/* The invitation drives its own scrolling and sits edge to edge, so the shell
   adds no header, footer or page chrome of its own. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fdfaf5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="h-full">
        {children}
      </body>
    </html>
  );
}
