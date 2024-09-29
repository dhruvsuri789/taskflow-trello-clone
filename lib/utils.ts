import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import localFont from "next/font/local";
import { Poppins } from "next/font/google";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes intelligently.
 *
 * @param {...ClassValue[]} inputs - An array of class values to be combined.
 * @returns A single string with the combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Defines a custom font for headings by loading a local font file.
 *
 * @constant {Object} headingFont - The custom font configuration for headings.
 * @property {string} src - The path to the local font file.
 */
export const headingFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
});

export const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

/**
 * Constructs an absolute URL by appending the given path to the base URL
 * specified in the environment variable NEXT_PUBLIC_APP_URL.
 *
 * @param {string} path - The relative path to append to the base URL.
 * @returns a string - The absolute URL.
 */
export function absoluteUrl(path: string) {
  return process.env.NEXT_PUBLIC_APP_URL + path;
}
