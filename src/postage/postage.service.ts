import { Injectable } from '@nestjs/common';
import * as aws from "@aws-sdk/client-ses";
import * as nodemailer from "nodemailer";
import { defaultProvider } from "@aws-sdk/credential-provider-node"

import { IResponse } from 'types/IResponse';
import { PostageDto } from './postage.dto';

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: process.env.AWS_REGION_ID,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  },
  // @ts-ignore
  defaultProvider,
});
@Injectable()
export class PostageService {
  constructor() {}

  async sendEmail(dto: PostageDto): Promise<IResponse> {
    let info: any;
    // create a new nodemailer object with AWS SES
    const mailer = nodemailer.createTransport({
      SES: { ses, aws },
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
