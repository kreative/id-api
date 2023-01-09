import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';

import { IResponse } from 'types/IResponse';
import { PostageDto } from './postage.dto';

@Injectable({})
export class PostageService {
  constructor() {}

  async sendEmail(dto: PostageDto): Promise<IResponse> {
    let info: any;
    // create a new nodemailer object with AWS SES
    const mailer = nodemailer.createTransport({
      SES: new AWS.SES(),
    });

    try {
      // send mail with data from the DTO, loads data to info
      info = await mailer.sendMail({
        from: dto.fromAddress || '"Armaan Gupta" <armaan@kreativeusa.com>',
        replyTo: dto.replyTo || 'armaan@kreativeusa.com',
        to: dto.toAddress,
        subject: dto.subjectLine,
        text: dto.body,
        html: dto.html,
      });
    } catch (error) {
      // handle any unknown error that comes up
      // we don't want to throw an exception because if sending an email doesn't work
      // the rest of the program should still continue
      return {
        statusCode: 500,
        message: 'Internal server error',
        data: error,
      } satisfies IResponse;
    }

    // sends back success response
    return {
      statusCode: 200,
      message: 'Success',
      data: info,
    } satisfies IResponse;
  }
}
