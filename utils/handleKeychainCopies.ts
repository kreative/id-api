import { PrismaService } from '../src/prisma/prisma.service';
import { Keychain } from '@prisma/client';
import { handlePrismaErrors } from './handlePrismaErrors';
import logger from './logger';

const prisma = new PrismaService();

// this utility function is ran when a user is creating a new keychain through signin flow
// the goal is to expire duplicate keychains based on the aidn and ksn
// we don't need duplicate, non-expired keychains if the user is logging into the same application
export async function handleKeychainCopies(
  aidn: number,
  ksn: number,
): Promise<void> {
  let keychains: Keychain[];

  logger.info(`handleKeychainCopies starting: aidn: ${aidn}, ksn: ${ksn}`);

  // if the ksn given is for 'armaan@guppy.im' aka Dreamer001 and SUPER_ADMIN
  // then we ignore the rest of the code as we don't want to expire his keychains since he runs a shit ton of tests
  if (ksn === 57427833) return;

  // we look through the database to see if there is another keychain
  // with the same aidn and ksn and it is also not expired
  try {
    keychains = await prisma.keychain.findMany({
      where: {
        aidn,
        ksn,
      },
    });
  } catch (error) {
    logger.error({ message: 'handleKeychainCopies findFirst error', error });
    handlePrismaErrors(error);
  }
  // if there are other keychains that are found to the duplicate
  if (keychains.length !== 0) {
    // we loop through all of the keychains and expire them
    for (const keychain of keychains) {
      try {
        logger.info(`handleKeychainCopies expiring keychain: ${keychain.id}`);
        await prisma.keychain.update({
          where: {
            id: keychain.id,
          },
          data: {
            expired: true,
          },
        });
      } catch (error) {
        logger.error({ message: 'handleKeychainCopies update error', error });
        handlePrismaErrors(error);
      }
    }
  }
}
