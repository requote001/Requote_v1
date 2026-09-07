import type { Metadata, Viewport } from "next";
import "../src/index.css";
import "../src/App.css";
import "./product.css";
import "./legal-auth.css";
import "./request.css";
import "./responsive.css";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://requote.cc",
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Requote | Post Requests and Compare Trusted Offers",
    template: "%s | Requote",
  },
  description:
    "Post what you need, compare offers from capable providers, and manage clearer, protected transactions from agreement through delivery with Requote.",
  keywords: [
    "Requote",
    "request marketplace",
    "service providers Nigeria",
    "compare offers",
    "protected payments",
    "skilled professionals",
    "Nigerian marketplace",
  ],
  authors: [{ name: "Requote" }],
  creator: "Requote",
  applicationName: "Requote",
  alternates: {
    canonical: "/",
    languages: {
      "en-NG": "/",
      "x-default": "/",
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "Requote",
    title: "Requote | Tell Us What You Need. Get Trusted Offers.",
    description:
      "Post what you need, compare offers from capable providers, and manage clearer, protected transactions from agreement through delivery.",
    images: [
      {
        url: "/requote-social-card.png",
        width: 1200,
        height: 630,
        alt: "Requote — tell us what you need and get trusted offers.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Requote | Tell Us What You Need. Get Trusted Offers.",
    description:
      "Post what you need, compare capable providers, and manage clearer, protected transactions through Requote.",
    images: ["/requote-social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12203D",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://requote.cc/#organization",
      name: "Requote",
      url: "https://requote.cc/",
      logo: {
        "@type": "ImageObject",
        url: "https://requote.cc/requote-logo.png",
        width: 363,
        height: 110,
      },
      email: "info@requote.cc",
      areaServed: { "@type": "Country", name: "Nigeria" },
    },
    {
      "@type": "WebSite",
      "@id": "https://requote.cc/#website",
      url: "https://requote.cc/",
      name: "Requote",
      description: "A request-and-offer marketplace for products and services.",
      publisher: { "@id": "https://requote.cc/#organization" },
      inLanguage: "en-NG",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
