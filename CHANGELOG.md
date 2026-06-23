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
