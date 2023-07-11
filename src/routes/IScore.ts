import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { ICreateResponse } from '../types/ICreateResponse';
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { DB } from '../utility/DB';
import { IScore } from "../model/IScore";
import { IChallengeRO } from "../model/IChallenge";


/// Pour tous les endpoints /
/// GET /
/// POST /

const routerScore = Router({ mergeParams: true });

routerScore.get<{}, IIndexResponse<IChallengeRO>, {}, IIndexQuery>('/',
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
      const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select id_score, score,user_foreign_key, challenge_foreign_key from SCORE limit ? offset ?", [limit, offset]);
     
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


routerScore.post<{}, ICreateResponse, IScore>('',
  async (request, response, next: NextFunction) => {

    try {
      const score = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into SCORE set ?", score);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

const routerScore_ = Router({ mergeParams: true });

routerScore_.put<{ id_score: string }, IUpdateResponse, IScore>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const scoreId = request.params.id_score;
      const body = request.body;

      const db = DB.Connection;
      // Récupérer les lignes
      const data = await db.query<OkPacket>(`update SCORE set ? where id_score = ?`, [body, scoreId]);

      // Construire la réponse
      const res = {
        id: scoreId,
        rows: data[0].affectedRows
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);


/// Rassembler les 2 sous-routes 
const routerScores = Router({ mergeParams: true });
routerScores.use(routerScore);
routerScores.use('/:id_score',routerScore_);

export const ROUTES_SCORE = routerScores;