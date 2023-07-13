import { NextFunction, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { ISession, ISessionRO } from '../model/ISession';
import { DB } from '../utility/DB';


/// session USER scope
/// Pour tous les endpoints /
/// GET /
/// POST /

const routerUserSession = Router({ mergeParams: true });

routerUserSession.get<{ id_promo: string }, ISessionRO, {} >('/:id_promo',

  async (request, response, next: NextFunction) => {

    try {

      const idPromo = request.params.id_promo

      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<ISessionRO[] & RowDataPacket[]>("select id_session, nom_session, debut_session, id_promo, id_challenge, session_active from SESSION where id_promo = ? order by debut_session desc limit 1 ", [idPromo]);

      // Construire la réponse
      const res: ISessionRO = data[0][0];
      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);



export const ROUTES_USER_SESSION = routerUserSession;