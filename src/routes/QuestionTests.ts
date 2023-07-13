import { NextFunction, Request, Response, Router } from "express";
import { RowDataPacket } from 'mysql2';
import { IQuestionRO } from '../model/IQuestion';
import { DB } from '../utility/DB';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { ScoreTest } from "../types/TestResponse";



const routerQuestionsScore = Router({ mergeParams: true });

routerQuestionsScore.put<{ id_score: string }, IUpdateResponse, ScoreTest>('',
  async (request, response, next: NextFunction) => {
    try {

      const scoreId = Number(request.params.id_score);

      const db = DB.Connection;

      const data = await db.query<IQuestionRO[] & RowDataPacket[]>("select id_question, question_text, question_description, bonne_reponse, question_score from QUESTION");
  
      // Construire la réponse
      console.log("ha");

      const res:ScoreTest = {
        connectConfig:request.body.connectConfig,
        user: request.body.user,
        questions: data[0],
        id_score: scoreId
      }

      request.body = res;

      next(request)

    } catch (err: any) {
      next(err);
    }
  }
);

const noRouter = async (request:Request, response:Response, next: NextFunction) => {
  try {

    const scoreId = Number(request.params.id_score);

    const db = DB.Connection;

    const data = await db.query<IQuestionRO[] & RowDataPacket[]>("select id_question, question_text, question_description, bonne_reponse, question_score from QUESTION");

    // Construire la réponse

    const res:ScoreTest = {
      connectConfig:request.body.connectConfig,
      user: request.body.user,
      questions: data[0],
      id_score: scoreId
    }

    request.body = res;

    next()

  } catch (err: any) {
    next(err);
  }
}

routerQuestionsScore.use('/:id_score', routerQuestionsScore);


export const controllerQuestionsTests = noRouter  ;
