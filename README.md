# BorderSync — SGAI · Sistema de Gestión Aduanera Inteligente

Proyecto de la asignatura Ingeniería de Software (Duoc UC), basado en el documento de
Especificación de Requisitos de Software (ERS) bajo estándar IEEE 830.

**BorderSync** tiene como objetivo **reducir los tiempos de espera en los pasos fronterizos
terrestres de Chile**: el viajero precarga en línea sus documentos, vehículo y declaraciones
*antes* de llegar a la frontera; los funcionarios los validan con anticipación y habilitan un
**carril preferente** en lugar de hacer todo el trámite en el momento.

---

## Equipo

| Integrante | Rol |
|---|---|
| Cristopher Meneses | Scrum Master |
| Hans Román | Product Owner |
| Nicolás Vera | Desarrollador |

---

## Estructura del repositorio

```
bordersync/
├── README.md
├── docs/
│   └── Historias_de_Usuario_BorderSync.md   # HU derivadas de RF01–RF14
└── prototipo-web/                           # Prototipo funcional React + TypeScript (v0.10.0)
    ├── CHANGELOG.md
    ├── package.json
    ├── src/
    │   ├── app/                             # Router con guards por rol
    │   ├── data/seed.json                   # Datos iniciales (reemplaza la BD)
    │   ├── shared/                          # Dominio compartido, store, sesión, UI
    │   └── features/                        # Vertical slices: auth, traveler, customs, sanitary, migration, admin
    └── ...
```

---

## Prototipo web · v0.10.0

Maqueta **sin backend**: toda la información se guarda en el navegador (`localStorage`).
Ideal para demostrar el flujo completo de punta a punta sin servidor ni base de datos.

### Puesta en marcha

Requisitos: Node.js 18 o superior.

```bash
cd prototipo-web
npm install
npm run dev      # http://localhost:5173
```

Otros comandos:

```bash
npm run build    # compila tipos y genera el bundle de producción
npm run preview  # sirve el build ya generado
```

### Prototipo desplegado

Disponible en: **https://bordersync.vercel.app**

El despliegue se actualiza automáticamente con cada `push` a la rama `main`.

### Cuentas de demostración

La contraseña de todas las cuentas es **`123456`**. La pantalla de login incluye botones de
acceso rápido que rellenan las credenciales automáticamente.

| Rol | Correo | Qué puede probar |
|-----|--------|-----------------|
| Viajero | `viajero@bordersync.cl` | Crear trámites, vehículo, declaraciones SAG y mascotas, consultar estado por QR o ID |
| Aduanas | `aduanas@bordersync.cl` | Cola de validación, fiscalización, reportes PDF/Excel |
| SAG | `sag@bordersync.cl` | Revisión de declaraciones priorizada por riesgo sanitario |
| PDI | `pdi@bordersync.cl` | Control migratorio: aprobar o rechazar ingreso de personas |
| Administrador | `admin@bordersync.cl` | Usuarios, parámetros de seguridad, monitoreo de integraciones |

### El flujo de punta a punta

1. **Como viajero**: crea un trámite, agrega vehículo y declaración SAG. El sistema genera un
   **pase de cruce con QR escaneable** y una estimación de tiempo de espera.
2. **Como PDI y SAG**: aprueban el control migratorio y sanitario respectivamente.
3. **Como Aduanas**: una vez aprobados PDI y SAG, valida el trámite desde la cola.
4. **Como viajero**: el trámite pasa a *Aprobado* y la estimación cambia a **carril preferente (~2 min)**.

---

## Stack tecnológico

- **React 18** + **TypeScript** (modo estricto)
- **Vite 6** · **Tailwind CSS 4** · **React Router 6**
- Arquitectura **Vertical Slice + DDD** — dominio aislado de la interfaz y del mecanismo de persistencia
- Sin librerías de estado externas ni backend; persistencia en `localStorage` bajo la clave `bordersync.db.v1`

Para reiniciar los datos de fábrica: borra la clave `bordersync.db.v1` desde las DevTools
del navegador (Application → Local Storage).

---

## Documentación

- [Historias de Usuario (HU01–HU14)](docs/Historias_de_Usuario_BorderSync.md)
- [README detallado del prototipo web](prototipo-web/README.md)
- [Changelog](prototipo-web/CHANGELOG.md)

---

## Historial de versiones (resumen)

| Versión | Fecha | Destacado |
|---------|-------|-----------|
| **0.10.0** | 2026-06-25 | Arquitectura refactorizada (Vertical Slice + DDD), validación de aprobación encadenada (PDI → SAG → Aduanas), login unificado |
| 0.3.0 | 2026-06-24 | Estado compartido entre roles en tiempo real dentro del navegador |
| 0.2.0 | 2026-06-24 | Panel de accesibilidad (idioma / tamaño de letra), restricción del rol Administrador |
| 0.1.0 | 2026-06-23 | Prototipo web inicial con los 4 roles y módulos RF01–RF09 |

Ver el [CHANGELOG completo](prototipo-web/CHANGELOG.md) para el detalle de cada versión.
