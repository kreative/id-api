import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';

import { IResponse } from 'types/IResponse';
import { PostageDto } from './postage.dto';

const mailgun = new Mailgun(FormData).client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

@Injectable()
export class PostageService {
  constructor() {}

  async sendEmail(dto: PostageDto): Promise<IResponse> {
    // mailgun data for the email to be sent
    const data = {
      from: dto.fromAddress || `"Kreative" <mailgun@mail.kreativeusa.com>`,
      replyTo: dto.replyTo || 'armaan@kreativeusa.com',
      to: dto.toAddress,
      subject: dto.subjectLine,
      text: dto.body,
      html: dto.html,
    };

    // sends an email using mailgun message API
    mailgun.messages
      .create('mail.kreativeusa.com', data)
      .then((response: any) => {
        return {
          statusCode: 200,
          message: 'Success',
          data: response,
        } satisfies IResponse;
      })
      .catch((error: any) => {
        // handle any unknown error that comes up
        // we don't want to throw an exception because if sending an email doesn't work
        // the rest of the program should still continue
        return {
          statusCode: 500,
          message: 'Internal server error',
          data: error,
        } satisfies IResponse;
      });

    // this is a catch all error handler
    // this will only run if for some reason the mailgun sdk doesn't work
    return {
      statusCode: 500,
      message: 'Internal server error',
    } satisfies IResponse;
  }
}
