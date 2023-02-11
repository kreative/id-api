import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Application } from '@prisma/client';
import { customAlphabet, nanoid } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { IResponse } from 'types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { NewApplicationDto, UpdateApplicationDto, VerifyAppchainDto } from './applications.dto';
import logger from '../../utils/logger';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  // creates a new, unique application id number
  async generateAIDN(): Promise<number> {
    let unique = false;
    let newAIDN = 0;
    // create new 'nanoid' function with custom parameters
    const nanoid = customAlphabet('123456789', 6);
    // loop to create a compltely unique ksn
    while (!unique) {
      // create new random ksn from function
      newAIDN = parseInt(nanoid() as string);
      // check if the ksn exists in the database
      logger.info(`prisma.application.findUnique in generateAIDN initiated`);
      const application = await this.prisma.application.findUnique({
        where: { aidn: newAIDN },
      });
      if (application === null) unique = true;
    }

    logger.info(`new aidn ${newAIDN} generated`);
    return newAIDN;
  }

  // creates a new, unique long appchain string
  async generateAppchain(): Promise<string> {
    let unique = false;
    // creates a new 'nanoid' function with default parameters
    const newAppchain: string = nanoid();
    // loop to create a completely unique appchain
    while (!unique) {
      logger.info(
        `prisma.application.findUnique in generateAppchain initiated`,
      );
      const application = await this.prisma.application.findUnique({
        where: { appchain: newAppchain },
      });
      if (application === null) unique = true;
    }

    logger.info(`new appchain ${newAppchain} generated`);
    return newAppchain;
  }

  // creates a new application
  async createApplication(dto: NewApplicationDto): Promise<IResponse> {
    let application: Application;

    // generate a new AIDN
    const aidn: number = await this.generateAIDN();

    // generate a new appchain
    const appchain: string = await this.generateAppchain();

    try {
      // create new application with prisma
      logger.info(`prisma.application.create initiated with aidn: ${aidn}`);
      application = await this.prisma.application.create({
        data: {
          aidn,
          appchain,
          name: dto.name,
          callbackUrl: dto.callbackUrl,
        },
      });
    } catch (error) {
      // handle any errors prisma throws
      logger.error({ message: `prisma.application.create failed`, error });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Application created',
      data: { application },
    };

    logger.info({ message: `createApplication succeeded`, payload });
    return payload;
  }

  // get a list of all applications
  async getAllApplications(): Promise<IResponse> {
    let applications: Application[];

    try {
      // find all applications
      logger.info(`prisma.application.findMany initiated`);
      applications = await this.prisma.application.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      // handle any errors prisma throws
      logger.error({ message: `prisma.application.findMany failed`, error });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Applications found',
      data: applications,
    };

    logger.info({ message: `getAllApplications passed`, payload });
    return payload;
  }

  // retrieves information for a single applicaiton by AIDN
  async getOneApplication(aidn: number): Promise<IResponse> {
    let application: Application;

    try {
      // gets one application from given AIDN
      logger.info(`prisma.application.findUnique initiated with aidn: ${aidn}`);
      application = await this.prisma.application.findUnique({
        where: { aidn },
      });
    } catch (error) {
      // handles any prisma errors
      logger.error(
        `prisma.application.findUnique with aidn: ${aidn} failed`,
        error,
      );
      handlePrismaErrors(error);
    }

    if (application === null || application === undefined) {
      // no application was found with the aidn that was passed
      // this behavior should not happen with actual clients as no unknown aidn should exist
      logger.warn(`no application found with aidn: ${aidn}`);
      throw new NotFoundException('Application not found');
    } else {
      const payload: IResponse = {
        statusCode: 200,
        message: 'Application found',
        data: { application },
      };

      logger.info({
        message: `getOneApplication succeeded with aidn: ${aidn}`,
        payload,
      });
      return payload;
    }
  }

  // updates one application by AIDN
  async updateApplication(
    aidn: number,
    dto: UpdateApplicationDto,
  ): Promise<IResponse> {
    let applicationChange: any;
    let newAppchain: string;

    if (dto.refreshAppchain) {
      logger.info(`refreshing appchain for aidn: ${aidn}`);
      newAppchain = await this.generateAppchain();
    }

    try {
      if (dto.refreshAppchain) {
        // updates the application with a new appchain
        logger.info(
          `prisma.application.update initiated with aidn: ${aidn}, with new appchain`,
        );
        applicationChange = await this.prisma.application.update({
          where: { aidn },
          data: {
            name: dto.name,
            callbackUrl: dto.callbackUrl,
            appchain: newAppchain,
          },
        });
      } else {
        // updates the application without a new appchain
        logger.info(
          `prisma.application.update initiated with aidn: ${aidn}, no new appchain`,
        );
        applicationChange = await this.prisma.application.update({
          where: { aidn },
          data: {
            name: dto.name,
            callbackUrl: dto.callbackUrl,
          },
        });
      }
    } catch (error) {
      // handle any prisma errors
      logger.error({
        message: `prisma.error.update with aidn: ${aidn} failed`,
        error,
      });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Application updated',
      data: { applicationChange },
    };

    logger.info({
      message: `updateApplication succeeded with aidn: ${aidn}`,
      payload,
    });
    return payload;
  }

  // deletes an application from given AIDN
  async deleteApplication(aidn: number): Promise<IResponse> {
    let deleteApplication: any;

    try {
      // deletes application with prisma
      logger.info(`prisma.application.delete initiated with aidn: ${aidn}`);
      deleteApplication = await this.prisma.application.delete({
        where: { aidn },
      });
    } catch (error) {
      // handles any prisma errors
      logger.error({
        message: `prisma.application.delete with aidn: ${aidn} failed`,
        error,
      });
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Application deleted',
      data: { deleteApplication },
    };

    logger.info({
      message: `deleteApplication succeeded with aidn: ${aidn}`,
      payload,
    });
    return payload;
  }

  async verifyAppchain(
    aidn: number,
    dto: VerifyAppchainDto,
  ): Promise<IResponse> {
    let application: Application;

    try {
      // gets one application from given aidn
      logger.info(
        `prisma.application.findUnique initiated with appchain: ${aidn}`,
      );
      application = await this.prisma.application.findUnique({
        where: { aidn },
      });
    } catch (error) {
      // handle any prisma errors that come up
      logger.error({
        message: `prisma.application.findUnique in verifyAppchain with aidn: ${aidn} failed`,
        error,
      });
      handlePrismaErrors(error);
    }

    if (application === null || application === undefined) {
      // no application was found with the aidn that was passed
      // this behavior should not happen with actual clients as no unknown aidn should exist
      logger.warn(`no application found with aidn: ${aidn}`);
      throw new NotFoundException('Application not found in verifyAppchain');
    }

    if (application.appchain !== dto.appchain) {
      throw new ForbiddenException('Appchain mismatch');
    }

    // removes sensitive data from application
    delete application.appchain;

    const payload: IResponse = {
      statusCode: 200,
      message: 'Appchain verified',
      data: { application },
    };

    logger.info({
      message: `verifyAppchain succeeded with aidn: ${aidn}`,
      payload,
    });
    return payload;
  }
}
