
// Définition d'un structure IUser
// A noter, le ? veut dire que le champ est optionnel

export interface IScore {
  id_score: number;
  score: number;
  user_foreign_key: number;
  session_foreign_key: number;
}

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IScoreRO = Readonly<IScore>;

export type IScoreCreate = Omit<IScore, 'id_score'>;

export type IScoreUpdate = Partial<IScoreCreate>;
