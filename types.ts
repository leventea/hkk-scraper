export type Result = {
  constants: CardConstants,
  cards: Array<Card>
}

export type Edition = {
  id: number,
  nev: string,
  tipus: string,
  paklibaRakhato: string,
  megjelent: boolean,
  megjelenesDatum: string
}

export type IdStringPair = {
  [ key: number ]: string
}

export type IdStringPairs = Array<IdStringPair>

export type CardConstants = {
  colors: IdStringPairs,
  mainTypes: IdStringPairs,
  subTypes: IdStringPairs,
  otherTypes: IdStringPairs,
  creatureSubType: IdStringPairs,
  editions: Array<Edition>,
  illustrators: IdStringPairs
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
