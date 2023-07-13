// A noter, le ? veut dire que le champ est optionnel

export interface ISession {
    id_session: number;
    nom_session: string;
    debut_session: Date;
    id_promo: number;
    id_challenge: number;
    session_active: boolean;
  }

export interface ISessionPost {
  nom_session: string;
  debut_session: Date;
  id_promo: number;
  id_challenge: number;
}
  
  // Outils de manipulation des types :
  // https://www.typescriptlang.org/docs/handbook/utility-types.html
  // Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
  export type ISessionRO = Readonly<ISession>;
  
  export type ISessionCreate = Omit<ISession, 'id_session'>;
  
  export type ISessionUpdate = Partial<ISessionCreate>;
  