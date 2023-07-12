import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { IUser, IUserRO } from '../model/IUser';
import { ICreateResponse } from '../types/ICreateResponse';
import { IDeleteResponse } from "../types/IDeleteResponse";
import { IIndexQuery, IIndexResponse, ITableCount } from '../types/IIndexQuery';
import { IUpdateResponse } from "../types/IUpdateResponse";
import { DB } from '../utility/DB';


/// Pour tous les endpoints /
/// GET /
/// POST /

const routerIndex = Router({ mergeParams: true });

routerIndex.get<{}, IIndexResponse<IUserRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;

      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from USER");

      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select id_user, nom_user, prenom_user, email_user, scope, id_promo from USER limit ? offset ?", [limit, offset]);

      // Construire la réponse
      const res: IIndexResponse<IUserRO> = {
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


routerIndex.post<{}, ICreateResponse, IUser>('',
  async (request, response, next: NextFunction) => {

    try {
      const user = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into USER set ?", user);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

/// Pour tous les endpoints /:userId
/// GET /:userId
/// PUT /:userId
/// DELETE /:userId

const routerSingle = Router({ mergeParams: true });

routerSingle.get<{ id_user: string }, IUserRO, {}>('',
  async (request, response, next: NextFunction) => {

    try {
      const userId = request.params.id_user;

      // ATTENTION ! Valider que le userId est valable ?

      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select id_user, nom_user, prenom_user, email_user, scope, id_promo from USER where id_user = ?", [userId]);

      // Construire la réponse

      // ATTENTION ! Que faire si le nombre de lignes est zéro ?

      const res = data[0][0];

      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);

routerSingle.put<{ id_user: string }, IUpdateResponse, IUser>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const userId = request.params.id_user;
      const body = request.body;

      const db = DB.Connection;
      // Récupérer les lignes
      const data = await db.query<OkPacket>(`update USER set ? where id_user = ?`, [body, userId]);

      // Construire la réponse
      const res = {
        id: userId,
        rows: data[0].affectedRows
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);

routerSingle.delete<{ id_user: string }, IDeleteResponse, {}>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const userId = request.params.id_user;
      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<OkPacket>(`delete from USER where id_user = ?`, [userId]);

      // Construire la réponse
      const res = {
        id: userId,
        rows: data[0].affectedRows
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);


/// Rassembler les 2 sous-routes 
const routerUser = Router({ mergeParams: true });
routerUser.use(routerIndex);
routerUser.use('/:id_user', routerSingle);

export const ROUTES_USER_ADMIN = routerUser;

const routerForUser = Router({ mergeParams: true });
routerUser.use(routerIndex);
routerUser.use('/:id_user', routerSingle);

export const ROUTES_USER = routerForUser;