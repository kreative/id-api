import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { IResponse } from 'types/IResponse';
import { ApplicationDto } from './applications.dto';
import { ApplicationsService } from './applications.service';
import logger from '../../utils/logger';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  async createApplication(@Body() dto: ApplicationDto): Promise<IResponse> {
    logger.info(`POST /applications initiated with body: ${dto}`);
    return this.applicationsService.createApplication(dto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllApplications(): Promise<IResponse> {
    logger.info(`GET /applications initiated`);
    return this.applicationsService.getAllApplications();
  }

  @Get(':aidn')
  @HttpCode(HttpStatus.OK)
  async getApplication(
    @Param('aidn', ParseIntPipe) aidn: number,
  ): Promise<IResponse> {
    logger.info(`GET /applications/${aidn} initiated`);
    return this.applicationsService.getOneApplication(aidn);
  }

  @Post(':aidn')
  @HttpCode(HttpStatus.OK)
  async updateApplication(
    @Param('aidn', ParseIntPipe) aidn: number,
    @Body() dto: ApplicationDto,
  ): Promise<IResponse> {
    logger.info(`POST /applications/${aidn} initiated with body: ${dto}`);
    return this.applicationsService.updateApplication(aidn, dto);
  }

  @Delete(':aidn')
  @HttpCode(HttpStatus.OK)
  async deleteApplication(
    @Param('aidn', ParseIntPipe) aidn: number,
  ): Promise<IResponse> {
    logger.info(`DELETE /applications/${aidn} initiated`);
    return this.applicationsService.deleteApplication(aidn);
  }
}
