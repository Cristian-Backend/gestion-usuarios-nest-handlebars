import { Module } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ViewsController],
})
export class ViewsModule {}