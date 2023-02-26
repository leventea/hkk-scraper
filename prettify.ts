import { parseArgs } from 'node:util';
import { frontendCardBaseUrl } from "./constants";
import type { Card, Edition, PrettyEdition, PrettyCard, Result, PrettyResults } from "./types";

// command line options

const { values } = parseArgs({
  allowPositionals: false,
  options: {
    "inline-editions": {
      type: 'boolean',
      short: 'e'
    },
    "include-constants": {
      type: 'boolean',
      short: 'c'
    },
    "no-fix-editions": {
      type: 'boolean'
    },
    "no-fix-colors": {
      type: 'boolean'
    },
    "no-fix-text": {
      type: 'boolean'
    }
  }
});

// STDIN handling

const stdin = process.openStdin();

let jsonData = '';
stdin.on('data', (chunk) => {
  jsonData += chunk;
});

stdin.on('end', () => {
  let data = JSON.parse(jsonData) as Result;

  if ('url' in data.cards[0]!
    || !('constants' in data)) {
    console.error('input file already prettified');
    process.exit(1);
  }

  // Generate an id => edition object
  let editionsLookup: { [id: number]: Edition|PrettyEdition } = {};
  if (values['inline-editions']) {
    editionsLookup = data.constants.editions
      .map(e => values['no-fix-editions'] ? e : fixEdition(e));
  }

  const cards = data.cards.map(c => fixCard(c, editionsLookup));

  const results: PrettyResults = {
    ...( values['include-constants'] ? { constants: data.constants } : {} ),
    cards
  }

  console.log(JSON.stringify(results))
});

// utility functions

function fixCard(card: Card, editions: any): PrettyCard {
  const cardText = values['no-fix-text']
    ? card.text
    : card.text.replace(/ *\r$/, ''); // strip whitespace from end of the string

  let newCard: any = {
    id: card.ID,
    ...card,
    text: cardText,
    rarity: card.commonness,
    url: getCardUrl(card)
  }

  // delete replaced keys
  const deleteKeys = ['ID', 'commonness'];
  deleteKeys.forEach(key => {
    delete newCard[key];
  })

  // inline editions
  if (values['inline-editions'])
    newCard.editions = newCard.editions.map((e: number) => editions[e]);

  // attempt to fix colors
  if (!values['no-fix-colors']
    && newCard.color.includes('Nincs')
    && newCard.color.length > 1) {
    newCard.color = newCard.color.filter((c: string) => c != 'Nincs')
  }

  return newCard as PrettyCard;
}

function getCardUrl(card: Card): string {
  return `${frontendCardBaseUrl}/${card.link}/${card.ID}`;
}

function fixEdition(edition: Edition): PrettyEdition {
  return {
    id: edition.id,
    type: edition.tipus,
    allowedInDeck: edition.paklibaRakhato,
    released: edition.megjelent,
    releaseDate: edition.megjelenesDatum
  }
}
