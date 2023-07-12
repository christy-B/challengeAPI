import { NextFunction, Router } from "express";
import { RowDataPacket } from 'mysql2';
import { IQuestionRO } from '../model/IQuestion';
import { DB } from '../utility/DB';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { ConnectConfig } from "ssh2";
import { IUserRO } from "../model/IUser";
import { IQuestion } from "../model/IQuestion";

/// Pour tous les endpoints /:userId
/// GET /:userId
/// PUT /:userId
/// DELETE /:userId

type ScoreTest = {
  connectConfig:ConnectConfig;
  user: IUserRO;
  questions: IQuestion[];
  id_score:number
}

const newOne = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const db = DB.Connection;

    const data = await db.query<IQuestionRO[] & RowDataPacket[]>("select id_question, question_text, question_description, bonne_reponse, question_score from QUESTION");

    // next({
    //   connectConfig:req.body.connectConfig,
    //   user: req.body.user,
    //   questions: data[0]
    // })
    
  } catch (error) {
    next(error)
  }
}


const routerQuestionsScore = Router({ mergeParams: true });

routerQuestionsScore.put<{ id_score: string }, IUpdateResponse, ScoreTest>('',
  async (request, response, next: NextFunction) => {
    try {

      const scoreId = request.params.id_score;

      const db = DB.Connection;

      const data = await db.query<IQuestionRO[] & RowDataPacket[]>("select id_question, question_text, question_description, bonne_reponse, question_score from QUESTION");
  
      // Construire la réponse
      next({
        connectConfig:request.body.connectConfig,
        user: request.body.user,
        questions: data[0],
        id_score: scoreId
      })

    } catch (err: any) {
      next(err);
    }
  }
);

routerQuestionsScore.use('/:id_score', routerQuestionsScore);


export const controllerQuestionsTests = routerQuestionsScore  ;
