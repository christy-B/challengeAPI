import { OkPacket, RowDataPacket } from 'mysql2';
import { DbTable } from '../model/DbTable';
import { ICreateResponse } from '../types/ICreateResponse';
import { IIndexQuery, IIndexResponse, IReadWhere, ITableCount } from '../types/IIndexQuery';
import { IUpdateResponse } from '../types/IUpdateResponse';
import { DB } from './DB';
import { ApiError } from './Error/ApiError';
import { ErrorCode } from './Error/ErrorCode';


/**
 * Class qui fournit des fonctions utilitaires pour les opérations ICRUD.
 * 
 * @todo Pour l'instant la fonction Index ne marche que sur une seule table. Ajouter une fonction qui permet de faire des requêtes plus complexes (avec des joins et/ou aggrégations). Est-qu'il est possible de généraliser au maximum une telle opération, tout en laissant de la fléxibilité ?
 */
export class Crud {

  /**
   * Récupérer une page de lignes d'une table, en précisant les colonnes souhaitées
   * @param query L'objet contenant les paramètres optionnels de pagination.
   * @param table La table de la base de données à interroger
   * @param columns Un tableau de colonnes à retourner
   * @returns IIndexResponse contenant les résultats de la recherche.   
   * @todo Ajouter la possibilité de préciser les colonnes dans la requête ?
   */
  public static async Index<T>(options: {
    query?: IIndexQuery, 
    table: DbTable, 
    columns: string[], 
    where?: IReadWhere
  }) : Promise<IIndexResponse<T>> {

    const db = DB.Connection;      
    // On suppose que le params query sont en format string, et potentiellement
    // non-numérique, ou corrompu
    const page = parseInt(options.query?.page || "0") || 0;
    const limit = parseInt(options.query?.limit || "10") || 0;
    
    const offset = page * limit;

    // D'abord, récupérer le nombre total
    let whereClause = '';
    let whereValues: any[] = [];
    if (options.where) {
      const whereList: string[] = [];
      Object.entries(options.where).forEach(
        ([key, value]) => {
          whereList.push(key + ' = ?');
          whereValues.push(value);
        }
      )
      whereClause = 'where  ' + whereList.join(' and ');
    }

    // console.log(mysql.format(`select count(*) as total from ${table} ${whereClause}`, whereValues))

    const count = await db.query<ITableCount[] & RowDataPacket[]>(`select count(*) as total from ${options.table} ${whereClause}`, whereValues);      

    // Récupérer les lignes
    const sqlBase = `select ${options.columns.join(',')} from ${options.table} ${whereClause} limit ? offset ?`;
    const data = await db.query<T[] & RowDataPacket[]>(sqlBase, [...whereValues, limit, offset].filter(e => e !== undefined));

    // Construire la réponse
    const res: IIndexResponse<T> = {
      page,
      limit,
      total: count[0][0].total,
      rows: data[0]
    }

    return res;
  }

  public static async Create<T>(options: {
    body: T, 
    table: DbTable
  }): Promise<ICreateResponse> {
    const db = DB.Connection;
    const data = await db.query<OkPacket>(`insert into ${options.table} set ?`, options.body);

    return {
      id: data[0].insertId
    }   
  }

  public static async Update<T>(options: {
    body: T, 
    table: DbTable, 
    idKey: string, 
    idValue: number|string
  }): Promise<IUpdateResponse> {
    const db = DB.Connection;

    const data = await db.query<OkPacket>(`update ${options.table} set ? where ${options.idKey} = ?`, [options.body, options.idValue]);

    return {
      id: options.idValue,
      rows: data[0].affectedRows
    } 
  }

  public static async Read<T>(options: {
    table: DbTable, 
    idKey: string, 
    idValue: number|string, 
    columns: string[]
  }): Promise<T> {
    const db = DB.Connection;
    const data = await db.query<T[] & RowDataPacket[]>(`select ${options.columns.join(',')} from ${options.table} where ${options.idKey} = ?`, [options.idValue]);      

    if (data[0].length > 0) {
      return data[0][0];
    } else {
      throw new ApiError(ErrorCode.BadRequest, 'sql/not-found', `Could not read row with ${options.idKey} = ${options.idValue}`);
    }
  }

  public static async Delete(options: {
    table: DbTable, 
    idKey: string, 
    idValue: number|string
  }): Promise<IUpdateResponse> {
    const db = DB.Connection;
    const data = await db.query<OkPacket>(`delete from ${options.table} where ${options.idKey} = ?`, [options.idValue]);      

    return {
      id: options.idValue,
      rows: data[0].affectedRows
    }  
  }

}
