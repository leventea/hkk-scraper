import { apiBaseUrl } from './constants';
import type { Card } from './types';

export async function fetchJson<T>(endpoint: string, opts?: RequestInit): Promise<T|null> {
  const res = await fetch(`${apiBaseUrl}/${endpoint}`, opts);

  if (!res.ok)
    return null;

  const json = await res.json();
  return json as T;
}

// NOTE: the backend will not return more than 1000 cards per query
// but if we query year-by-year, the # of results never goes above the limit
export async function fetchYear(year: number): Promise<Card[] | null> {
  const res = await fetchJson<{ cards: Card[] }>(`kereses&megjelenes=${year}-${year}`);

  if (!res)
    return null;

  return res.cards;
}
