import { createApi } from "unsplash-js";

/**
 * Creates an instance of the Unsplash API client.
 *
 * @constant
 * @property {string} accessKey - The access key for the Unsplash API, retrieved from environment variables.
 * @property {function} fetch - The fetch function to make HTTP requests.
 */
export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch: fetch,
});
