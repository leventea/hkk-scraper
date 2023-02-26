# HKK Scraper

Scrapes (or at least attempts to) all cards from [HKK's card search site](https://lapkereso.hkk.hu/lapkereso).

## Warning

The script probably produces a heavy load on their backend, so it shouldn't be run regularly.

If you only need the results, please download it from the [releases](https://github.com/leventea/hkk-scraper/releases) tab.

## Usage

After installing the required packages using `npm i` (or any alternative), run the following command:

``` shell
npm start > output.json 
```

The results are printed to STDOUT, which should be piped into a file.
Logging is done on STDERR, to avoid interfering with the resulting JSON.

## Result Structure
 
This is mostly identical to the results returned by the backend, but in a single JSON object.
The constants object is fetched from the `/cardConstants` endpoint.
The cards are fetched year-by-year, then flattened into a single array.

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

# Prettify

The `prettify.ts` script attempts to fix most issues with the unmodified JSON results:
- Ability to inline editions
- Remove redundant colors from cards
- Strip whitespace from the end of card descriptions
- Make edition field names consistent by translating them to english 

## Usage

``` shell
cat previous_output.json | npm run prettify -ec > prettified_output.json
# where previous_output.json is the result of running `npm run`
```

## CLI Options

```
--inline-editions, -e
  Replace edition IDs with the respective edition object
  
--include-constants, -c
  Include the (unmodified) card constants
  
--no-fix-editions
  Don't translate edition keys
  
--no-fix-colors
  Don't remove redundant colors
  
--no-fix-text
  Don't strip whitespace from the end of card descriptions
```

## Prettified result structure

``` ts
export type PrettyResults = {
  constants?: CardConstants, // undefined if --include-constants is not set
  cards: Array<PrettyCard>
}

export type PrettyEdition = {
  id: number,
  type: string,
  allowedInDeck: boolean,
  released: boolean,
  releaseDate: string
}

export type PrettyCard = {
  id: number,
  name: string,
  text: string,
  link: string,
  type: Array<string>,
  color: Array<string>,
  editions: Array<number | PrettyEdition>, // number array if --no-fix-editions is set
  rarity: string,
  url: string
}
```
