# Historias de Usuario — BorderSync (SGAI)

Estas historias de usuario se derivan de los requisitos funcionales RF01 a RF09 y del
diagrama de casos de uso (Vista de Escenarios) especificados en el ERS de BorderSync.
Cada historia justifica una decisión de diseño tomada en el prototipo funcional y sirve
de trazabilidad entre el requisito original y la implementación.

Formato utilizado: `Como [rol], quiero [acción], para [beneficio]`, con criterios de
aceptación en formato Gherkin (`Dado / Cuando / Entonces`).

---

## Actor: Viajero / Turista

### HU01 — Registro de usuario
**Como** viajero, **quiero** registrarme en el sistema con mis datos personales,
**para** poder acceder a las funcionalidades de gestión de mi cruce fronterizo.

*Relacionada con: RF01*

**Criterios de aceptación**
- Dado que ingreso a la pantalla de registro, cuando completo nombre, número de
  documento, correo y contraseña, entonces el sistema confirma el registro exitoso.
- Dado que dejo un campo obligatorio vacío, cuando intento registrarme, entonces el
  sistema muestra un mensaje de error indicando el campo faltante.

---

### HU02 — Inicio de sesión
**Como** viajero, **quiero** iniciar sesión con mi usuario y contraseña,
**para** acceder de forma segura a mis trámites personales.

*Relacionada con: RF02, RNF20*

**Criterios de aceptación**
- Dado que ingreso credenciales válidas, cuando presiono "Iniciar sesión", entonces
  accedo al panel correspondiente a mi rol.
- Dado que ingreso credenciales inválidas, cuando intento iniciar sesión, entonces el
  sistema muestra "Usuario o contraseña incorrectos" sin acceder al sistema.
- Dado que fallo 5 veces consecutivas, cuando intento un sexto inicio de sesión,
  entonces mi cuenta queda bloqueada temporalmente por 15 minutos.

---

### HU03 — Ingreso de documentación de viaje
**Como** viajero, **quiero** completar mis datos de viaje y documentos personales
antes de llegar al control fronterizo, **para** reducir mi tiempo de espera en el
paso fronterizo.

*Relacionada con: RF03*

**Criterios de aceptación**
- Dado que completo nombre, documento, destino y fecha de viaje, cuando envío el
  formulario, entonces el sistema registra mi documentación con un identificador de
  trámite.
- Dado que omito un campo obligatorio, cuando intento enviar el formulario, entonces
  el sistema bloquea el envío y me indica qué falta.

---

### HU04 — Gestión de vehículo propio
**Como** viajero que cruza la frontera en mi vehículo particular, **quiero** registrar
los datos de mi vehículo, **para** obtener el documento de salida y admisión temporal
correspondiente.

*Relacionada con: RF04*

**Criterios de aceptación**
- Dado que ingreso patente, modelo y propietario de un vehículo particular, cuando
  confirmo el registro, entonces el sistema genera el documento "Salida y Admisión
  Temporal de Vehículos Acuerdo Chileno-Argentino" con vigencia de 180 días corridos.
- Dado que selecciono vehículo diplomático e ingreso un tipo de placa válido (CD, CC,
  OI o PAT), cuando confirmo el registro, entonces el sistema genera el "Título de
  Salida Temporal de Vehículos" con vigencia de 90 días corridos.
- Dado que ingreso un tipo de placa diplomática no reconocido, cuando intento
  registrar el vehículo, entonces el sistema rechaza el registro y muestra un error.

---

### HU05 — Declaración SAG
**Como** viajero, **quiero** declarar los productos de origen animal o vegetal que
traigo conmigo, **para** cumplir con la normativa sanitaria antes de cruzar la
frontera.

*Relacionada con: RF05*

**Criterios de aceptación**
- Dado que declaro productos permitidos, cuando envío el formulario, entonces el
  sistema registra mi declaración sin advertencias.
- Dado que declaro un producto restringido o prohibido, cuando envío el formulario,
  entonces el sistema registra la declaración y muestra una advertencia sanitaria.

---

### HU06 — Declaración de mascotas
**Como** viajero que viaja con una mascota, **quiero** declararla al momento de
ingresar a Chile, **para** cumplir con los requisitos sanitarios del SAG y evitar
sanciones.

*Relacionada con: RF09*

**Criterios de aceptación**
- Dado que soy mayor de edad y declaro tipo y cantidad de animales, cuando envío el
  formulario, entonces la declaración queda registrada y disponible para revisión de
  SAG y Aduanas.
- Dado que soy menor de 18 años, cuando intento enviar la declaración sin datos de un
  representante legal, entonces el sistema bloquea el envío y solicita esos datos.
- Dado que soy menor de edad y sí registro un representante legal, cuando envío el
  formulario, entonces la declaración se registra normalmente.

---

### HU07 — Consulta de estado de trámite
**Como** viajero, **quiero** consultar el estado de mis trámites en línea,
**para** saber si ya puedo presentarme en el paso fronterizo sin tener que preguntar
presencialmente.

*Relacionada con: RF07*

**Criterios de aceptación**
- Dado que ingreso el identificador de un trámite existente, cuando presiono
  "Buscar", entonces el sistema muestra el estado actualizado (pendiente o aprobado).
- Dado que ingreso un identificador que no existe, cuando presiono "Buscar", entonces
  el sistema indica que no existe un registro con ese identificador.

---

## Actor: Funcionario de Aduanas

### HU08 — Validar documentos de viajeros
**Como** funcionario de Aduanas, **quiero** revisar y validar los documentos
ingresados por los viajeros, **para** autorizar o rechazar su cruce fronterizo de
forma rápida y trazable.

*Relacionada con: RF06, Vista de Escenarios — "Validar documentos de pasajeros"*

**Criterios de aceptación**
- Dado que existen documentos pendientes en la cola de validación, cuando reviso uno
  y lo marco como "Validar", entonces su estado cambia a aprobado.
- Dado que un documento presenta inconsistencias, cuando lo marco como "Rechazar",
  entonces su estado cambia a rechazado y queda registrado para trazabilidad.

---

### HU09 — Fiscalizar operaciones aduaneras
**Como** funcionario de Aduanas, **quiero** buscar y revisar operaciones por viajero
o número de trámite, **para** ejercer control y fiscalización sobre casos
específicos.

*Relacionada con: Vista de Escenarios — "Fiscalizar operaciones aduaneras"*

**Criterios de aceptación**
- Dado que ingreso un nombre, RUN o ID de trámite, cuando ejecuto la búsqueda,
  entonces el sistema muestra las operaciones asociadas a ese criterio.

---

### HU10 — Generar reportes estadísticos
**Como** funcionario de Aduanas, **quiero** generar reportes de flujo de personas y
vehículos, **para** apoyar la toma de decisiones operativas con datos.

*Relacionada con: RF08*

**Criterios de aceptación**
- Dado que solicito un reporte, cuando confirmo la exportación, entonces el sistema
  genera el archivo en formato PDF o Excel.
- Dado que no hay datos disponibles para los parámetros solicitados, cuando intento
  generar el reporte, entonces el sistema informa que no hay datos disponibles.

---

## Actor: Funcionario SAG / PDI

### HU11 — Revisar declaraciones sanitarias y migratorias
**Como** funcionario SAG/PDI, **quiero** revisar las declaraciones de productos y
mascotas registradas por los viajeros, **para** identificar y gestionar el riesgo
sanitario o migratorio antes de autorizar el ingreso.

*Relacionada con: Vista de Escenarios — "Revisar declaraciones SAG/PDI"*

**Criterios de aceptación**
- Dado que existen declaraciones pendientes, cuando accedo al panel, entonces veo
  cada declaración con su nivel de riesgo (alto, medio o bajo).
- Dado que reviso una declaración, cuando la marco como "Revisada", entonces esta
  desaparece de la cola de pendientes.

---

## Actor: Administrador del Sistema

### HU12 — Gestionar usuarios y roles
**Como** administrador del sistema, **quiero** gestionar los usuarios registrados y
sus roles, **para** mantener el control de acceso basado en roles (RBAC) y la
seguridad del sistema.

*Relacionada con: Vista de Escenarios — "Gestionar usuarios y roles", RNF (Seguridad
3.3.2)*

**Criterios de aceptación**
- Dado que reviso la lista de usuarios, cuando selecciono "Bloquear" sobre un usuario
  activo, entonces su estado cambia a bloqueado.
- Dado que un usuario está bloqueado, cuando selecciono "Reactivar", entonces su
  estado vuelve a activo.

---

### HU13 — Configurar parámetros del sistema
**Como** administrador del sistema, **quiero** visualizar y controlar parámetros
clave de seguridad y operación, **para** asegurar que el sistema cumpla con los
estándares definidos en la ERS (MFA, cifrado, bloqueo por intentos fallidos).

*Relacionada con: Vista de Escenarios — "Configurar parámetros del sistema", RNF
(Seguridad 3.3.2)*

**Criterios de aceptación**
- Dado que accedo al panel de configuración, cuando lo visualizo, entonces veo el
  estado de cada parámetro de seguridad (activado o desactivado).

---

### HU14 — Monitorear integraciones externas
**Como** administrador del sistema, **quiero** ver el estado de las integraciones con
SAG, PDI, Aduanas y Aduanas Argentina, **para** detectar rápidamente si alguna
integración crítica está caída.

*Relacionada con: 3.1.3 Interfaces de software, RNF Disponibilidad 3.3.4*

**Criterios de aceptación**
- Dado que accedo al panel de inicio del administrador, cuando lo visualizo, entonces
  veo el estado de las 4 integraciones externas.

---

## Trazabilidad HU → Prototipo v0.1.0

| HU | RF / Sección ERS | Implementada en v0.1.0 |
|----|-------------------|--------------------------|
| HU01 | RF01 | Parcial (simulada en login) |
| HU02 | RF02, RNF20 | Sí |
| HU03 | RF03 | Sí |
| HU04 | RF04 | Sí |
| HU05 | RF05 | Sí |
| HU06 | RF09 | Sí |
| HU07 | RF07 | Sí |
| HU08 | RF06 | Sí |
| HU09 | Vista de Escenarios | Parcial (solo interfaz de búsqueda, sin datos reales) |
| HU10 | RF08 | Parcial (exportación simulada) |
| HU11 | Vista de Escenarios | Sí |
| HU12 | Vista de Escenarios | Sí |
| HU13 | Vista de Escenarios | Sí (solo lectura) |
| HU14 | 3.1.3 | Sí |

Las historias marcadas como "Parcial" son candidatas naturales para las siguientes
iteraciones del prototipo (v0.2.0 en adelante), una vez que se evalúe el prototipo
v0.1.0 desde la perspectiva de cada actor.
