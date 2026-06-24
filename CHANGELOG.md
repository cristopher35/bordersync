# Changelog — BorderSync (SGAI) · Prototipos

Este archivo documenta exclusivamente las versiones de los **prototipos funcionales**
desarrollados para BorderSync. No incluye el ERS ni los diagramas de arquitectura
(modelo 4+1), ya que esos artefactos corresponden a una entrega evaluada previamente.

El formato sigue las recomendaciones de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y el versionado sigue [Versionado Semántico (SemVer)](https://semver.org/lang/es/):
`MAJOR.MINOR.PATCH`

- **MAJOR**: cambios incompatibles o reestructuración completa de un prototipo.
- **MINOR**: nueva funcionalidad o nuevo prototipo agregado (ej. versión móvil),
  compatible con lo anterior.
- **PATCH**: correcciones de errores o ajustes menores sobre un prototipo existente,
  sin funcionalidad nueva.

Mientras los prototipos estén en fase de evaluación interna (no entregados aún de forma
formal), las versiones se mantienen en el rango `0.x.x`.

---

## [0.3.0] - 2026-06-24

### Added
- Estado compartido entre roles: los trámites de documentación, registros de
  vehículos y declaraciones (SAG y mascotas) que ingresa el Viajero/Turista ahora
  quedan disponibles en tiempo real en las colas de revisión del Funcionario de
  Aduanas y del Funcionario SAG/PDI, dentro de la misma sesión del navegador.
- El Funcionario de Aduanas puede validar o rechazar tanto trámites de
  documentación como registros de vehículos desde una cola unificada, y ese cambio
  de estado se refleja de inmediato en el panel del Viajero que lo originó.
- El Funcionario SAG/PDI revisa declaraciones SAG y de mascotas reales registradas
  por viajeros, no datos de ejemplo fijos.

### Changed
- Se eliminaron los nombres de personas ficticias mostrados en el panel lateral
  (sidebar) y en el mensaje de bienvenida al iniciar sesión; ahora se muestra
  únicamente el rol activo (ej. "Funcionario de Aduanas") en lugar de un nombre
  propio, manteniendo el prototipo neutro en cuanto a identidad de usuario.

### Known limitations
- Los datos compartidos entre roles viven en memoria del navegador y se pierden al
  recargar la página o cerrar la pestaña, ya que este prototipo no incluye una base
  de datos real. Esto es intencional: corresponde al alcance de un prototipo de
  visualización funcional, no a una implementación de backend en producción.

---

## [0.2.0] - 2026-06-24

### Added
- Panel de ajustes de accesibilidad (ícono fijo en la esquina superior derecha,
  visible en todas las pantallas): permite ajustar el tamaño de letra de toda la
  aplicación (A-/A/A+) y cambiar el idioma de la interfaz (Español/English),
  conforme a RNF22 (usabilidad básica) y RNF24 (idioma).
- Restricción de acceso al panel de Administrador del Sistema: se retiró su tarjeta
  de la pantalla principal de selección de rol y se reemplazó por un ícono de
  candado fijo en la esquina inferior izquierda, que solicita una clave antes de
  permitir el ingreso. Refuerza el control de acceso basado en roles (RBAC) descrito
  en el RNF de seguridad (3.3.2) de la ERS.

### Changed
- Pantalla de inicio de sesión simplificada: el acceso a los roles Viajero/Turista,
  Funcionario de Aduanas y Funcionario SAG/PDI pasó de un flujo de dos pasos
  (selección de rol + formulario de usuario/contraseña simulado) a un acceso
  directo de un clic, dejando la verificación de credenciales únicamente para el
  rol de Administrador. Cambio motivado por retroalimentación del equipo: el paso
  de credenciales simuladas no aportaba valor a la demostración y generaba
  confusión sobre si existían credenciales reales.
- Las tarjetas de selección de rol ya no muestran nombre de persona ni número de
  RUT/credencial de ejemplo; solo indican el rol disponible, evitando que el
  prototipo asocie el sistema a personas ficticias específicas.
- Se retiró de la pantalla el texto "Prototipo funcional — selecciona un perfil..."
  y la nota sobre credenciales en producción, dejando esas aclaraciones para la
  exposición oral en lugar de mostrarlas en la interfaz.

---

## [0.1.2] - 2026-06-24

### Changed
- Se sustituyó la fotografía de fondo de la pantalla de inicio de sesión (de una
  vista del Complejo Fronterizo Los Libertadores a una vista de carretera de
  montaña/cordillera), a solicitud del equipo tras evaluar el contraste visual.
- Se ajustó el tratamiento de legibilidad del texto sobre la foto de fondo: se
  reemplazó el uso de sombra de texto (text-shadow) por franjas de fondo azul
  semitransparente detrás de cada bloque de texto (encabezado, instrucciones,
  notas), garantizando legibilidad sin depender de qué tan clara u oscura sea la
  zona de la fotografía detrás del texto.

---

## [0.1.1] - 2026-06-23

### Changed
- Pantalla de inicio de sesión: se reemplazó el fondo de gradiente azul plano por una
  fotografía real del Complejo Fronterizo Los Libertadores, manteniendo la legibilidad
  del texto mediante sombra de texto (text-shadow) en lugar de un overlay de color.
  Ajuste motivado por retroalimentación directa del equipo al probar el prototipo
  v0.1.0 como usuario final (HU implícita: la pantalla de acceso debe transmitir
  contexto institucional y de uso real desde el primer vistazo).

---

## [0.1.0] - 2026-06-23

### Added
- Prototipo funcional **web** (`BorderSync_Prototipo_Web.jsx`) con los 4 roles
  definidos en la ERS: Viajero/Turista, Funcionario de Aduanas, Funcionario SAG/PDI
  y Administrador del Sistema.
- Pantalla de inicio de sesión (RF02) con selección de perfil y formulario de
  credenciales ("USER" / "CONTRASEÑA", conforme a RNF20).
- Módulo de ingreso de documentación de viaje (RF03), con bloqueo de envío si faltan
  campos obligatorios.
- Módulo de gestión de vehículos (RF04), con distinción entre vehículo particular
  (180 días corridos) y vehículo diplomático (90 días corridos, placas CD/CC/OI/PAT).
- Módulo de declaración SAG (RF05), con advertencia automática ante productos
  restringidos.
- Módulo de declaración de mascotas (RF09), con bloqueo de envío si el declarante es
  menor de edad sin representante legal registrado.
- Módulo de consulta de estado de trámites (RF07).
- Panel de fiscalización para Funcionario de Aduanas: cola de validación de
  documentos y generación de reportes (RF08).
- Panel de revisión de declaraciones para Funcionario SAG/PDI, con indicador de
  nivel de riesgo.
- Panel de administración: gestión de usuarios y roles (RBAC), estado de
  integraciones externas (SAG, PDI, Aduanas, Aduanas Argentina) y configuración de
  seguridad.
- Identidad visual institucional aplicada conforme a RNF25 (paleta azul institucional,
  acentos semánticos para estados de aprobación, advertencia y error).

---

## [Sin liberar] - próxima versión

### Planeado
- Prototipo funcional **app móvil** (iOS / Android), equivalente en alcance al
  prototipo web, adaptado a patrones de interacción móviles.

---

## Convenciones de uso de este changelog

- Cada nuevo prototipo (web, móvil, u otra variante) que agregue alcance nuevo se
  documenta como versión `MINOR`.
- Una corrección sobre un prototipo ya entregado (bug, ajuste visual, dato corregido)
  se documenta como versión `PATCH` dentro de la misma sección o como nueva entrada,
  según el momento en que se realice.
- Este archivo se mantiene en la raíz del repositorio Git del proyecto
  (`/CHANGELOG.md`), separado de los documentos de especificación.
