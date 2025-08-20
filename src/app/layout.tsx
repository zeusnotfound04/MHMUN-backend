import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";
import { Navbar } from "@/components/Navbar";
import { 
  poppins, 
  inter, 
  playfairDisplay, 
  robotoMono, 
  merriweather,
  openSans,
  montserrat,
  sourceCodePro
} from "@/lib/font";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VBPS MUN Portal",
  description: "Vishwa Bharati Public School Dwarka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} ${playfairDisplay.variable} ${robotoMono.variable} ${merriweather.variable} ${openSans.variable} ${montserrat.variable} ${sourceCodePro.variable} antialiased`}
       >
        <Providers>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
