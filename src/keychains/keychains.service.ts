import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Keychain } from '@prisma/client';
import { nanoid } from 'nanoid';
import * as jwt from 'jsonwebtoken';

import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { KeychainDto, VerifyKeychainDto } from './keychains.dto';
import { IResponse } from 'types/IResponse';
import * as moment from 'moment';
import { Moment } from 'moment';

const SECRET = process.env.SUPER_SECRET;

@Injectable({})
export class KeychainsService {
  constructor(private prisma: PrismaService) {}

  // returns new keychain after being added to the database
  async createKeychain(dto: KeychainDto): Promise<Keychain> {
    let keychain: Keychain;
    //setup variables for the data of the jwt
    // creates moment instances for createdAt and expiresAt
    const createdAtMoment: Moment = moment(new Date());
    console.log(createdAtMoment.format());
    const expiresAtMoment: Moment = createdAtMoment.add(30, 'days');
    // converts moment instances to string datetime objects
    const createdAt: string = createdAtMoment.format();
    const expiresAt: string = expiresAtMoment.format();
    // creates a secure has to increase security of the JWT
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
    return keychain;
  }

  // retrieves a list of all keychains
  async getAllKeychains(): Promise<IResponse> {
    let keychains: Keychain[];

    try {
      // gets all keychains with prisma
      keychains = await this.prisma.keychain.findMany();
    } catch (error) {
      // hanles any prisma errors
      handlePrismaErrors(error);
    }

    return {
      statusCode: 200,
      message: 'Keychains found',
      data: { keychains },
    } satisfies IResponse;
  }

  // decrypts the keychain, checks expiration, and returns verification status
  // if the keychain is found to be expired, update the expired field to 'true'
  async verifyKeychain(dto: VerifyKeychainDto): Promise<IResponse> {
    let keychain: Keychain;
    let decodedKey: any;

    try {
      // finds the keychain from the key
      // as one ksn may have many keys, we can't search from that
      keychain = await this.prisma.keychain.findUnique({
        where: { key: dto.key },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    // checks the expiration field
    if (keychain.expired) {
      throw new UnauthorizedException('keychain has expired from field');
    }

    // decodes the key (jwt)
    jwt.verify(keychain.key, SECRET, (error: any, decoded: any) => {
      // throws error if the key somehow uses the 'wrong' token
      if (error) throw new NotFoundException();
      decodedKey = decoded;
    });

    // checks the expiration in the payload itself
    const expired: boolean = moment(decodedKey.expiresAt).isSameOrBefore(
      moment(),
    );

    if (expired) {
      try {
        // update the keychain's expired field to also reflect true
        await this.prisma.keychain.update({
          where: { id: keychain.id },
          data: { expired: true },
        });
      } catch (error) {
        // handles all prisma errors
        handlePrismaErrors(error);
      }

      // throw error to kill the process
      throw new UnauthorizedException('keychain has expired from payload');
    }

    // verify the ksn's match
    if (!(dto.ksn === decodedKey.ksn)) {
      throw new UnauthorizedException('ksn mismatch');
    }

    // verify the aidn's match
    if (!(dto.aidn === decodedKey.aidn)) {
      throw new UnauthorizedException('aidn mismatch');
    }

    // removes expired, the jwt from the keychain object
    delete keychain.key, keychain.expired;

    return {
      statusCode: 200,
      message: 'Keychain is valid',
      data: { keychain },
    } satisfies IResponse;
  }

  // expires the keychain
  async closeKeychain(keychainID: number): Promise<IResponse> {
    let keychain: any;

    try {
      keychain = await this.prisma.keychain.update({
        where: { id: keychainID },
        data: { expired: true },
      });
    } catch (error) {
      handlePrismaErrors(error);
    }

    if (keychain) {
      return {
        statusCode: 200,
        message: 'Keychain closed',
      } satisfies IResponse;
    }
  }
}
