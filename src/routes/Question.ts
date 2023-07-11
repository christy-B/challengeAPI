import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IQuestion, IQuestionRO } from '../model/IQuestion';
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { DB } from '../utility/DB';

/// Pour tous les endpoints /:userId
/// GET /:userId
/// PUT /:userId
/// DELETE /:userId

const routerQuestion = Router({ mergeParams: true });

routerQuestion.get<{}, IIndexResponse<IQuestionRO>, {}, IIndexQuery>('',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from QUESTION");

      // Récupérer les lignes
      const data = await db.query<IQuestionRO[] & RowDataPacket[]>("select id_question, question_text, question_description, bonne_reponse, question_score from QUESTION limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IQuestionRO> = {
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

export const ROUTES_QUESTION = routerQuestion  ;
