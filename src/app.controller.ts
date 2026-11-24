import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('Sistema')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Comprobar que la API está en línea (ruta pública y sin versión)' })
  @ApiOkResponse({
    description: 'Mensaje de estado',
    schema: { type: 'string', example: 'CourseHub API está en línea' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
