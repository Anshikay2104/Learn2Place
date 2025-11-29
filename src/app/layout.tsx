"use client";

import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>

        {/* WRAPPER FOR GLOBAL WEBSITE SCALE */}
        <div id="site-wrapper">

          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            {/* HEADER */}
            <Header />

            {/* MAIN CONTENT */}
            <main className="min-h-screen pt-20">
              {children}
            </main>

            {/* FOOTER */}
            <Footer />

            {/* SCROLL-TO-TOP BUTTON */}
            <ScrollToTop />
          </ThemeProvider>

        </div>
      </body>
    </html>
  );
}
