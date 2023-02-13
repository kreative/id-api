import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { Application } from '@prisma/client';
import { handlePrismaErrors } from './handlePrismaErrors';
import logger from './logger';

const prisma = new PrismaService();

export async function verifyAppchain(
  aidn: number,
  appchain: string,
): Promise<boolean> {
  let application: Application;

  try {
    // gets one application from given aidn
    logger.info(
      `prisma.application.findUnique initiated with appchain: ${aidn}`,
    );
    application = await prisma.application.findUnique({
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

  if (application.appchain !== appchain) {
    throw new ForbiddenException('Appchain mismatch');
  }

  return true;
}
