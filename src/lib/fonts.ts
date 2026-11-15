import { Anton, Doto, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
  preload: true,
});

export const doto = Doto({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-doto",
  display: "swap",
  preload: false,
});

export const instrument = Instrument_Serif({
  weight: "400",
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
});

export const fontVariables = [anton, doto, instrument, geist, geistMono]
  .map((f) => f.variable)
  .join(" ");
