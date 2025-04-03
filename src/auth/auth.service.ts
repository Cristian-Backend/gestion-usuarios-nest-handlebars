import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(`Invalid password for user ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate JWT token
    const payload = { sub: user._id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async create(createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  async findAllUsers() {
    return this.usersService.findAll({});
  }
}
