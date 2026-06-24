# Informe de pruebas funcionales — BorderSync v0.2.0

## Identificación

| Campo | Valor |
|---|---|
| Versión evaluada | `0.2.0` |
| Rama evaluada | `codex/feat-v0.2-autenticacion` |
| Commit de implementación | `cf53220` |
| Fecha de ejecución | 2026-06-23 |
| Alcance | HU01, HU02 y HU12 |
| Aplicación | React + Spring Boot + persistencia H2/PostgreSQL |

## Objetivo

Comprobar que los usuarios pueden registrarse e iniciar sesión con credenciales
reales, que las cuentas y cambios administrativos persisten después de recargar, y
que el control de acceso impide ingresar a cuentas bloqueadas.

## Entorno y comandos

- Java 21 y Spring Boot 4.0.6.
- React 18 y Vite 5.
- H2 en archivo para la prueba local; perfil PostgreSQL disponible.

```bash
cd backend
./mvnw test
./mvnw spring-boot:run

cd prototipo-web
npm run build
npm run dev
```

## Resultado general

El incremento de autenticación y usuarios queda **aprobado**. El registro, login,
sesión JWT, bloqueo temporal por intentos fallidos y administración RBAC utilizan
datos persistentes. Los módulos de trámites, vehículos y declaraciones continúan en
memoria y quedan fuera del alcance de esta versión.

## Casos de prueba

| ID | HU | Caso | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| PF-201 | Técnica | Compilar frontend | Build sin errores | Build Vite generado | Aprobado |
| PF-202 | HU01/HU02/HU12 | Ejecutar backend | Pruebas sin fallos | 6 pruebas aprobadas | Aprobado |
| PF-203 | HU01 | Registrar viajero | Crear usuario y abrir panel | Usuario creado con rol Viajero | Aprobado |
| PF-204 | HU02 | Recargar con sesión iniciada | Restaurar sesión válida | El panel del viajero se mantuvo disponible | Aprobado |
| PF-205 | HU12 | Consultar usuarios como administrador | Mostrar datos persistidos | Administrador y viajero fueron listados desde la API | Aprobado |
| PF-206 | HU12 | Bloquear viajero y recargar | Mantener estado Bloqueado | El bloqueo permaneció después de recargar | Aprobado |
| PF-207 | HU02/HU12 | Iniciar sesión con usuario bloqueado | Rechazar acceso | API informó que la cuenta está bloqueada | Aprobado |
| PF-208 | HU02 | Fallar contraseña cinco veces | Bloquear durante 15 minutos | Prueba de integración confirmó estado HTTP 423 | Aprobado |
| PF-209 | HU01 | Repetir correo registrado | Rechazar duplicado | Prueba de integración confirmó conflicto HTTP 409 | Aprobado |
| PF-210 | Técnica | Consultar health check | Responder estado saludable | `/actuator/health` respondió `UP` | Aprobado |
| PF-211 | Técnica | Empaquetar backend | Generar JAR ejecutable | `backend-0.2.0-SNAPSHOT.jar` generado | Aprobado |
| PF-212 | Técnica | Validar configuración Render | YAML válido | `render.yaml` procesado sin errores sintácticos | Aprobado |

## Cobertura automatizada

Las pruebas de integración verifican:

- Registro con contraseña cifrada BCrypt y emisión de JWT.
- Rechazo de correos duplicados.
- Login con credenciales correctas.
- Bloqueo temporal después de cinco intentos fallidos.
- Persistencia de cambios de rol y estado.
- Arranque completo del contexto Spring Boot.

Durante la implementación, la prueba de cinco intentos detectó que la transacción
revertía el contador al responder con error. El defecto fue corregido antes de aprobar
esta versión.

## Seguridad incorporada

- Contraseñas almacenadas con BCrypt.
- Tokens JWT firmados con HS256 y duración configurable.
- Autorización por roles `TRAVELER`, `CUSTOMS`, `SAG_PDI` y `ADMIN`.
- Bloqueo manual y temporal de cuentas.
- Invalidación efectiva del acceso de usuarios bloqueados, incluso con un token previo.
- Protección para impedir que el administrador elimine su propio acceso.
- CORS y secretos configurables mediante variables de entorno.

## Limitaciones conocidas

- El entorno local usa H2; PostgreSQL requiere activar el perfil `postgres`.
- Los trámites y declaraciones todavía no se guardan en el backend.
- No se implementaron recuperación de contraseña, MFA ni verificación de correo.
- H2 actualiza su esquema automáticamente durante el desarrollo local; el perfil
  PostgreSQL utiliza migraciones Flyway versionadas.

## Decisión

**Aprobada para integrar como incremento v0.2.0**, limitada a HU01, HU02 y HU12.
