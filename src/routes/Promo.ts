import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IPromo, IPromoRO } from '../model/IPromo';
import { ICreateResponse } from '../types/ICreateResponse';
import { IDeleteResponse } from "../types/IDeleteResponse";
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { DB } from '../utility/DB';


/// Pour tous les endpoints /
/// GET /
/// POST /

const routerPromo = Router({ mergeParams: true });

routerPromo.get<{}, IIndexResponse<IPromoRO>, {}, IIndexQuery>('/', 
    async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from PROMO");

      // Récupérer les lignes
      const data = await db.query<IPromoRO[] & RowDataPacket[]>("select id_promo, mon_promo from PROMO limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IPromoRO> = {
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


routerPromo.post<{}, ICreateResponse, IPromo>('',
  async (request, response, next: NextFunction) => {

    try {
      const promo = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into PROMO set ?", promo);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);


export const ROUTES_PROMO = routerPromo;