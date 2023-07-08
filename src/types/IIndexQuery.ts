/**
 * Paramètres de la requête de type **indexe**, notamment pour la pagination.
 */
export interface IIndexQuery {
  page?: string;
  limit?: string;
}

export type IReadWhere = Record<string, string | number>;

/* Ici, on utilise un générique, précisé par <T>
Ca veut dire qu'on va passer un autre type comme paramètre, qui sera utilisé à sa place
ex. const res : IIndexResponse<IUser> = {
  rows: [] // <-- Ici on ne peut juste affecter les structures de type IUser  
}
*/
export interface IIndexResponse<T> {
  page: number;
  limit: number;
  total: number;
  rows: T[];
}

/**
 * Structure retourné par MySQL quand on fait une requête de type `count(*)` 
 */
export interface ITableCount {
  total: number;
}
