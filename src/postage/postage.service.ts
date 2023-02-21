import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';

import { PostageDto } from './postage.dto';
import logger from '../../utils/logger';

const mailgun = new Mailgun(FormData).client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

@Injectable()
export class PostageService {
  async sendEmail(dto: PostageDto): Promise<void | boolean> {
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
        logger.info({ message: `new email sent`, response });
        return true;
      })
      .catch((error: any) => {
        // handle any unknown error that comes up
        // we don't want to throw an exception because if sending an email doesn't work
        // the rest of the program should still continue to work
        logger.error({ message: `new email send failed`, error });
        return false;
      });
  }
}
