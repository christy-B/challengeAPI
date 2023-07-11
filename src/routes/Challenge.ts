import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IChallenge, IChallengeRO } from '../model/IChallenge';
import { ICreateResponse } from '../types/ICreateResponse';
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { DB } from '../utility/DB';


/// Pour tous les endpoints /
/// GET /
/// POST /

const routerUChallenge = Router({ mergeParams: true });

routerUChallenge.get<{}, IIndexResponse<IChallengeRO>, {}, IIndexQuery>('/',

  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from CHALLENGE");

      // Récupérer les lignes
      const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select id_challenge, nom_challenge, debut_challenge, id_promo, challenge_active from CHALLENGE limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IChallengeRO> = {
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


routerUChallenge.post<{}, ICreateResponse, IChallenge>('',
  async (request, response, next: NextFunction) => {

    try {
      const challenge = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into CHALLENGE set ?", challenge);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);


export const ROUTES_UCHALLENGE = routerUChallenge;