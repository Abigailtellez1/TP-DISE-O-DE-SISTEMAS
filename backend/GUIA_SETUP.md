# Guia de Setup

### JDK

Descargar algun JDK 21 y probar build con:

`./gradlew clean build`

### Docker & Postgres

Descargar Docker Desktop y correr algo como:

```
docker run --name aloj-postgres -e POSTGRES_DB=postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
```

Iniciar la app mediante

`./gradlew bootRun`

o bien generando un runner en el IDE