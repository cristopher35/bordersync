# BorderSync · SGAI — Sistema de Gestión Aduanera Inteligente

Prototipo funcional de **BorderSync**, un sistema pensado para **reducir los
tiempos de espera en los pasos fronterizos terrestres de Chile**. La idea central
es simple: si el viajero **precarga en línea** sus documentos, vehículo y
declaraciones *antes* de llegar a la frontera, los funcionarios pueden validarlos
con anticipación y habilitar un **carril preferente**, en lugar de hacer todo el
trámite en el momento.

Está basado en el documento de requisitos (ERS, estándar IEEE 830) y las
Historias de Usuario que están en [`docs/`](docs/).

> **Es una maqueta sin backend.** Toda la información se guarda en el navegador
> (una semilla `data.json` + `localStorage`). No hay servidor ni base de datos:
> ideal para demostrar el flujo completo de punta a punta.

---

## 🚀 Puesta en marcha

```bash
npm install      # instalar dependencias
npm run dev      # abrir http://localhost:5173
```

Otros comandos:

```bash
npm run build    # compila tipos (tsc) y genera el bundle de producción
npm run preview  # sirve el build ya generado
npm run lint     # solo chequeo de tipos (tsc -b)
```

### Configuración (.env)

Copia `.env.example` a `.env` y define el dominio donde se aloja la app:

```bash
VITE_APP_BASE_URL=https://tu-dominio.cl
```

Esta URL se usa para construir los **enlaces de los QR** de consulta de trámite.
Si no se define, se usa el origen actual del navegador como respaldo.

### Cuentas de demostración

La contraseña de todas es **`123456`**. En la pantalla de login hay **botones de
acceso rápido** que rellenan las credenciales por ti.

| Rol | Correo | Qué puede hacer |
|-----|--------|-----------------|
| 🧳 Viajero | `viajero@bordersync.cl` | Crear y precargar trámites de cruce |
| 🛂 Aduanas | `aduanas@bordersync.cl` | Validar documentos, fiscalizar, reportes |
| 🌿 SAG | `sag@bordersync.cl` | Control sanitario: aprobar/rechazar declaraciones |
| 🪪 PDI | `pdi@bordersync.cl` | Control migratorio: aprobar/rechazar ingreso de personas |
| ⚙️ Administrador | `admin@bordersync.cl` | Usuarios, parámetros, integraciones |

---

## 🔄 El flujo de punta a punta

Para ver de qué se trata el sistema, sigue este recorrido con dos pestañas:

1. **Como viajero** (`viajero@bordersync.cl`): crea un *Nuevo trámite*, añádele un
   vehículo y una declaración SAG. Verás que cada trámite genera un **pase de
   cruce con QR** y una **estimación de tiempo de espera**.
2. **Como funcionario de Aduanas** (`aduanas@bordersync.cl`): ese trámite aparece
   en la **cola de validación**. Apruébalo.
3. **Vuelve a la vista del viajero**: el trámite ahora está *Aprobado*, y la
   estimación cambió a **carril preferente (~2 min)**.

Ese es el valor del sistema: **trabajo hecho antes de llegar = menos tiempo en la
frontera**.

---

## 👥 Funcionalidades por rol (trazabilidad con las HU)

**🧳 Viajero**
- Registro de cuenta con validación de datos (HU01).
- Documentación de viaje: destino, fecha y motivo (HU03).
- Vehículo (HU04): *particular* (documento con 180 días de vigencia) o
  *diplomático* con placa **CD / CC / OI / PAT** (90 días). Una placa diplomática
  no reconocida es rechazada.
- Declaración SAG (HU05): el sistema **clasifica automáticamente** cada producto
  (permitido / restringido / prohibido) y calcula el nivel de riesgo.
- Declaración de mascota (HU06/RF09): si el declarante es **menor de edad**, se
  exige un representante legal.
- Consulta del estado por identificador (HU07), también desde una **página
  pública** (`/estado/:id`) sin iniciar sesión, o **buscando entre tus trámites
  por la fecha** en que los creaste (cuando no recuerdas el código).
- **Mi actividad**: historial de tus acciones y de lo que ocurre con tus trámites.
- **Pase de cruce con QR real y escaneable** (descargable como **PNG o SVG**)
  que enlaza a esa página de estado, más botones para **copiar el código** del
  trámite o el enlace de consulta.

**🛂 Aduanas**
- Cola de validación: **previsualiza el documento completo** de cada trámite
  (datos, vehículo, declaraciones e historial) antes de aprobar o rechazar; el
  rechazo exige un motivo y queda con trazabilidad (HU08).
- Fiscalización: búsqueda por nombre, RUN o N° de trámite **e historial de
  actividad reciente** (validados/rechazados) con vista de detalle (HU09).
- Reportes estadísticos con **gráficos** (dona de estados, barras de composición)
  y **exportación real** a Excel (CSV) y a PDF (HU10).
- **Procesados**: histórico de trámites ya validados o rechazados, con su
  documento completo e historial.

**🌿 SAG** (control sanitario)
- Revisión de declaraciones de productos y mascotas **priorizadas por riesgo**:
  **aprobar o rechazar** (con motivo); al resolverlas salen de la cola (HU11).
- **Declaraciones revisadas**: histórico de aprobaciones/rechazos, con el
  contenido de cada declaración, el motivo y quién/cuándo la resolvió.

**🪪 PDI** (control migratorio)
- Cola de **control migratorio de personas**: valida la identidad y el movimiento
  de cada viajero, pudiendo **aprobar o rechazar** el ingreso (con motivo).
- **Procesados**: histórico de los controles migratorios resueltos.

**⚙️ Administrador**
- Gestión de usuarios y roles: bloquear / reactivar cuentas (HU12).
- Parámetros de seguridad del sistema en modo lectura (HU13).
- Monitoreo del estado de las 4 integraciones externas (HU14).
- **Auditoría**: registro completo de la actividad de todos los usuarios.

---

## ✅ Validaciones de formularios y datos

Las reglas de validación viven en el **dominio** (no en la UI), de modo que son
únicas, reutilizables y fáciles de probar. Se centralizan en
[`src/shared/lib/validation.ts`](src/shared/lib/validation.ts):

| Validación | Dónde aplica |
|------------|--------------|
| **RUT chileno** con dígito verificador (módulo 11) y autoformato | Registro |
| **Correo** con formato válido y **único** (no repetido) | Registro |
| **Contraseña** ≥ 6 caracteres, con al menos una letra y un número | Registro |
| **Patente** con formato chileno (ej. `BBBB-12`, `AB-1234`) | Vehículo |
| **Placa diplomática** restringida a CD / CC / OI / PAT | Vehículo |
| **Fecha de viaje** no anterior a hoy | Nuevo trámite |
| **Menor de edad** ⇒ representante legal obligatorio | Mascota |
| **Cantidades** dentro de rango y **sin productos duplicados** | SAG / Mascota |
| **Motivo obligatorio** al rechazar un trámite | Aduanas |

Los formularios muestran los errores **campo por campo** y en tiempo real.

### Seguridad (RNF20 / RNF21)
- Bloqueo de la cuenta tras **5 intentos fallidos**, por 15 minutos.
- **Cierre de sesión automático** tras 15 minutos de inactividad.
- Control de acceso **basado en roles (RBAC)**: cada rol solo ve sus pantallas.
- Contraseñas enmascaradas en pantalla.

---

## 🛠️ Stack tecnológico

- **React 18** + **TypeScript** (modo estricto)
- **Vite 6** como bundler y servidor de desarrollo
- **Tailwind CSS 4** para los estilos
- **React Router 6** para la navegación
- Sin librerías de estado ni de backend: un store propio sobre `localStorage`

---

## 🏛️ Arquitectura: Vertical Slice + DDD

El código se organiza por **funcionalidad** (vertical slice), no por tipo de
archivo. Cada *feature* es autocontenida y se divide en las capas de **Domain-
Driven Design**:

```
feature/
├── domain/          → reglas de negocio puras (sin React, sin I/O)
├── application/     → casos de uso: hooks y servicios que orquestan
└── presentation/    → páginas y componentes (lo que se ve)
```

**Regla de dependencias:** `presentation → application → domain`, e
`infrastructure → domain`. **El dominio no depende de nadie.** Por eso reglas
como la vigencia de un vehículo, la clasificación SAG o el bloqueo de login
están aisladas de la interfaz y de cómo se guardan los datos. Si mañana cambias
la UI o conectas un backend, el dominio no se toca.

### Estructura del proyecto

```
src/
├── app/                       # composition root: el router con guards por rol
├── data/
│   └── seed.json              # datos iniciales (reemplaza a la base de datos)
├── shared/                    # núcleo compartido entre features (shared kernel)
│   ├── domain/                # entidades persistidas + Result<T>
│   ├── infrastructure/        # store JSON/localStorage + repositorios
│   ├── session/               # sesión, RBAC (RoleGuard), cierre por inactividad
│   ├── lib/                   # validaciones y formato de fechas
│   └── ui/                    # componentes reutilizables (Button, Badge, ...)
└── features/                  # un slice vertical por dominio
    ├── auth/                  # login, registro, política de bloqueo
    ├── traveler/              # trámites del viajero
    ├── customs/               # validación, fiscalización, reportes
    ├── sanitary/              # control sanitario SAG
    ├── migration/             # control migratorio PDI
    └── admin/                 # usuarios, parámetros, integraciones
```

---

## 💾 Cómo se guardan los datos (sin backend)

1. La primera vez, la app carga [`src/data/seed.json`](src/data/seed.json).
2. Cada cambio (crear un trámite, validar, bloquear un usuario…) se persiste en
   `localStorage` bajo la clave `bordersync.db.v1`.
3. Por eso **los datos sobreviven a recargar la página**.

**Para reiniciar a los datos de fábrica:** borra esa clave del `localStorage`
desde las DevTools del navegador (Application → Local Storage), o ejecuta
`store.reset()` en la consola.

El acceso a los datos pasa siempre por el *store* y los *repositorios* de
[`src/shared/infrastructure/`](src/shared/infrastructure/). **Para conectar un
backend real** (API REST/JSON, como define el ERS) basta con reimplementar esos
repositorios con llamadas HTTP: ni el dominio ni las pantallas cambian.

---

## 📌 Notas

- Este prototipo recrea fielmente las HU del ERS y **añade mejoras de UX** que
  reducen el tiempo real en frontera (auto-clasificación SAG, estimación de
  espera y carril preferente, pase con QR), **sin depender de servicios de IA
  externos**.
- El QR del pase es **real y escaneable** (generado con `qrcode.react`): apunta a
  `VITE_APP_BASE_URL/estado/<id>`. Para que funcione al escanearlo desde un
  teléfono, ese dominio debe estar publicado y accesible.
