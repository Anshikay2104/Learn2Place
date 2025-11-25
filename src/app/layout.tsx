import { Poppins } from "next/font/google";
import "./globals.css";

import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";

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
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
        >
          {/* GLOBAL HEADER */}
          <Header />

          {/* PAGE CONTENT */}
          <main className="min-h-screen">{children}</main>

          {/* GLOBAL FOOTER */}
          <Footer />

          {/* SCROLL TO TOP BTN */}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
