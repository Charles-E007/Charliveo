import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MonitorsService } from './monitors.service.js';
import { CreateMonitorDto } from './dto/create-monitor.dto.js';
import { UpdateMonitorDto } from './dto/update-monitor.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/monitors')
export class MonitorsController {
  constructor(private readonly monitorsService: MonitorsService) {}

  @Post()
  create(@Request() req: any, @Body() createMonitorDto: CreateMonitorDto) {
    return this.monitorsService.create(req.user._id.toString(), createMonitorDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.monitorsService.findAllByUser(req.user._id.toString());
  }
  @Get('alerts')
  getUserAlerts(@Request() req: any, @Query('limit') limit?: number) {
    return this.monitorsService.getUserAlerts(req.user._id.toString(), limit ? Number(limit) : 50);
  }
  
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.monitorsService.findOne(id, req.user._id.toString());
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateMonitorDto: UpdateMonitorDto,
  ) {
    return this.monitorsService.update(id, req.user._id.toString(), updateMonitorDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.monitorsService.remove(id, req.user._id.toString());
  }

  @Post(':id/pause')
  togglePause(@Request() req: any, @Param('id') id: string) {
    return this.monitorsService.togglePause(id, req.user._id.toString());
  }

  @Post(':id/ping-now')
  pingNow(@Request() req: any, @Param('id') id: string) {
    return this.monitorsService.pingNow(id, req.user._id.toString());
  }

  @Get(':id/logs')
  getLogs(
    @Request() req: any,
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return this.monitorsService.getLogs(id, req.user._id.toString(), limit ? Number(limit) : 50);
  }
}