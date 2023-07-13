import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { DB } from '../utility/DB';
import { IScore, IScoreRO } from "../model/IScore";

const routerScoreTest = Router({ mergeParams: true });

routerScoreTest.put<{}, IUpdateResponse, IScore>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const scoreId = request.body.id_score;
      const score = request.body.score

      const db = DB.Connection;
      // Récupérer les lignes
      const data = await db.query<OkPacket>(`update SCORE set score = ? where id_score = ? `, [score, scoreId]);

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

export const ROUTES_SCORE_PUT = routerScoreTest;
