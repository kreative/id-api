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

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  async createApplication(@Body() dto: ApplicationDto): Promise<IResponse> {
    return this.applicationsService.createApplication(dto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllApplications(): Promise<IResponse> {
    return this.applicationsService.getAllApplications();
  }

  @Get(':aidn')
  @HttpCode(HttpStatus.OK)
  async getApplication(
    @Param('aidn', ParseIntPipe) aidn: number,
  ): Promise<IResponse> {
    return this.applicationsService.getOneApplication(aidn);
  }

  @Post(':aidn')
  @HttpCode(HttpStatus.OK)
  async updateApplication(
    @Param('aidn', ParseIntPipe) aidn: number,
    @Body() dto: ApplicationDto,
  ): Promise<IResponse> {
    return this.applicationsService.updateApplication(aidn, dto);
  }

  @Delete(':aidn')
  @HttpCode(HttpStatus.OK)
  async deleteApplication(
    @Param('aidn', ParseIntPipe) aidn: number,
  ): Promise<IResponse> {
    return this.applicationsService.deleteApplication(aidn);
  }
}
