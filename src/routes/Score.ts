import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { ICreateResponse } from '../types/ICreateResponse';
import { DB } from '../utility/DB';
import { IScore, IScoreRO } from "../model/IScore";
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { ISession } from "../model/ISession";


const routerScoreSingle = Router({ mergeParams: true });

routerScoreSingle.get<{ user_foreign_key: string , id_promo: string}, IScoreRO, {}>('',
  async (request, response, next: NextFunction) => {

    try {
      const userId = request.params.user_foreign_key;
      const promoId = request.params.id_promo;

      // ATTENTION ! Valider que le userId est valable ?

      const db = DB.Connection;

      const dataSession = await db.query<ISession[] & RowDataPacket[]>('select id_session from `SESSION` where id_promo = ? order by debut_session desc limit 1', [promoId])

      const idSession = dataSession[0][0].id_session;

      // console.log("session")
      // console.log(dataSession)

      // Récupérer les lignes
      const data = await db.query<IScore[] & RowDataPacket[]>("select id_score, score, user_foreign_key, session_foreign_key from SCORE where session_foreign_key = ? and user_foreign_key = ?", [idSession, userId]);

      // Construire la réponse

      // console.log("score")
      // console.log(data)

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
      const score = 0;
      const user_foreign_key = request.body.user_foreign_key
      const session_foreign_key = request.body.session_foreign_key

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into SCORE (score, user_foreign_key, session_foreign_key) values ( ?, ?, ?)", [score, user_foreign_key, session_foreign_key]);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

const routerScore = Router({ mergeParams: true });

routerScore.get<{ session_foreign_key: string }, IIndexResponse<IScoreRO>, {}, IIndexQuery>('',
  async (request, response, next: NextFunction) => {

    try {

      const sessionId = request.params.session_foreign_key;

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "100") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from SCORE");

      // Récupérer les lignes
      const data = await db.query<IScoreRO[] & RowDataPacket[]>("select id_score, score, user_foreign_key, session_foreign_key from SCORE where session_foreign_key = ? limit ? offset ?", [sessionId, limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IScoreRO> = {
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
routerScores.use(routerScore);
routerScores.use('/:session_foreign_key', routerScore);

export const ROUTES_SCORE_ADMIN = routerScores;


/// Rassembler les 2 sous-routes 
const routerScoreUser = Router({ mergeParams: true });
routerScoreUser.use(routerScoreSingle);
routerScoreUser.use('/:user_foreign_key/:id_promo', routerScoreSingle);
// routerScores.use('/:id_score', routerScore_);

export const ROUTES_SCORE = routerScoreUser;

export const ROUTES_SCORE_PUT = routerScoreTest;