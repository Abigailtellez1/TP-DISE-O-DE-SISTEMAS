# Alojamiento Estudiantil UTN-FRBA

Sistema de alojamiento estudiantil desarrollado para la Universidad Tecnológica Nacional - Facultad Regional Buenos Aires.

## Estructura del Proyecto

Este es un monorepo que contiene:

- **backend**: API REST desarrollada con Spring Boot (Kotlin)
- **frontend**: Aplicación web desarrollada con React + TypeScript + Vite

## Requisitos Previos

- Docker
- Docker Compose (opcional, para ejecutar múltiples contenedores)
- Java 21+ (para desarrollo local del backend)
- Node.js 18+ (para desarrollo local del frontend)

## Configuración con Docker

### Backend

#### Construir la imagen del backend

```bash
cd backend
docker build -t alojamiento-backend .
```

#### Ejecutar el contenedor del backend

```bash
docker run -d \
  --name alojamiento-backend \
  -p 8080:8080 \
  -e GOOGLE_CLIENT_ID=323049848312-r1d1riaecq9i1l0eppmutn3gssvgecc8.apps.googleusercontent.com \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  -e GOOGLE_SSO_REDIRECT_URL=http://host.docker.internal:8080/login/oauth2/code/google \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/postgres \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  alojamiento-backend
```

#### Usar archivo de variables de entorno (alternativa recomendada)

En lugar de pasar las variables una por una, puedes usar un archivo `.env`:

1. Crear archivo `backend/.env.docker`:
   ```bash
   GOOGLE_CLIENT_ID=323049848312-r1d1riaecq9i1l0eppmutn3gssvgecc8.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_SSO_REDIRECT_URL=http://host.docker.internal:8080/login/oauth2/code/google
   SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/postgres
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=postgres
   ```

2. Ejecutar con el archivo:
   ```bash
   docker run -d \
     --name alojamiento-backend \
     -p 8080:8080 \
     --env-file backend/.env.docker \
     alojamiento-backend
   ```

**Variables de entorno importantes:**

- `GOOGLE_CLIENT_ID`: ID de cliente de Google OAuth2 (obligatorio)
- `GOOGLE_CLIENT_SECRET`: Secreto de cliente de Google OAuth2 (obligatorio)
- `GOOGLE_SSO_REDIRECT_URL`: URL de redirección para OAuth2 (opcional)
- `JWT_SECRET`: Secreto para firmar tokens JWT (opcional, tiene valor por defecto)
- `FRONTEND_URL`: URL del frontend (opcional, por defecto http://localhost:5173)
- `SPRING_DATASOURCE_URL`: URL de conexión a PostgreSQL (opcional, por defecto localhost:5432)
- `SPRING_DATASOURCE_USERNAME`: Usuario de la base de datos (opcional, por defecto postgres)
- `SPRING_DATASOURCE_PASSWORD`: Contraseña de la base de datos (opcional, por defecto postgres)

### Frontend

#### Construir la imagen del frontend

```bash
cd frontend
docker build -t alojamiento-frontend .
```

#### Ejecutar el contenedor del frontend

```bash
docker run -d \
  --name alojamiento-frontend \
  -p 80:80 \
  alojamiento-frontend
```

**Nota:** El frontend necesita que la variable `VITE_API_BASE_URL` esté configurada en tiempo de build. Para cambiarla, debes reconstruir la imagen:

```bash
cd frontend
docker build -t alojamiento-frontend --build-arg VITE_API_BASE_URL=http://your-backend-url:8080 .
```

## Desarrollo Local

### Backend

1. Configurar variables de entorno en `backend/.env`:
   ```bash
   cp backend/.env.example backend/.env
   # Editar backend/.env con tus credenciales
   ```

2. Ejecutar el backend:
   ```bash
   cd backend
   ./gradlew bootRun
   ```

El backend estará disponible en http://localhost:8080

### Frontend

1. Configurar variables de entorno en `frontend/.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   # Editar frontend/.env si es necesario
   ```

2. Instalar dependencias:
   ```bash
   cd frontend
   yarn install
   ```

3. Ejecutar el frontend:
   ```bash
   yarn dev
   ```

El frontend estará disponible en http://localhost:5173

## Endpoints Principales

### Listings (Publicaciones)
- `GET /api/listings` - Listar publicaciones (con paginación y filtros)
- `GET /api/listings/{id}` - Obtener publicación por ID
- `POST /api/listings` - Crear nueva publicación
- `PATCH /api/listings/{id}` - Actualizar publicación
- `DELETE /api/listings/{id}` - Eliminar publicación

### Reservations (Reservas)
- `GET /api/reservations` - Listar reservas (con paginación y filtros)
- `GET /api/reservations/{id}` - Obtener reserva por ID
- `POST /api/reservations` - Crear nueva reserva
- `PATCH /api/reservations/{id}` - Actualizar reserva
- `DELETE /api/reservations/{id}` - Eliminar reserva

### Users (Usuarios)
- `GET /api/users/{id}` - Obtener perfil de usuario
- `PUT /api/users/students/{id}` - Crear/actualizar perfil de estudiante
- `PUT /api/users/landlords/{id}` - Crear/actualizar perfil de anfitrión
- `GET /api/users/{id}/notifications` - Obtener notificaciones del usuario

### Reviews (Reseñas)
- `GET /api/listings/{listingId}/reviews` - Listar reseñas de una publicación
- `POST /api/listings/{listingId}/reviews` - Crear reseña

Ver más ejemplos en: `backend/docs/request_examples.md`

## Base de Datos

El proyecto usa PostgreSQL. Para desarrollo local, puedes usar Docker:

```bash
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  postgres:16
```

## Tecnologías Utilizadas

### Backend
- Spring Boot 3.x
- Kotlin
- PostgreSQL
- Google OAuth2
- JWT

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- CSS Modules

## Licencia

Este proyecto fue desarrollado con fines educativos para la materia Diseño de Sistemas de la UTN-FRBA.
