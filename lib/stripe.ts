import Stripe from "stripe";

/**
 * Initializes a new instance of the Stripe client.
 *
 * @constant
 * @param {string} process.env.STRIPE_API_KEY - The API key for authenticating with the Stripe service.
 * @param {Object} options - Configuration options for the Stripe client.
 * @param {string} options.apiVersion - The version of the Stripe API to use.
 * @param {boolean} options.typescript - Indicates whether TypeScript is being used.
 */
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});
