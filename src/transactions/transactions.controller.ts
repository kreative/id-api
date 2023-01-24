import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';

import { CreateTransactionDto } from './transactions.dto';
import { TransactionsService } from './transactions.service';
import logger from "../../utils/logger";

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  // TODO: all of these routes need to have a certain level of authentication with keychains
  // this way only authentication applications/users can create transactions
  // we could also just authenticate the applications that are making calls to the transactions API

  @Post('')
  @HttpCode(HttpStatus.OK)
  async createTransaction(@Body() dto: CreateTransactionDto) {
    logger.info(`POST /transactions initiated with payload: ${dto}`);
    return this.transactionsService.createTransaction(dto);
  }

  @Get(':ksn')
  @HttpCode(HttpStatus.OK)
  async getTransactionsForAccount(@Param('ksn', ParseIntPipe) ksn: number) {
    logger.info(`GET /transactions/${ksn} initiated`);
    return this.transactionsService.getTransactionsByAccount(ksn);
  }
}
