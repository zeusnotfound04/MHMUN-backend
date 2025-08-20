import { 
  Poppins, 
  Inter, 
  Playfair_Display, 
  Roboto_Mono, 
  Merriweather,
  Open_Sans,
  Montserrat,
  Source_Code_Pro
} from "next/font/google";

// Primary font for body text and general UI
export const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

// Modern, clean font for headings and navigation
export const inter = Inter({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Elegant serif font for formal headers and titles
export const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// Monospace font for code and technical content
export const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

// Readable serif font for long-form content
export const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

// Clean sans-serif for body text alternative
export const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

// Modern geometric font for headings and branding
export const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Alternative monospace font for technical content
export const sourceCodePro = Source_Code_Pro({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});