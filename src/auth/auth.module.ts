import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    // Importamos ConfigModule directamente en el AuthModule
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    // Importamos el modelo User directamente en el AuthModule
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    RolesGuard
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
