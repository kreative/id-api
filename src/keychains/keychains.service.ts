import { Injectable } from '@nestjs/common';
import { Keychain } from '@prisma/client';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaErrors } from 'utils/handlePrismaErrors';
import { CloseKeychainDto, KeychainDto } from './keychains.dto';
import { IResponse } from 'types/IResponse';

const SECRET = process.env.SUPER_SECRET;

@Injectable({})
export class KeychainsService {
  constructor(private prisma: PrismaService) {}

  // returns new keychain after being added to the database
  async createKeychain(dto: KeychainDto): Promise<string> {
    let keychain: Keychain;
    //setup variables for the data of the jwt
    const createdAt: string = moment().format();
    const expiresAt: string = moment().add(30, 'days').format();
    const secureHash: string = nanoid();
    // create new JWT 'key'
    const key = jwt.sign(
      {
        ksn: dto.ksn,
        aidn: dto.aidn,
        createdAt,
        expiresAt,
        secureHash,
      },
      SECRET,
    );

    try {
      // create new keychain in the database
      keychain = await this.prisma.keychain.create({
        data: { ksn: dto.ksn, aidn: dto.aidn, key },
      });
    } catch (error) {
      // handles any errors by prisma
      handlePrismaErrors(error);
    }

    // returns just the jwt from the keychain object
    return keychain.key satisfies string;
  }

  async decryptKeychain(): Promise<IResponse> {
    // if the keychain is found to be expired, update the expired field to 'true'
  }

  async closeKeychain(dto: CloseKeychainDto): Promise<IResponse> {
    let keychain: any;

    try {
      keychain = await this.prisma.keychain.update({
        where: { id: dto.keychainID },
        data: { expired: true },
      });
    } catch (error) {
      handlePrismaErrors(error);
    }

    if (keychain) {
      return {
        statusCode: 200,
        message: "Keychain closed",
      } satisfies IResponse;
    }
  }
}
