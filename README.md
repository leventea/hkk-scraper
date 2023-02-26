# HKK Scraper

Scrapes (or at least attempts to) all cards from [HKK's card search site](https://lapkereso.hkk.hu/lapkereso).

## Warning

The script is probably produces a heavy load on their backend, so it shouldn't be run regularly.

## Usage

After installing the required packages using `npm i` (or any alternative), run the following command:

``` shell
npm start > output.json 
```

The script prints out the results to STDOUT, this should be piped into a file.
Logging is printed to STDERR, to avoid interfering with the resulting JSON.

## Result Structure
 
This is mostly identical to the results returned by their backend, but in a single JSON object.
The constants object is fetched from the `/cardConstants` endpoint.
The cards are fetched year-by-year then flattened into a single array.

```ts
type Result = {
    constants: CardConstants,
    cards: Array<Card>
}

type IdStringPair = {
  [ key: number ]: string
}

type IdStringPairs = Array<IdStringPair>

type CardConstants = {
  colors: IdStringPairs,
  mainTypes: IdStringPairs,
  subTypes: IdStringPairs,
  otherTypes: IdStringPairs,
  creatureSubType: IdStringPairs,
  editions: Array<Edition>,
  illustrators: IdStringPairs
}

type Card = {
  ID: number,
  name: string,
  text: string,
  link: string,
  type: Array<string>,
  color: Array<string>,
  commonness: string, // rarity
  editions: Array<number>
}
```

## Known issues

- The colors on the cards often include "Nincs" (none), along with the card's actual color
- Keys on most objects (with type `IdStringPairs`) often match their index (N - 1), with some exceptions (i.e. the illustrator object has gaps in its keys) 
