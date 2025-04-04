import { Controller, Get, Post, Delete, Patch, Render, Req, Res, Body, UseGuards, Param } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class ViewsController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Render('index')
  async getIndex(@Req() req: Request) {
    // Verificar si hay un token en las cookies
    const token = req.cookies['jwt'];
    
    if (token) {
      try {
        // Verificar y decodificar el token
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET
        });
        
        // Buscar el usuario por su ID
        const user = await this.usersService.findById(decoded.sub);
        
        // Si el usuario existe, pasar los datos a la vista
        if (user) {
          console.log('Usuario autenticado en inicio:', user.email);
          return { 
            title: 'Inicio', 
            user: user 
          };
        }
      } catch (error) {
        console.error('Error al verificar token:', error);
      }
    }
    
    // Si no hay token o hubo un error, renderizar la vista sin usuario
    return { title: 'Inicio', user: null };
  }

  @Get('login')
  @Render('login')
  getLogin() {
    return { error: null };
  }

  @Post('login')
  async postLogin(@Body() loginDto: any, @Res() res: Response) {
    try {
      console.log('Login attempt with:', loginDto);
      const result = await this.authService.login(loginDto);
      
      // Set JWT token in cookie
      res.cookie('jwt', result.access_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      
      console.log('Login successful, user:', result.user);
      
      // Redirect based on user role
      if (result.user.role === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.render('login', { error: 'Invalid credentials. User not found or password incorrect.' });
    }
  }

  @Get('register')
  @Render('register')
  getRegister() {
    return { error: null };
  }

  @Post('register')
  async postRegister(@Body() createUserDto: any, @Res() res: Response) {
    try {
      await this.authService.create(createUserDto);
      return res.redirect('/login');
    } catch (error) {
      return res.render('register', { error: error.message });
    }
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @Render('dashboard')
  async getDashboard(@Req() req: Request) {
    const user = req.user as any;
    
    // Obtener estadísticas del usuario
    const lastLogin = new Date().toLocaleString();
    const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    return { 
      user: {
        ...user,
        isAdmin: user.role === 'admin',
        lastLogin,
        accountAge,
        // Más estadísticas aquí
      } 
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Render('admin')
  async getAdmin(@Req() req: Request) {
    console.log('Admin page accessed, user:', req.user);
    const users = await this.authService.findAllUsers();
    const user = req.user as any;
    return { 
      users, 
      user: {
        ...user,
        isAdmin: user.role === 'admin'
      },
      scripts: `
        <script>
          function openTab(tabName) {
            // Ocultar todos los contenidos de pestañas
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Quitar clase activa de todas las pestañas
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Mostrar el contenido de la pestaña seleccionada
            document.getElementById(tabName).classList.add('active');
            
            // Añadir clase activa a la pestaña clickeada de forma segura
            const activeTab = document.querySelector(\`.tab[onclick*="\${tabName}"]\`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
          }
        </script>
      `
    };
  }

  @Get('api/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findById(id);
      return res.json(user);
    } catch (error) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  }

  @Post('api/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createUser(@Body() createUserDto: any, @Res() res: Response) {
    try {
      console.log('Creando nuevo usuario:', createUserDto);
      const newUser = await this.authService.create(createUserDto);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return res.status(400).json({ message: error.message });
    }
  }

  @Patch('api/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any, @Res() res: Response) {
    try {
      console.log('Actualizando usuario con ID:', id);
      console.log('Datos de actualización:', updateUserDto);
      
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(400).json({ message: error.message });
    }
  }

  @Delete('api/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      console.log('Eliminando usuario con ID:', id);
      const result = await this.usersService.remove(id);
      return res.json(result);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(400).json({ message: error.message });
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    // Limpiar la cookie del token JWT
    res.clearCookie('jwt');
    
    // Redirigir a la página de inicio
    return res.redirect('/');
  }
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Render('profile')
  getProfile(@Req() req: Request) {
    const user = req.user as any;
    return { 
      title: 'Mi Perfil',
      user 
    };
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: Request, @Body() updateData: any, @Res() res: Response) {
    try {
      const user = req.user as any;
      
      // Only update fields that were provided
      const updateUserDto: any = {};
      if (updateData.fullName) updateUserDto.fullName = updateData.fullName;
      if (updateData.email) updateUserDto.email = updateData.email;
      if (updateData.avatar) updateUserDto.avatar = updateData.avatar;
      if (updateData.password && updateData.password.trim() !== '') {
        updateUserDto.password = updateData.password;
      }
      
      // Update user in database
      await this.usersService.update(user._id, updateUserDto);
      
      // Redirect back to profile with success message
      return res.redirect('/profile?success=true');
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.redirect('/profile?error=' + encodeURIComponent(error.message));
    }
  }
}