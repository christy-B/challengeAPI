import { NextFunction, Router } from "express";
import { IUserRO } from "../model/IUser";
import { IRequestMagicLink, IRequestMagicLinkResponse } from "../types/auth/IRequestMagicLink";
import { Crud } from "../utility/Crud";
import { Email } from "../utility/Email";
import { ApiError } from "../utility/Error/ApiError";
import { ErrorCode } from "../utility/Error/ErrorCode";
import { JWT } from "../utility/JWT";
import { IAccessToken } from '../types/auth/IAccessToken';

export const ISSUER = "api-auth";
export const MAGIC_AUD = "api-magic";
export const ACCESS_AUD = "api-access";
export const RENEW_AUD = "api-renew";

const router = Router({ mergeParams: true });

router.get<{}, IRequestMagicLinkResponse, {}, IRequestMagicLink>(
  '/magic',
  async (request, response, next: NextFunction) => {
    try {
      const email = request.query.email;
      if (!email) {
        throw new ApiError(ErrorCode.BadRequest, 'auth/missing-email', "Email is missing in magic link request.");
      }

      // Vérifier si on a un utilisateur avec l'adresse email dans notre base
      const user = await Crud.Read<IUserRO>({
        table: 'USER',
        idKey: 'email_user',
        idValue: email,
        columns: ['id_user', 'email_user', 'scope']
      });

      // Create the new JWT
      const jwt = new JWT();
      const encoded = await jwt.create(
        {
          id_user: user.id_user,
        },
        {
          expiresIn: '30 minutes',
          audience: MAGIC_AUD,
          issuer: ISSUER
        }
      ) as string;

      const emailer = new Email();
      const link = (process.env.FRONT_URL || 'http://localhost:' + (process.env.PORT || 5050)) + '/challenge/auth/login?jwt=' + encodeURIComponent(encoded);
      await emailer.sendMagicLink(email, link, 'Mon service');

      response.json({
        ok: true
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get<{}, {}, {}, { jwt: string }>(
  '/login',
  async (request, response, next: NextFunction) => {
    try {
      if (!request.query.jwt) {
        throw new ApiError(ErrorCode.BadRequest, 'auth/missing-magic-link-token', "Token is missing in login request.");
      }

      const jwt = new JWT();
      const decoded = await jwt.decode(request.query.jwt, {
        issuer: ISSUER,
        audience: MAGIC_AUD
      });

      if (!decoded.id_user) {
        throw new ApiError(ErrorCode.Unauthorized, 'auth/invalid-magic-link-token', "id_user was not found in the payload for token");
      }

      // Vérifier que l'utilisateur existe toujours
      const user = await Crud.Read<IUserRO>({
        table: 'USER',
        idKey: 'id_user',
        idValue: decoded.id_user,
        columns: ['id_user', 'scope']
      });

      let payload: IAccessToken = {
        id_user: user.id_user,
        scope: user.scope
      };

      const access = await jwt.create(payload, {
        expiresIn: '5 minute',
        issuer: ISSUER,
        audience: ACCESS_AUD
      });

      const renew = await jwt.create(payload, {
        expiresIn: '30 minute',
        issuer: ISSUER,
        audience: RENEW_AUD
      });

      response.json({
        access: access,
        renew: renew,
        redirectTo: 'https://lien.vers.mon.front/?access_token=' + access,
        message: 'Normalement ce endpoint va demander au navigateur de rediriger vers votre site ou ressource'
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post<{}, { access: string }, { renew_token: string }, {}>(
  '/renew',
  async (request, response, next: NextFunction) => {
    try {
      const renew_token = request.body?.renew_token;
      if (!renew_token) {
        throw new ApiError(ErrorCode.BadRequest, 'auth/missing-renew-token', "Renew token is missing in renew request.");
      }

      const jwt = new JWT();
      const decoded = await jwt.decode(renew_token, {
        issuer: ISSUER,
        audience: RENEW_AUD
      });

      if (!decoded || !decoded.id_user) {
        throw new ApiError(ErrorCode.Unauthorized, 'auth/invalid-renew-token', "id_user was not found in the payload for renew token");
      }

      // Vérifier que l'utilisateur existe toujours
      const user = await Crud.Read<IUserRO>({
        table: 'USER',
        idKey: 'id_user',
        idValue: decoded.id_user,
        columns: ['id_user', 'scope']
      });

      let payload: IAccessToken = {
        id_user: user.id_user,
        scope: user.scope
      };

      const access = await jwt.create(payload, {
        expiresIn: '5 minute',
        issuer: ISSUER,
        audience: ACCESS_AUD
      });

      response.json({
        access: access,
        redirectTo: 'https://lien.vers.mon.front/?access_token=' + access,
        message: 'Normalement ce endpoint va demander au navigateur de rediriger vers votre site ou ressource'
      } as { access: string, redirectTo: string, message: string });

    } catch (err) {
      next(err);
    }
  }
);


export const ROUTES_AUTH = router;
