import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { DB } from '../utility/DB';
import { ISessionRO } from "../model/ISession";


const routerScore = Router({ mergeParams: true });

routerScore.get<{}, IIndexResponse<ISessionRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from SCORE");

      // Récupérer les lignes
      const data = await db.query<ISessionRO[] & RowDataPacket[]>("select id_score, score,user_foreign_key, session_foreign_key from SCORE limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<ISessionRO> = {
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

const routerScores = Router({ mergeParams: true });
// routerScores.use(routerScore);

export const ROUTES_SCORE_ADMIN = routerScores;