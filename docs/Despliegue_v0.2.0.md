# Despliegue de BorderSync v0.2.0

## Arquitectura pública

- Frontend React: Vercel.
- Backend Spring Boot: servicio Docker en Render.
- Base de datos: Render PostgreSQL.
- Migraciones: Flyway.
- Health check: `GET /actuator/health`.

El archivo `render.yaml` crea el backend y la base de datos como un Blueprint. El
`backend/Dockerfile` genera una imagen con Java 21 y ejecuta el artefacto Spring Boot
con un usuario sin privilegios.

## 1. Integrar esta configuración

Crear la Pull Request de la rama de despliegue y fusionarla en `main`. Render debe
leer `render.yaml` desde la raíz de la rama principal.

## 2. Crear el Blueprint en Render

1. Iniciar sesión en Render y elegir **New → Blueprint**.
2. Conectar `cristopher35/bordersync`.
3. Confirmar que Render detecta `render.yaml`.
4. Completar los valores solicitados:
   - `ADMIN_EMAIL`: correo del administrador inicial.
   - `ADMIN_PASSWORD`: contraseña robusta y exclusiva para producción.
5. Aplicar el Blueprint y esperar que `bordersync-api` quede saludable.

Los valores de PostgreSQL se conectan automáticamente desde `bordersync-db`. Render
genera `JWT_SECRET`; no debe copiarse al repositorio.

## 3. Validar el backend

Reemplazar `<API_RENDER>` por la URL entregada por Render:

```bash
curl https://<API_RENDER>/actuator/health
```

La respuesta debe incluir `"status":"UP"`.

## 4. Conectar Vercel

En el proyecto BorderSync de Vercel:

1. Abrir **Settings → Environment Variables**.
2. Crear `VITE_API_URL` con `https://<API_RENDER>` sin `/` final.
3. Activarla para Production y Preview.
4. Ejecutar un nuevo deployment del frontend.

Vite solo expone al frontend variables que comienzan con `VITE_`. Las credenciales,
la conexión PostgreSQL y `JWT_SECRET` pertenecen exclusivamente al backend.

## 5. Prueba posterior al despliegue

- [ ] `/actuator/health` responde `UP`.
- [ ] Se puede crear un viajero desde Vercel.
- [ ] El viajero puede cerrar e iniciar sesión.
- [ ] La sesión se restaura al recargar.
- [ ] El administrador visualiza al viajero.
- [ ] El bloqueo persiste y evita el login.
- [ ] El navegador no muestra errores CORS.

## Variables del backend

| Variable | Origen | Secreta |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Valor `postgres` | No |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | Render PostgreSQL | No |
| `DB_USERNAME`, `DB_PASSWORD` | Render PostgreSQL | Sí |
| `JWT_SECRET` | Generado por Render | Sí |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Configurados por el equipo | Sí |
| `CORS_ALLOWED_ORIGINS` | URL pública de Vercel | No |

## Reversión

Si el despliegue falla, no se debe borrar la base de datos. Se revierte el servicio
backend al deployment estable anterior desde Render y se conserva el registro de la
falla en el informe de pruebas de despliegue.
