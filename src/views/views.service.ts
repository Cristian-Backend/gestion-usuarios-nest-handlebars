import { Injectable } from '@nestjs/common';

@Injectable()
export class ViewsService {
  
  getHello(): string {
    return 'Hello from ViewsService!';
  }
}