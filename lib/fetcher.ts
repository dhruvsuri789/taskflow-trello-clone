/* export const fetcher = (url: string) => {
  return fetch(url).then((res) => res.json());
}; */

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};
