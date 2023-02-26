export type Result = {
  constants: CardConstants,
  cards: Array<Card>
}

export type Edition = {
  id: number,
  nev: string,
  tipus: string,
  paklibaRakhato: boolean,
  megjelent: boolean,
  megjelenesDatum: string
}

export type IdStringPair = {
  [ key: string ]: string
}

export type CardConstants = {
  colors: IdStringPair,
  mainTypes: IdStringPair,
  subTypes: IdStringPair,
  otherTypes: IdStringPair,
  creatureSubTypes: Array<number>,
  editions: Array<Edition>,
  illustrators: IdStringPair
}

export type Card = {
  ID: number,
  name: string,
  text: string,
  link: string,
  type: Array<string>,
  color: Array<string>,
  commonness: string, // rarity
  editions: Array<number>
}

// Prettified versions

export type PrettyResults = {
  constants?: CardConstants,
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
  editions: Array<number | PrettyEdition>,
  rarity: string,
  url: string
}
