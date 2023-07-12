import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IQuestion, IQuestionRO } from '../model/IQuestion';
// import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { DB } from '../utility/DB';

/// Pour tous les endpoints /:userId
/// GET /:userId
/// PUT /:userId
/// DELETE /:userId

const router = Router({ mergeParams: true });

router.get<{ id_challenge: string }, IQuestionRO, {}>('',
  async (request, response, next: NextFunction) => {

    try {
      const challengeId = request.params.id_challenge;

      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<IQuestionRO[] & RowDataPacket[]>("select id_question, question_description, question_score, id_challenge from QUESTION where id_challenge = ?", [challengeId]);

      // Construire la réponse
      const res = data[0][0];

      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);
const routerQuestion = Router({ mergeParams: true });
routerQuestion.use('/:id_challenge', router);

export const ROUTES_QUESTION = routerQuestion  ;
