import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import argon2 from 'argon2';

import { Account } from '@prisma/client';
import { SigninDto, SignupDto, UpdateAccountDto } from './accounts.dto';
import { IResponse } from 'types/IResponse';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaErrors } from 'utils/handlePrismaErrors';
import { KeychainsService } from 'src/keychains/keychains.service';
import { PostageService } from 'src/postage/postage.service';
import { KeychainDto } from 'src/keychains/keychains.dto';
import { PostageDto } from 'src/postage/postage.dto';

@Injectable({})
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private postage: PostageService,
    private keychains: KeychainsService,
  ) {}

  // creates a new, unique kreative service number
  async generateKSN(): Promise<bigint> {
    let unique: boolean = false;
    let newKSN: bigint = BigInt(0);
    // create new 'nanoid' function with custom parameters
    const nanoid: Function = customAlphabet('123456789', 12);
    // loop to create a compltely unique ksn
    while (!unique) {
      // create new random ksn from function
      newKSN = BigInt(parseInt(nanoid() as string));
      // check if the ksn exists in the database
      const ksn = await this.prisma.account.findUnique({
        where: { ksn: newKSN },
      });
      if (ksn === null) unique = true;
    }

    return newKSN;
  }

  // creates a new user account and keychain
  async signup(dto: SignupDto): Promise<IResponse> {
    let account: Account;
    // create custom generate ksn
    const ksn: bigint = await this.generateKSN();
    // generate the hashed password
    const bpassword: string = await argon2.hash(dto.password);

    try {
      // create the new user in prisma
      account = await this.prisma.account.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          username: dto.username,
          bpassword,
          ksn,
        },
      });
    } catch (error) {
      // handles any prisma errors that come up
      handlePrismaErrors(error);
    }

    // removes sensitive information from account object
    delete account.bpassword, account.resetCode;
    // creates a new keychain in the database and returns key
    const keychainData: KeychainDto = { ksn, aidn: dto.aidn };
    const key: string = await this.keychains.createKeychain(keychainData);
    // creates the data for the welcome email
    const welcomeEmailData: PostageDto = {
      toAddress: dto.email,
      subjectLine: 'Welcome to Kreative!',
      body: `Hello ${dto.firstName}, welcome to Kreative.`,
      html: `<h2>Hello ${dto.firstName}, welcome to Kreative.</h2>`,
    };
    // sends welcome email through PostageModule
    const mailResponse = await this.postage.sendEmail(welcomeEmailData);
    // verify the response from the postage module for pass/fail
    if (mailResponse.statusCode === 500) {
      // TODO: log PostageModule failing here so that we can fix it internally
      console.log(mailResponse.data);
    }

    // TODO: add send email_address verification email + that flow
    // send back positive response, account object, and key
    return {
      statusCode: 200,
      message: 'Account created',
      data: { account, key },
    } satisfies IResponse;
  }

  // creates a new keychain after authentication
  async signin(dto: SigninDto): Promise<IResponse> {
    let account: Account;
    let passwordsMatch: boolean;

    try {
      // finds the account in the database based on unique email
      account = await this.prisma.account.findUnique({
        where: { email: dto.email },
      });
    } catch (error) {
      // handle any prisma errors that occur
      handlePrismaErrors(error);
    }

    try {
      // check if password given matches password on file
      passwordsMatch = await argon2.verify(account.bpassword, dto.password);
    } catch (err) {
      // internal failure
      throw new InternalServerErrorException();
    }

    // throw 401 error since passwords do not match
    if (!passwordsMatch) throw new UnauthorizedException();

    // removes sensitive information from account object
    delete account.bpassword, account.resetCode;
    // creates a new keychain in the database and returns key
    const keychainData: KeychainDto = { ksn: account.ksn, aidn: dto.aidn };
    const key: string = await this.keychains.createKeychain(keychainData);

    // creates the data for the login notification email
    const loginEmailData: PostageDto = {
      toAddress: dto.email,
      subjectLine: 'There has been a recent login on your Kreative account.',
      body: `Hello ${account.firstName}, there has been a signin on your account.`,
      html: `<h2>Hello ${account.firstName}, there has been a signin on your account.</h2>`,
    };

    // sends welcome email through PostageModule
    const mailResponse = await this.postage.sendEmail(loginEmailData);
    // verify the response from the postage module for pass/fail
    if (mailResponse.statusCode === 500) {
      // TODO: log PostageModule failing here so that we can fix it internally
      console.log(mailResponse.data);
    }

    // send all neccessary data back to the client
    return {
      statusCode: 200,
      message: 'Account logged in',
      data: { account, key },
    } satisfies IResponse;
  }

  async updateAccount(dto: UpdateAccountDto): Promise<IResponse> {
    let account: any;

    // generate new password hash with salt
    const bpassword: string = await argon2.hash(dto.password);

    try {
      // TODO add email verification flow (if email is different)
      // update account details and returns update
      account = this.prisma.account.update({
          where: {
              email: dto.email,
          },
          data: {
              email: dto.email,
              username: dto.username,
              firstName: dto.firstName,
              lastName: dto.lastName,
              profilePicture: dto.profilePicture,
              bpassword
          }
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    // send all neccessary data back to the client
    return {
      statusCode: 200,
      message: 'Account updated',
      data: { account },
    } satisfies IResponse;
  }
}
