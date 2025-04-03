import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/pagination.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  findAll(@Query() paginacion: PaginationDto) {
    return this.usersService.findAll(paginacion);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Buscando usuario con ID:', id);
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('Actualizando usuario con ID:', id);
    console.log('Datos de actualización:', updateUserDto);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
