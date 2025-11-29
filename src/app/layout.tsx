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

      {/* PREVENT FIRST-LOAD SHIFT — SET SCALE BEFORE HYDRATION */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.style.setProperty('--site-scale', '0.85');
            document.documentElement.style.setProperty('--site-width', '117.6470588235%');
          `,
        }}
      />

      <body className={font.className}>

        {/* WRAPPER USED FOR SCALING */}
        <div id="site-wrapper">
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            <Header />

            <main className="min-h-screen pt-20">
              {children}
            </main>

            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </div>

      </body>
    </html>
  );
}
