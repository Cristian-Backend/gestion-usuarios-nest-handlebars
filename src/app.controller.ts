// Modifica este controlador para que no interfiera con las vistas
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')  // Cambia la ruta base a 'api' para que no interfiera
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
