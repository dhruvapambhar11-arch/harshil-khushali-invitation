import "./globals.css";

/* Chat apps build the link preview from these tags alone, and need the image
   as an absolute URL - metadataBase is what turns app/opengraph-image.jpg into
   one. */
export const metadata = {
  metadataBase: new URL("https://harshil-khushali-invitation.vercel.app"),
  title: "Harshil weds Khushali",
  description:
    "Harshil ke jeevan ki khili Khushali - 23rd & 24th November 2026, Rajkot.",
  openGraph: {
    title: "Harshil weds Khushali",
    description: "23rd & 24th November 2026, Rajkot.",
    url: "/",
    siteName: "Harshil weds Khushali",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
