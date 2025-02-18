import "./css/style.css";
import { Inter } from "next/font/google";
import Header from "@/components/ui/header";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { ThemeProvider as NextThemesProvider } from "next-themes";

config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Point Blank",
  description: "A group of developers who love to code.",
  keywords: ["developers", "coding", "programming", "software"],
  author: "Point Blank Team",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      
      <body
        className={`${inter.variable} font-inter antialiased bg-black text-white tracking-tight`}
      >
        <NextThemesProvider>
          <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
            <Header />
            {children}
          </div>
        </NextThemesProvider>
      </body>
    </html>
  );
}
