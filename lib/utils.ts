import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import localFont from "next/font/local";
import { Poppins } from "next/font/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const headingFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
});

export const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export function absoluteUrl(path: string) {
  return process.env.NEXT_PUBLIC_APP_URL + path;
}
