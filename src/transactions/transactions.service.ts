import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { UpdateWalletBalanceDto } from '../accounts/accounts.dto';
import { AccountsService } from '../accounts/accounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { IResponse } from 'types/IResponse';
import { handlePrismaErrors } from '../../utils/handlePrismaErrors';
import { CreateTransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  @Inject(AccountsService)
  private readonly accounts: AccountsService;

  // creates a new transaction and updates account balance
  async createTransaction(dto: CreateTransactionDto): Promise<IResponse> {
    let transaction: Transaction;

    try {
      // create a new transaction with prisma
      transaction = await this.prisma.transaction.create({
        data: {
          aidn: dto.aidn,
          ksn: dto.ksn,
          type: dto.type,
          amount: dto.amount,
        },
      });
    } catch (error) {
      // handle any prisma errors
      handlePrismaErrors(error);
    }

    // update wallet balance in the designated account
    const newWalletbalance = await this.accounts.updateWalletBalance({
      ksn: dto.ksn,
      type: dto.type,
      amount: dto.amount,
    } satisfies UpdateWalletBalanceDto);

    return {
      statusCode: 200,
      message: 'Transaction created and balance updated',
      data: { newWalletbalance, transaction },
    } satisfies IResponse;
  }

  // gets all transactions for a certain account
  async getTransactionsByAccount(ksn: number): Promise<IResponse> {
    let transactions: Transaction[];

    try {
      // retrieves all transactions for an account
      transactions = await this.prisma.transaction.findMany({
        where: { ksn },
      });
    } catch (error) {
      // handles any prisma errors
      handlePrismaErrors(error);
    }

    return {
      statusCode: 200,
      message: 'Found all transactions',
      data: { transactions },
    } satisfies IResponse;
  }
}
