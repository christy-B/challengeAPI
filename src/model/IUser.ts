
// Définition d'un structure IUser
// A noter, le ? veut dire que le champ est optionnel

export interface IUser {
  id_user: number;
  nom_user?: string;
  prenom_user?: string;
  email_user: string;
  scope: 'user'|'admin';
  id_promo: number;
}

// Outils de manipulation des types :
// https://www.typescriptlang.org/docs/handbook/utility-types.html
// Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
export type IUserRO = Readonly<IUser>;

export type IUserCreate = Omit<IUser, 'id_user'>;

export type IUserUpdate = Partial<IUserCreate>;
