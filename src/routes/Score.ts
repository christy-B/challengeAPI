import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { ICreateResponse } from '../types/ICreateResponse';
import { DB } from '../utility/DB';
import { IScore, IScoreRO } from "../model/IScore";
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { ISessionRO } from "../model/ISession";
import { IUpdateResponse } from "../types/IUpdateResponse";


const routerScoreSingle = Router({ mergeParams: true });

routerScoreSingle.get<{ user_foreign_key: string , session_foreign_key: string}, IScoreRO, {}>('',
  async (request, response, next: NextFunction) => {

    try {
      const userId = request.params.user_foreign_key;
      const sessionId = request.params.session_foreign_key;

      // ATTENTION ! Valider que le userId est valable ?

      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<IScore[] & RowDataPacket[]>("select id_score, score, user_foreign_key, session_foreign_key from SCORE where user_foreign_key = ? and session_foreign_key = ?", [userId, sessionId]);

      // Construire la réponse

      // ATTENTION ! Que faire si le nombre de lignes est zéro ?

      const res = data[0][0];

      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);


routerScoreSingle.post<{}, ICreateResponse, IScore>('',
  async (request, response, next: NextFunction) => {

    try {
      const score = request.body.score;
      const user_foreign_key = request.body.user_foreign_key
      const session_foreign_key = request.body.session_foreign_key

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into SCORE set ?", [score, user_foreign_key, session_foreign_key]);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

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

const routerScoreTest = Router({ mergeParams: true });

routerScoreTest.put<{}, IUpdateResponse, IScore>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const scoreId = request.body.id_score;
      const id_score = request.body.id_score

      const db = DB.Connection;
      // Récupérer les lignes
      const data = await db.query<OkPacket>(`update SCORE set score = ? where id_score = ? `, [scoreId, id_score]);

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

const routerScores = Router({ mergeParams: true });
// routerScores.use(routerScore);

export const ROUTES_SCORE_ADMIN = routerScores;


/// Rassembler les 2 sous-routes 
const routerScoreUser = Router({ mergeParams: true });
routerScoreUser.use(routerScoreSingle);
routerScoreUser.use('/:user_foreign_key/:session_foreign_key', routerScoreSingle);
// routerScores.use('/:id_score', routerScore_);

export const ROUTES_SCORE = routerScoreUser;

export const ROUTES_SCORE_PUT = routerScoreTest;