import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const requiredPermissions: string[] = [
  'KREATIVE_ID_ADMIN',
  'KREATIVE_ID_DEVELOPER',
];

const PORT = process.env.PORT || 3000;

@Injectable()
export class AuthenticateUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // retrieve key and aidn from the request headers
    const key = req.headers['kreative_id_key'];
    const aidnString = req.headers['kreative_aidn'];
    const appchain = req.headers['kreative_appchain'];

    // parses the AIDN header as string to an integer
    // TODO make this implementation a lot better
    // @ts-ignore some sort of unassignable error is throw so we ignore the typescript error
    const aidn = parseInt(aidnString);

    if (key === undefined || aidn === undefined || appchain === undefined) {
      // the neccessary headers are not in the request, so middleware should fail
      logger.warn(
        'authenticate user middleware sent 400 due to missing key, aidn',
      );
      res.status(400).send({
        statusCode: 400,
        message: 'key, aidn, or appchain missing in headers',
      });
    }

    wretch('https://id-api.kreativeusa.com/v1/keychains/verify')
      .post({
        key,
        aidn,
        appchain,
      })
      .internalError((error) => {
        logger.warn('authenticate user middleware sent 500 error', error);
        res.status(500).send({
          statusCode: 500,
          message: 'internal server error',
        });
      })
      .forbidden((error) => {
        logger.warn('authenticate user middleware sent with 403 error', error);
        res.status(403).send({
          statusCode: 403,
          message: 'aidn mismatch',
        });
      })
      .unauthorized((error) => {
        logger.warn('authenticate user middleware sent 400 error', error);
        res.status(400).send({
          statusCode: 400,
          message: 'unauthorized',
        });
      })
      .notFound((error) => {
        logger.warn('authenticate user middleware sent 404 error', error);
        res.status(404).send({
          statusCode: 404,
          message: 'missing account or keychain',
        });
      })
      .json((response) => {
        // verifies that the user has the neccessary permissions
        const permissions: string[] = response.data.account.permissions;

        // checks to see if the user's permissions include the ones required
        // in other Kreative applications this will have to be manually configured based on number of permissions
        // we can't just say the user isn't authenticated, because they are, they just don't have the correct permissions
        // therefore we will throw a ForbiddenException with a custom message about permissions
        if (
          !(
            permissions.includes(requiredPermissions[0]) ||
            permissions.includes(requiredPermissions[1])
          )
        ) {
          // user does not have the correct permissions to continue with the request
          logger.warn('authenticate middleware sent 403 error', {
            userPermissions: permissions,
            requiredPermissions,
          });
          res.status(403).send({
            statusCode: 403,
            message: 'user doesnt have correct permissions',
          });
        } else {
          // checks to see if the AIDN on the keychain is the same AIDN as our application (Kreative ID non-test)
          // this is checking to see if the user on the client is sending through a keychain that was
          // created when they tried signing into this application
          // parses the environment variable for the HOST_AIDN
          const HOST_AIDN: number = parseInt(process.env.HOST_AIDN);

          if ((response.data.keychain.aidn as number) !== HOST_AIDN) {
            // sends back an UnauthorizedException
            logger.warn('authenticate middleware sent 401 error', {
              hostAidn: HOST_AIDN,
              givenAidn: response.data.data.keychain.aidn,
            });
            res.status(401).send({
              statusCode: 401,
              message: 'keychain.aidn does not match HOST_AIDN',
            });
          } else {
            // calls next() once everything passes
            logger.info('authenticate middleware passed');
            next();
          }
        }
      });
    cd;
  }
}
