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
import {
  NewApplicationDto,
  UpdateApplicationDto,
  VerifyAppchainDto,
} from './applications.dto';
import { ApplicationsService } from './applications.service';
import logger from '../../utils/logger';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  async createApplication(@Body() dto: NewApplicationDto): Promise<IResponse> {
    logger.info({ message: `POST /applications initiated`, body: dto });
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
    @Body() dto: UpdateApplicationDto,
  ): Promise<IResponse> {
    logger.info({ message: `POST /applications/${aidn} initiated`, body: dto });
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

  @Post(':aidn/appchain/verify')
  @HttpCode(HttpStatus.OK)
  async verifyAppchain(
    @Param('aidn', ParseIntPipe) aidn: number,
    @Body() dto: VerifyAppchainDto,
  ): Promise<IResponse> {
    logger.info(`POST /applications/:aidn/appchain/verify initiated`);
    return this.applicationsService.verifyAppchain(aidn, dto);
  }
}
