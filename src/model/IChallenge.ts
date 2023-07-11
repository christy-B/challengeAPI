// A noter, le ? veut dire que le champ est optionnel

export interface IChallenge {
    id_challenge: number;
    nom_challenge: string;
    debut_challenge: Date;
    id_promo: number;
    challenge_active: boolean;
  }
  
  // Outils de manipulation des types :
  // https://www.typescriptlang.org/docs/handbook/utility-types.html
  // Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
  export type IChallengeRO = Readonly<IChallenge>;
  
  export type IChallengeCreate = Omit<IChallenge, 'id_challenge'>;
  
  export type IChallengeUpdate = Partial<IChallengeCreate>;
  