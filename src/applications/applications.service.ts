import { Injectable, NotFoundException } from '@nestjs/common';
import { Application } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { IResponse } from 'types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { ApplicationDto, AidnDto } from './applications.dto';

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
      const application = await this.prisma.application.findUnique({
        where: { aidn: newAIDN },
      });
      if (application === null) unique = true;
    }

    return newAIDN;
  }

  // creates a new application
  async createApplication(dto: ApplicationDto): Promise<IResponse> {
    let application: Application;

    // generate a new AIDN
    const aidn = await this.generateAIDN();

    try {
      // create new application with prisma
      application = await this.prisma.application.create({
        data: {
          aidn,
          name: dto.name,
          callbackUrl: dto.callbackUrl,
        },
      });
    } catch (error) {
      // handle any errors prisma throws
      handlePrismaErrors(error);
    }

    return {
      statusCode: 200,
      message: 'Application created',
      data: application,
    } satisfies IResponse;
  }

  // get a list of all applications
  async getAllApplications(): Promise<IResponse> {
    let applications: Application[];

    try {
      // find all applications
      applications = await this.prisma.application.findMany();
    } catch (error) {
      // handle any errors prisma throws
      handlePrismaErrors(error);
    }

    return {
      statusCode: 200,
      message: 'Applications found',
      data: applications,
    } satisfies IResponse;
  }

  // retrieves information for a single applicaiton by AIDN
  async getOneApplication(aidn: number): Promise<IResponse> {
    let application: Application;

    try {
      // gets one application from given AIDN
      application = await this.prisma.application.findUnique({
        where: { aidn },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    if (application === null || application === undefined) {
      throw new NotFoundException('Application not found');
    } else {
      return {
        statusCode: 200,
        message: 'Application found',
        data: { application },
      } satisfies IResponse;
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
      applicationChange = await this.prisma.application.update({
        where: { aidn },
        data: { name: dto.name, callbackUrl: dto.callbackUrl },
      });
    } catch (error) {
      // handle any prisma errors
      handlePrismaErrors(error);
    }

    return {
      statusCode: 200,
      message: 'Application updated',
      data: { applicationChange },
    } satisfies IResponse;
  }

  // deletes an application from given AIDN
  async deleteApplication(aidn: number): Promise<IResponse> {
    let deleteApplication: any;

    try {
      // deletes application with prisma
      deleteApplication = await this.prisma.application.delete({
        where: { aidn },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    return {
      statusCode: 200,
      message: 'Application deleted',
      data: { deleteApplication },
    } satisfies IResponse;
  }
}
