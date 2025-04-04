import { Module } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service'; 
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt'; // Añade esta importación
import { ConfigModule, ConfigService } from '@nestjs/config'; 

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}