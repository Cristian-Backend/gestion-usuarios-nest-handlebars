import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewsService {
  // Aquí puedes agregar métodos que necesites para tu servicio de vistas
  getHello(): string {
    return 'Hello from ViewsService!';
  }
}