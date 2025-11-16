# Requerimientos Funcionales — Airbnb Estudiantil

## 1. Autenticación robusta
- Acceso mediante Google SSO, exclusivamente con cuentas `@frba.utn.edu.ar`.
- Validación de tokens contra JWKS para prevenir suplantación de identidad.

## 2. Gestión de perfiles
- CRUD básico de perfiles de usuario.
- Los datos pueden provenir de una app simulada que actúe como proveedor externo (p. ej. UTN) con información ficticia.

## 3. Publicación y gestión de alojamientos
- CRUD completo de listings.
- Reviews con comentarios y calificaciones para alumnos autenticados.
- Buenas prácticas: índices de búsqueda geoespacial actualizados vía eventos y event streaming (`ListingUpdated`) para desacoplar servicios.

## 4. Integración con mapas
- Geolocalización y asignación de coordenadas a cada listing con Google Maps u otro proveedor.
