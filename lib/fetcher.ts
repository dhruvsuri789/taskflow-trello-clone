/* export const fetcher = (url: string) => {
  return fetch(url).then((res) => res.json());
}; */

/**
 * Fetches data from the given URL and returns the parsed JSON response.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns - A promise that resolves to the parsed JSON response.
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};
