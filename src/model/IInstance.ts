// A noter, le ? veut dire que le champ est optionnel

export interface IInstance {
    id_instance: number;
    ip_instance: string;
    port_instance: number;
    user_instance: string;
    password_instance: string;
  }
  
  // Outils de manipulation des types :
  // https://www.typescriptlang.org/docs/handbook/utility-types.html
  // Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
  export type IInstanceRO = Readonly<IInstance>;
  
  export type IInstanceCreate = Omit<IInstance, 'id_instance'>;
  
  export type IInstanceUpdate = Partial<IInstanceCreate>;
  