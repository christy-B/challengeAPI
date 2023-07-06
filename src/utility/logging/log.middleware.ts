import morgan from 'morgan';
import { LogTag } from './LogTag';


/**
 * Un middleware qui crée un des logs des requêtes.
 * Si la variable d'environnement ENV == 'prod', le format JSON sera utilisé, sinon, un text classique
 * @param tag 
 * @returns 
 */
export const requestLogMiddleware = (tag: LogTag) => {
  return morgan(
    (tokens, req, res) => {
      if (process.env.NODE_ENV === 'prod') {
        return JSON.stringify({
          'tag': tag,
          'remote-address': tokens['remote-addr'](req, res),
          'remote-user': '',    // TODO
          'time': tokens['date'](req, res, 'iso'),
          'method': tokens['method'](req, res),
          'url': tokens['url'](req, res),
          'http-version': tokens['http-version'](req, res),
          'status-code': tokens['status'](req, res),
          'content-length': tokens['res'](req, res, 'content-length'),
          'referrer': tokens['referrer'](req, res),
          'user-agent': tokens['user-agent'](req, res),
          'response-time': tokens['response-time'](req, res),          
        });
      } else {
        return [
          tokens['date'](req, res, 'iso'),
          tokens['status'](req, res),
          tokens['method'](req, res),
          tokens['url'](req, res),
          tokens['res'](req, res, 'content-length'),
          tokens['response-time'](req, res)
        ].join(' ');
      }
    }
  );
}