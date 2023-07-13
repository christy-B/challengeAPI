import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { ISession, ISessionRO } from '../model/ISession';
import { ICreateResponse } from '../types/ICreateResponse';
import { IDeleteResponse } from "../types/IDeleteResponse";
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { DB } from '../utility/DB';


/// Pour tous les endpoints /
/// GET /
/// POST /

const routAdminSession = Router({ mergeParams: true });

routAdminSession.get<{}, IIndexResponse<ISessionRO>, {}, IIndexQuery>('/',

  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from SESSION");

      // Récupérer les lignes
      const data = await db.query<ISessionRO[] & RowDataPacket[]>("select id_session, nom_session, debut_session, id_promo, id_challenge, session_active from SESSION limit ? offset ?", [limit, offset]);

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


routAdminSession.post<{}, ICreateResponse, ISession>('',
  async (request, response, next: NextFunction) => {

    try {
      const session = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into SESSION set ?", [session]);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

const routAdminSession_ = Router({ mergeParams: true });

routAdminSession_.delete<{ id_session: string }, IDeleteResponse, {}>('',
  async (request, response, next: NextFunction) => {
    try {

      const sessionId = request.params.id_session;
      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<OkPacket>(`delete from SESSION where id_session = ?`, [sessionId]);

      // Construire la réponse
      const res = {
        id: sessionId,
        rows: data[0].affectedRows
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);


/// Rassembler les 2 sous-routes 
const routAdminSessions = Router({ mergeParams: true });
routAdminSessions.use(routAdminSession);
routAdminSessions.use('/:id_session', routAdminSession_);

export const ROUTES_ADMIN_SESSION = routAdminSessions;