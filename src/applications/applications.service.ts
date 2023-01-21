import { Injectable, NotFoundException } from '@nestjs/common';
import { Application } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { IResponse } from 'types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { ApplicationDto, AidnDto } from './applications.dto';
import logger from '../../utils/logger';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  // creates a new, unique application id number
  async generateAIDN(): Promise<number> {
    let unique: boolean = false;
    let newAIDN: number = 0;
    // create new 'nanoid' function with custom parameters
    const nanoid: Function = customAlphabet('123456789', 6);
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

  // creates a new application
  async createApplication(dto: ApplicationDto): Promise<IResponse> {
    let application: Application;

    // generate a new AIDN
    const aidn: number = await this.generateAIDN();

    try {
      // create new application with prisma
      logger.info(`prisma.application.create initiated with aidn: ${aidn}`);
      application = await this.prisma.application.create({
        data: {
          aidn,
          name: dto.name,
          callbackUrl: dto.callbackUrl,
        },
      });
    } catch (error) {
      // handle any errors prisma throws
      logger.error(`prisma.application.create error: ${error}`);
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Application created',
      data: application,
    };

    logger.info(`createApplication succeeded with payload: ${payload}`);
    return payload;
  }

  // get a list of all applications
  async getAllApplications(): Promise<IResponse> {
    let applications: Application[];

    try {
      // find all applications
      logger.info(`prisma.application.findMany initiated`);
      applications = await this.prisma.application.findMany();
    } catch (error) {
      // handle any errors prisma throws
      logger.error(`prisma.application.findMany error: ${error}`);
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Applications found',
      data: applications,
    };

    logger.info(`getAllApplications passed with payload: ${payload}`);
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
        `prisma.application.findUnique with aidn: ${aidn} error: ${error}`,
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

      logger.info(`getOneApplication succeeded with aidn: ${aidn}`);
      return payload;
    }
  }

  // updates one application by AIDN
  async updateApplication(
    aidn: number,
    dto: ApplicationDto,
  ): Promise<IResponse> {
    let applicationChange: any;

    try {
      // updates the application name in prisma with AIDN
      logger.info(`prisma.application.update initiated with aidn: ${aidn}`);
      applicationChange = await this.prisma.application.update({
        where: { aidn },
        data: { name: dto.name, callbackUrl: dto.callbackUrl },
      });
    } catch (error) {
      // handle any prisma errors
      logger.error(`prisma.error.update with aidn: ${aidn} error: ${error}`);
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Application updated',
      data: { applicationChange },
    };

    logger.info(`updateApplication succeeded with aidn: ${aidn}`);
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
      logger.error(
        `prisma.application.delete with aidn: ${aidn} error: ${error}`,
      );
      handlePrismaErrors(error);
    }

    const payload: IResponse = {
      statusCode: 200,
      message: 'Application deleted',
      data: { deleteApplication },
    };

    logger.info(`deleteApplication succeeded with aidn: ${aidn}`);
    return payload;
  }
}
