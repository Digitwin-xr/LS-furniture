import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { ClientProvider } from "@/engine/context/ClientContext";
import { getClientConfig } from "@/engine/config/client-config";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "900"],
});


export async function generateMetadata(): Promise<Metadata> {
  const config = getClientConfig();
  return {
    title: config.marketing.title,
    description: config.marketing.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getClientConfig();

  return (
    <html lang="en">
      <head>
        {/* Any custom meta tags can go here */}
      </head>

      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >





        <ClientProvider initialConfig={config}>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
