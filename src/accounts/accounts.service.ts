import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import * as argon2 from 'argon2';

import { Account, Keychain } from '@prisma/client';
import {
  SigninDto,
  SignupDto,
  UpdateAccountDto,
  UpdateWalletBalanceDto,
  VerifyCodeDto,
  ResetPasswordDto,
} from './accounts.dto';
import { IResponse } from '../../types/IResponse';
import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { KeychainsService } from '../keychains/keychains.service';
import { PostageService } from '../postage/postage.service';
import { KeychainDto } from '../keychains/keychains.dto';
import { PostageDto } from '../postage/postage.dto';

@Injectable({})
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  @Inject(PostageService)
  private readonly postage: PostageService;

  @Inject(KeychainsService)
  private readonly keychains: KeychainsService;

  // creates a new, unique kreative service number
  async generateKSN(): Promise<number> {
    let unique: boolean = false;
    let newKSN: number = 0;
    // create new 'nanoid' function with custom parameters
    const nanoid: Function = customAlphabet('123456789', 8);
    // loop to create a compltely unique ksn
    while (!unique) {
      // create new random ksn from function
      newKSN = parseInt(nanoid() as string);
      // check if the ksn exists in the database
      const account = await this.prisma.account.findUnique({
        where: { ksn: newKSN },
      });
      if (account === null) unique = true;
    }

    return newKSN;
  }

  // updates the wallet balance for the account
  async updateWalletBalance(dto: UpdateWalletBalanceDto): Promise<number> {
    let walletBalance: number;
    let account: Account;

    try {
      // retrieves the current account with ksn
      account = await this.prisma.account.findUnique({
        where: { ksn: dto.ksn },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    // sets the current accounts balance
    walletBalance = account.walletBalance;
    // updates the walletBalance amount
    const change = dto.type == 'debit' ? dto.amount : dto.amount * -1;
    walletBalance -= change;

    try {
      // updates the balance in the account
      // we don't store the change returned because we don't use it
      await this.prisma.account.update({
        where: { ksn: dto.ksn },
        data: { walletBalance },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    return walletBalance;
  }

  // creates a new user account and keychain
  async signup(dto: SignupDto): Promise<IResponse> {
    let account: Account;
    // create custom generate ksn
    const ksn: number = await this.generateKSN();
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
    const keychain: Keychain = await this.keychains.createKeychain(
      keychainData,
    );
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
      data: { account, keychain },
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
    const keychain: Keychain = await this.keychains.createKeychain(
      keychainData,
    );

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
      data: { account, keychain },
    } satisfies IResponse;
  }

  async updateAccount(dto: UpdateAccountDto): Promise<IResponse> {
    let account: any;

    // this version of updating the password is if the user does it in my.kreativeusa.com
    // this way they are authenticated and do not need a 'password reset code'
    // it generates new password hash with salt
    const bpassword: string = await argon2.hash(dto.password);

    try {
      // TODO add email verification flow (if email is different)
      // update account details and returns update
      account = await this.prisma.account.update({
        where: {
          email: dto.email,
        },
        data: {
          email: dto.email,
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          profilePicture: dto.profilePicture,
          bpassword,
        },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    console.log(account);
    console.log(bpassword);

    // send all neccessary data back to the client
    return {
      statusCode: 200,
      message: 'Account updated',
      data: { account },
    } satisfies IResponse;
  }

  // gets all non-sensitive info for one account
  async getAccount(ksn: number): Promise<IResponse> {
    let account: Account;

    try {
      account = await this.prisma.account.findUnique({
        where: { ksn },
      });
    } catch (error) {
      // handles prisma errors
      handlePrismaErrors(error);
    }

    // removes sensitive information
    delete account.bpassword, account.resetCode;

    // returns account
    return {
      statusCode: 200,
      message: 'Account found',
      data: account,
    } satisfies IResponse;
  }

  // creates a new reset code for the account and sends it
  async sendResetCode(ksn: number): Promise<IResponse> {
    let accountChange: any;
    // generates a new reset code as integer
    const nanoid: Function = customAlphabet('1234567890', 6);
    const resetCode: number = parseInt(nanoid() as string);

    try {
      // adds the resetCode to the account
      accountChange = await this.prisma.account.update({
        where: { ksn },
        data: { resetCode },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    // creates the data for the login notification email
    const codeEmailData: PostageDto = {
      toAddress: accountChange.email,
      subjectLine: 'Here is your reset code.',
      body: `Hello ${accountChange.firstName}, here is your reset code: ${resetCode}`,
      html: `<h2>Hello ${accountChange.firstName}, here is your reset code: ${resetCode}</h2>`,
    };

    // sends welcome email through PostageModule
    const mailResponse = await this.postage.sendEmail(codeEmailData);
    // verify the response from the postage module for pass/fail
    if (mailResponse.statusCode === 500) {
      // TODO: log PostageModule failing here so that we can fix it internally
      console.log(mailResponse.data);
    }

    // sends resetCode and accountChange
    return {
      statusCode: 200,
      message: 'Reset code created',
      data: { resetCode, accountChange },
    } satisfies IResponse;
  }

  // verifies the resetCode for the designated account
  async verifyResetCode(ksn: number, dto: VerifyCodeDto): Promise<IResponse> {
    let account: Account;
    let accountChange: any;

    try {
      // retrieves the accounts
      account = await this.prisma.account.findUnique({ where: { ksn } });
    } catch (error) {
      // handle any prisma errors
      handlePrismaErrors(error);
    }

    // checks for resetCode match
    if (!(account.resetCode === dto.resetCode)) {
      throw new UnauthorizedException('resetCode mismatch');
    }

    // removes the resetCode from the account
    try {
      accountChange = await this.prisma.account.update({
        where: { ksn },
        data: { resetCode: 0 },
      });
    } catch (error) {
      // handles any prisma error
      handlePrismaErrors(error);
    }

    // returns accountChange data
    return {
      statusCode: 200,
      message: 'resetCode verified',
      data: { accountChange },
    } satisfies IResponse;
  }

  async resetPassword(ksn: number, dto: ResetPasswordDto): Promise<IResponse> {
    let accountChange: any;
    // create salted password for update
    const bpassword: string = await argon2.hash(dto.password);

    try {
      // update the password for the account
      accountChange = await this.prisma.account.update({
        where: { ksn },
        data: { bpassword },
      });
    } catch (error) {
      // handle any prisma errors
      handlePrismaErrors(error);
    }

    // creates the data for the login notification email
    const passwordNotificationEmail: PostageDto = {
      toAddress: accountChange.email,
      subjectLine: 'Here is your reset code.',
      body: `Hello ${accountChange.firstName}, your password has been updated`,
      html: `<h2>Hello ${accountChange.firstName}, your password has been updated</h2>`,
    };

    // sends welcome email through PostageModule
    const mailResponse = await this.postage.sendEmail(
      passwordNotificationEmail,
    );
    // verify the response from the postage module for pass/fail
    if (mailResponse.statusCode === 500) {
      // TODO: log PostageModule failing here so that we can fix it internally
      console.log(mailResponse.data);
    }

    // sends back account change and successful response
    return {
      statusCode: 200,
      message: 'Password updated',
      data: { accountChange },
    } satisfies IResponse;
  }
}
