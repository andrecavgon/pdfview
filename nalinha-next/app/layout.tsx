import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

const SITE = process.env.SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "NA LINHA", template: "%s · Na Linha" },
  description: "Na Linha — livros, leitura, literatura e crítica, em Cascais.",
  openGraph: { siteName: "Na Linha", locale: "pt_PT", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6f0df" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Herr+Von+Muellerhoff&family=Marcellus&family=Cormorant+Garamond:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <svg width="0" height="0" style={{position:"absolute"}} aria-hidden="true"><filter id="afina"><feMorphology operator="erode" radius="0.25" /></filter></svg>
        <div className="page">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
