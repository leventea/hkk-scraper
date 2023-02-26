import { fetchJson, fetchYear } from './fetch';
import type { CardConstants, Edition, Card } from './types';

function getYearRange(editions: Edition[]): [number, number] {
  // cant use the Date class for this, some day fields (2003-01-xx) are 00
  const years = editions
    .map(x => parseInt(x.megjelenesDatum.split('-')[0]!))
    .filter(x => x != 0);

  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;

  years.forEach(year => {
    if (year < min)
      min = year;

    if (year > max)
      max = year;
  });

  return [min, max];
}

async function main() {
  const constants = await fetchJson<CardConstants>('cardConstants');

  const [min, max] = getYearRange(constants!.editions);

  // list of all years to fetch
  const years = [...Array(max - min + 1).keys()].map(x => x + min);

  const promises = years.map(year => fetchYear(year)) as Promise<Card[] | null>[];
  const cardArrays: (Card[] | null)[] = await Promise.all(promises);

  let results: Card[] = [];
  cardArrays.forEach((cards, i) => {
    if (cards == null) {
      console.error(`null returned at year ${min + i}`);
      return;
    }

    results.push(...cards);
  })

  const output = {
    constants,
    cards: results
  }

  console.error(results.length);
  console.log(JSON.stringify(output));
}

main()
