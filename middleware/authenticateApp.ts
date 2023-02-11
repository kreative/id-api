import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import logger from '../utils/logger';

const PORT = process.env.PORT || 3000;

@Injectable()
export class AuthenticateAppMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // retrieve aidn and appchain from the request headers
    const aidnString = req.headers['kreative_aidn'];
    const appchain = req.headers['kreative_appchain'];

    console.log(req.headers);
    console.log(aidnString);

    // parses the AIDN header as string to an integer
    // TODO make this implementation a lot better
    // @ts-ignore some sort of unassignable error is throw so we ignore the typescript error
    const aidn = parseInt(aidnString);

    if (aidn === undefined || appchain === undefined) {
      // the neccessary headers are not in the request, so middleware should fail
      logger.error(
        'authenticate app middleware sent 400 due to missing aidn, appchain',
      );
      res.status(400).send({
        statusCode: 400,
        message: 'aidn or appchain missing in headers',
      });
    }

    // verify the appchain using an AXIOS request (not using the Appchain Service)
    axios
      .post(
        `http://localhost:${PORT}/v1/applications/${aidn}/appchain/verify`,
        { appchain },
      )
      .then((response) => {
        // status code is between 200-299
        if (response.data.statusCode === 200) {
          // appchain is valid, so we can continue with the request
          logger.info({
            message: "verify appchain route in middleware sent 200 'ok'",
            data: response.data,
          });
          next();
        }
      })
      .catch((error) => {
        // status code is not between 200-299
        const statusCode = error.response.data.statusCode;

        if (statusCode === 403) {
          // ForbiddenException (appchain mismatch)
          logger.error({
            message:
              'authenticate app middleware failed with 403 error for appchain mismatch',
            error,
          });
          res
            .status(403)
            .send({ statusCode: 403, message: 'appchain mismatch' });
        } else if (statusCode === 404) {
          // NotFoundException, either account or key isn't found
          // either way something is majorly incorrect so we have to throw an error
          logger.error({
            message:
              'authenticate app middleware failed with 404 error for missing account or application',
            error,
          });
          res.status(404).send({
            statusCode: 404,
            message: 'application not found with given aidn',
          });
        } else if (statusCode === 500) {
          // InternalServerException
          logger.error({
            message:
              'authenticate app middleware failed with 500 error for internal server error',
            error,
          });
          res
            .status(500)
            .send({ statusCode: 500, message: 'error from server side' });
        }
      });
  }
}
