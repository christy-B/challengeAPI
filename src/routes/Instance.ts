import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IInstance, IInstanceRO } from "../model/IInstance";
import { ICreateResponse } from '../types/ICreateResponse';
import { IDeleteResponse } from "../types/IDeleteResponse";
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { DB } from '../utility/DB';


/// Pour tous les endpoints /
/// GET /
/// POST /

const routerInstance = Router({ mergeParams: true });

routerInstance.get<{}, IIndexResponse<IInstanceRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from INSTANCE");

      // Récupérer les lignes
      const data = await db.query<IInstanceRO[] & RowDataPacket[]>("select id_instance, ip_instance, user_instance, user_foreign_key from INSTANCE limit ? offset ?", [limit, offset]);
  
      // Construire la réponse
      const res: IIndexResponse<IInstanceRO> = {
        page,
        limit,
        total: count[0][0].total,
        rows: data[0]
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);


routerInstance.post<{}, ICreateResponse, IInstance>('',
  async (request, response, next: NextFunction) => {

    try {
      const instance = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into INSTANCE set ?", instance);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);


export const ROUTES_INSTANCE = routerInstance;