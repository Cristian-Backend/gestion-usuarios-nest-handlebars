# User Management System

A simple user management system built with NestJS, MongoDB, and Handlebars.

## Features

- User authentication with JWT
- Role-based access control (Admin/User)
- User registration and login
- User profile management
- Admin dashboard for user management

## Technologies

- NestJS
- MongoDB
- Handlebars
- JWT Authentication

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
Create a .env file with:
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your_secret_key

Running the app
# development
npm run start:dev

# production
npm run start:prod

## Trae AI
Used 1 Reference

# Sistema de Gestión de Usuarios con NestJS
## Descripción
Este proyecto es un sistema completo de gestión de usuarios desarrollado con NestJS, MongoDB y Handlebars. Proporciona funcionalidades de autenticación, autorización basada en roles, y una interfaz de usuario intuitiva para administrar usuarios.

## Características
- Autenticación segura : Implementación de JWT para la gestión de sesiones
- Sistema de roles : Diferenciación entre usuarios normales y administradores
- Panel de administración : Gestión completa de usuarios (crear, editar, eliminar)
- Perfil de usuario : Los usuarios pueden editar su información personal
- Interfaz responsiva : Diseño adaptable a diferentes dispositivos
## Tecnologías utilizadas
- Backend : NestJS, MongoDB, Mongoose
- Frontend : Handlebars (HBS), CSS, JavaScript
- Autenticación : JWT, Passport
- Seguridad : bcrypt para encriptación de contraseñas
## Requisitos previos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn
## Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/login-nest-crud.git
cd login-nest-crud
 ```
```

2. Instalar dependencias:
```bash
npm install
 ```

3. Configurar variables de entorno:
   Crea un archivo .env en la raíz del proyecto con el siguiente contenido:
```plaintext
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=tu_clave_secreta_aqui
 ```
```

## Ejecución
### Desarrollo
```bash
npm run start:dev
 ```

### Producción
```bash
npm run build
npm run start:prod
 ```

La aplicación estará disponible en http://localhost:3003

## Estructura del proyecto
```plaintext
src/
├── auth/                  # Autenticación y autorización
├── users/                 # Gestión de usuarios
├── views/                 # Controladores para las vistas
├── app.module.ts          # Módulo principal
├── main.ts                # Punto de entrada
public/                    # Archivos estáticos (CSS, JS)
views/                     # Plantillas Handlebars
 ```
```

## Rutas principales
- / : Página de inicio
- /login : Inicio de sesión
- /register : Registro de usuarios
- /dashboard : Panel de usuario
- /admin : Panel de administración (solo para administradores)
- /profile : Perfil de usuario
## Roles de usuario
- Usuario : Acceso al dashboard y perfil personal
- Administrador : Acceso completo, incluido el panel de administración
## Licencia
MIT

## Autor
Tu Nombre

Desarrollado con ❤️ usando NestJS

## Cristian Micchele
Copy

Delete

Crea un readme mas basico

## Trae AI
Used 1 Reference

register.hbs 2-2

Here's a more basic README for your project:

```markdown
# User Management System

A simple user management system built with NestJS, MongoDB, and Handlebars.

## Features

- User authentication with JWT
- Role-based access control (Admin/User)
- User registration and login
- User profile management
- Admin dashboard for user management

## Technologies

- NestJS
- MongoDB
- Handlebars
- JWT Authentication

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
 ```
```

3. Create a .env file with:
```plaintext
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your_secret_key
 ```
```

## Running the app
```bash
# development
npm run start:dev

# production
npm run start:prod
 ```

The application will be available at http://localhost:3003

## Routes
- / - Home page
- /login - Login page
- /register - Registration page
- /dashboard - User dashboard
- /admin - Admin panel (admin only)