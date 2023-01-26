import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const requiredPermissions: string[] = [
  'KREATIVE_ID_ADMIN',
  'KREATIVE_ID_DEVELOPER',
];

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // retrieve key and aidn from the request headers
    const key = req.headers['kreative_id_key'];
    const aidnString = req.headers['kreative_aidn'];

    // parses the AIDN header as string to an integer
    // @ts-ignore some sort of unassignable error is throw so we ignore the typescript error
    const aidn = parseInt(aidnString);

    if (key === undefined || aidn === undefined) {
      // the neccessary headers are not in the request, so middleware should fail
      res
        .status(400)
        .send({ statusCode: 400, message: 'key or aidn missing in headers' });
    }

    // verify the key using an AXIOS request (not using the Keychain Service)
    axios
      .post('http://localhost:3000/v1/keychains/verify', { key, aidn })
      .then((response) => {
        // status code is between 200-299
        if (response.data.statusCode === 200) {
          // verifies that the user has the neccessary permissions
          const permissions: string[] = response.data.data.account.permissions;

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
            res.status(403).send({
              statusCode: 403,
              message: 'user doesnt have correct permissions',
            });
          } else {
            // checks to see if the AIDN on the keychain is the same AIDN as our application (Kreative ID non-test)
            // parses the enviroment variable for the HOST_AIDN
            const HOST_AIDN: number = parseInt(process.env.HOST_AIDN);

            if ((response.data.data.keychain.aidn as number) !== HOST_AIDN) {
              // sends back an UnauthorizedException
              res.status(401).send({
                statusCode: 401,
                message: 'keychain.aidn does not match HOST_AIDN',
              });
            } else {
              // calls next() once everything passes
              next();
            }
          }
        }
      })
      .catch((error) => {
        // status code is not between 200-299
        const statusCode = error.response.statusCode;

        if (statusCode === 404) {
          // NotFoundException, either account or key isn't found
          // either way something is majorly incorrect so we have to throw an error
          res
            .status(401)
            .send({ statusCode: 404, message: 'aidn or key is not found' });
        } else if (statusCode === 401) {
          // UnauthorizedException (the keychain is expired)
          // since the user is trying to make a request with an expired keychain we throw another UnauthorizedException
          res
            .status(401)
            .send({ statusCode: 401, message: 'expired keychain' });
        } else if (statusCode === 403) {
          // ForbiddenException (aidn mismatch)
          res.status(403).send({ statusCode: 403, message: 'aidn mismatch' });
        } else if (statusCode === 500) {
          // InternalServerException
          res
            .status(500)
            .send({ statusCode: 500, message: 'error from server side' });
        } else {
          // some unknown error through unknown status code
          res.status(500).send({ statusCode: 500, message: 'unknown error' });
        }
      });
  }
}
