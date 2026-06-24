# BorderSync — Sistema de Gestión Aduanera Inteligente (SGAI)

Proyecto de la asignatura Ingeniería de Software (Duoc UC), basado en el documento de
Especificación de Requisitos de Software (ERS) bajo estándar IEEE 830.

## Equipo

| Integrante | Rol |
|---|---|
| Cristopher Meneses | Scrum Master |
| Hans Román | Product Owner |
| Nicolás Vera | Desarrollador |

## Estructura del repositorio

```
bordersync/
├── README.md                                  Este archivo
├── CHANGELOG.md                                Historial de versiones del prototipo
├── docs/
│   ├── Historias_de_Usuario_BorderSync.md      HU derivadas de RF01-RF09
│   └── Pruebas_Funcionales_vX.Y.Z.md           Evidencia por versión
├── backend/                                    API REST y persistencia
│   ├── pom.xml                                 Spring Boot 4 / Java 21
│   └── src/                                    Código y pruebas de integración
└── prototipo-web/                              Aplicación React
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx                             Componente principal (4 dashboards)
        └── main.jsx
```

## Cómo correr la aplicación localmente

Requisitos: Java 21 y Node.js 18 o superior.

Primero se inicia el backend. Por defecto usa una base H2 persistente ubicada en
`backend/data/`, ignorada por Git:

```bash
cd backend
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080`. En otra terminal:

```bash
cd prototipo-web
npm install
npm run dev
```

El frontend abre en `http://localhost:5173` y usa `http://localhost:8080` como API.
Para otra URL se configura `VITE_API_URL`.

Para generar una build de producción:

```bash
npm run build
npm run preview
```

## Prototipo desplegado

Disponible en: **https://bordersync.vercel.app**

El frontend se actualiza automáticamente con cada `push` a `main`. La versión 0.2.0
también requiere desplegar el backend y configurar `VITE_API_URL` en Vercel.

## Autenticación y roles

Los viajeros crean una cuenta desde el formulario de registro. El backend valida las
credenciales y entrega un JWT. Un administrador puede bloquear/reactivar cuentas y
cambiar sus roles.

Administrador inicial para desarrollo local:

```text
Correo: admin@bordersync.cl
Contraseña: Admin2026!
```

Estas credenciales deben reemplazarse mediante `ADMIN_EMAIL` y `ADMIN_PASSWORD` en
cualquier entorno compartido o desplegado.

| Rol | Qué se puede probar |
|---|---|
| Viajero / Turista | Registro, documentación de viaje, vehículo, declaración SAG, mascotas, consulta de estado |
| Funcionario de Aduanas | Validación de documentos, fiscalización, reportes |
| Funcionario SAG / PDI | Revisión de declaraciones por nivel de riesgo |
| Administrador del Sistema | Gestión de usuarios y roles, estado de integraciones, configuración |

## Documentación relacionada

- [`CHANGELOG.md`](./CHANGELOG.md) — versiones del prototipo y qué cambió en cada una.
- [`docs/Historias_de_Usuario_BorderSync.md`](./docs/Historias_de_Usuario_BorderSync.md) —
  historias de usuario que justifican cada funcionalidad implementada.
- [`docs/Pruebas_Funcionales_v0.1.0.md`](./docs/Pruebas_Funcionales_v0.1.0.md) —
  evidencia y resultados de la auditoría funcional de la versión inicial.
- [`docs/Pruebas_Funcionales_v0.2.0.md`](./docs/Pruebas_Funcionales_v0.2.0.md) —
  evidencia de registro, login, persistencia y gestión de usuarios.
- [`docs/Flujo_de_Versiones_y_Pruebas.md`](./docs/Flujo_de_Versiones_y_Pruebas.md) —
  reglas para ramas, commits, pruebas y registro de versiones futuras.
- [`docs/Plantilla_Pruebas_Funcionales.md`](./docs/Plantilla_Pruebas_Funcionales.md) —
  plantilla que debe copiarse y completarse para cada nueva versión.

## Desarrollo de nuevas versiones

Las funcionalidades nuevas y correcciones se desarrollan en ramas separadas; no se
trabaja directamente sobre `main`. Cada versión debe incluir su informe de pruebas en
`docs/Pruebas_Funcionales_vX.Y.Z.md`, actualizar el changelog y registrar los cambios
mediante commits pequeños y descriptivos.

## PostgreSQL

Para usar PostgreSQL se activa el perfil correspondiente y se definen las variables:

```bash
cd backend
SPRING_PROFILES_ACTIVE=postgres \
DB_URL=jdbc:postgresql://localhost:5432/bordersync \
DB_USERNAME=bordersync \
DB_PASSWORD=una-clave-segura \
JWT_SECRET=un-secreto-de-al-menos-32-bytes \
./mvnw spring-boot:run
```
