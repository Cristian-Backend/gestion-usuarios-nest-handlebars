import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if email already exists
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException(`User with email ${createUserDto.email} already exists`);
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      // Create new user
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      
      return await newUser.save();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    
    return await this.userModel.find()
      .limit(limit)
      .skip(offset)
      .select('-password')
      .exec();
  }

  async findById(id: string) {
    console.log('Service: Buscando usuario con ID:', id);
    
    if (!id) {
      throw new NotFoundException('ID de usuario no proporcionado');
    }
    
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(`ID de usuario no válido: ${id}`);
      }
      
      const user = await this.userModel.findById(id).exec();
      
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      
      // Convert to plain object and ensure _id is included
      const userObject = user.toObject();
      return userObject;
    } catch (error) {
      console.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    // Si hay una contraseña y no está vacía, hasheamos la contraseña
    if (updateUserDto.password && updateUserDto.password.trim() !== '') {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    } else {
      // Si la contraseña está vacía, la eliminamos para no actualizar este campo
      delete updateUserDto.password;
    }
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true }
    ).exec();
    
    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return updatedUser;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user; // We don't throw an exception here to allow auth service to handle it
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    return { message: 'User deleted successfully' };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`User already exists in the database ${JSON.stringify(error.keyValue)}`);
    }
    
    console.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

