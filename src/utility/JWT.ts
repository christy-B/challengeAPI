import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import { join } from 'path';

export class JWT {

  private static PRIVATE_KEY: string;
  private static PUBLIC_KEY: string;

  constructor() {
    if (!JWT.PRIVATE_KEY) {
      JWT.PRIVATE_KEY = readFileSync(process.env.PRIVATE_KEY_FILE || join('secrets', 'signing', 'signing.key'), 'ascii')
    }

    if (!JWT.PUBLIC_KEY) {
      JWT.PUBLIC_KEY = readFileSync(process.env.PUBLIC_KEY_FILE || join('secrets', 'signing', 'signing.pub'), 'ascii')
    }
  }

  async create(payload: any, options: jwt.SignOptions) {
    return new Promise(
      (resolve, reject) => {
        jwt.sign(payload, JWT.PRIVATE_KEY, Object.assign(options, { algorithm: 'RS256' }), (err: any, encoded) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(encoded);
        });
      }
    )
  }

  async decode(token: string, options: jwt.VerifyOptions) {
    return new Promise<any>(
      (resolve, reject) => {
        jwt.verify(token, JWT.PUBLIC_KEY, Object.assign(options, {
          algorithms: ['RS256']
        }), (err: any, decoded) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(decoded);
        })
      }
    )
  }
}
