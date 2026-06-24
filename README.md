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
│   └── Historias_de_Usuario_BorderSync.md      HU derivadas de RF01-RF09
└── prototipo-web/                              Prototipo funcional (versión web)
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx                             Componente principal (4 dashboards)
        └── main.jsx
```

## Cómo correr el prototipo web localmente

Requisitos: Node.js 18 o superior.

```bash
cd prototipo-web
npm install
npm run dev
```

Esto abre el prototipo en `http://localhost:5173`.

Para generar una build de producción:

```bash
npm run build
npm run preview
```

## Prototipo desplegado

Disponible en: **https://bordersync.vercel.app**

El despliegue se actualiza automáticamente con cada `push` a la rama `main`.

## Roles de prueba

El login del prototipo permite ingresar como cualquiera de los 4 actores definidos en
la ERS. No valida contraseña real — cualquier texto no vacío en ambos campos permite
ingresar, ya que es un prototipo de evaluación funcional, no un sistema en producción.

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
- [`docs/Flujo_de_Versiones_y_Pruebas.md`](./docs/Flujo_de_Versiones_y_Pruebas.md) —
  reglas para ramas, commits, pruebas y registro de versiones futuras.
- [`docs/Plantilla_Pruebas_Funcionales.md`](./docs/Plantilla_Pruebas_Funcionales.md) —
  plantilla que debe copiarse y completarse para cada nueva versión.

## Desarrollo de nuevas versiones

Las funcionalidades nuevas y correcciones se desarrollan en ramas separadas; no se
trabaja directamente sobre `main`. Cada versión debe incluir su informe de pruebas en
`docs/Pruebas_Funcionales_vX.Y.Z.md`, actualizar el changelog y registrar los cambios
mediante commits pequeños y descriptivos.
