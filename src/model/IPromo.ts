// A noter, le ? veut dire que le champ est optionnel

export interface IPromo {
    id_promo: number;
    mon_promo: string;
  
  
  }
  
  // Outils de manipulation des types :
  // https://www.typescriptlang.org/docs/handbook/utility-types.html
  // Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
  export type IPromoRO = Readonly<IPromo>;
  
  export type IPromoCreate = Omit<IPromo, 'id_promo'>;
  
  export type IPromoUpdate = Partial<IPromoCreate>;