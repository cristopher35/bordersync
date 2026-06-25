# Informe de Pruebas — BorderSync SGAI

**Proyecto:** BorderSync — Sistema de Gestión Aduanera Inteligente  
**Versión evaluada:** 0.13.0  
**Tipo de pruebas:** Pruebas funcionales de caja negra sobre el prototipo web  
**Equipo:** Cristopher Meneses · Hans Román · Nicolás Vera  
**Fecha:** 2026-06-25  

---

## 1. Introducción

Este informe documenta las pruebas funcionales realizadas sobre el prototipo web de BorderSync (v0.13.0), verificando que los requisitos funcionales especificados en el ERS y las Historias de Usuario (HU01–HU14) se cumplen correctamente en la interfaz.

Las pruebas se ejecutaron manualmente sobre el prototipo desplegado en [bordersync.vercel.app](https://bordersync.vercel.app) y de forma local (`npm run dev`). No se ejecutaron pruebas automatizadas: el alcance del prototipo es de visualización y demostración funcional de punta a punta.

---

## 2. Alcance

| Módulo | HU / RF cubiertos |
|--------|-------------------|
| Registro de usuario | HU01 / RF01 |
| Inicio de sesión y bloqueo | HU02 / RF02, RNF20 |
| Documentación de viaje | HU03 / RF03 |
| Gestión de vehículo | HU04 / RF04 |
| Declaración SAG | HU05 / RF05 |
| Declaración de mascotas | HU06 / RF09 |
| Consulta de estado de trámite | HU07 / RF07 |
| Validación por Aduanas | HU08 / RF06 |
| Fiscalización Aduanas | HU09 |
| Reportes estadísticos | HU10 / RF08 |
| Revisión declaraciones SAG | HU11 |
| Control migratorio PDI | HU11 (migración) |
| Gestión de usuarios (Admin) | HU12 |
| Parámetros del sistema (Admin) | HU13 |
| Monitoreo de integraciones (Admin) | HU14 |
| Workflow encadenado PDI → SAG → Aduanas | RF06, RNF |
| Estimación de tiempo de espera | Mejora UX |

---

## 3. Entorno de prueba

- **Navegador:** Google Chrome 125 / Microsoft Edge 124  
- **Resolución:** 1920×1080  
- **Sistema operativo:** Windows 11  
- **URL local:** `http://localhost:5173`  
- **URL producción:** `https://bordersync.vercel.app`  
- **Datos:** semilla `seed.json` cargada automáticamente; datos persistidos en `localStorage` bajo la clave `bordersync.db.v1`

---

## 4. Casos de prueba

### 4.1 Registro de usuario (HU01)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-01 | Registro exitoso — viajero chileno | Nombre: "Juan Pérez", Nacionalidad: Chilena, RUT: 12.345.678-9, Email: nuevo@test.cl, Contraseña: test123, Confirmar: test123 | Cuenta creada, redirige al dashboard del viajero | Cuenta creada correctamente | PASA |
| PR-02 | Registro exitoso — viajero extranjero | Nombre: "John Smith", Nacionalidad: Argentina, Documento: AB123456, Email: john@test.cl, Contraseña: pass456 | Cuenta creada sin validar formato de RUT | Acepta pasaporte/doc de identidad genérico | PASA |
| PR-03 | RUT inválido (chileno) | RUT: 11.111.111-1 (DV incorrecto) | Error "RUT inválido (revisa el dígito verificador)" | Muestra error en campo documento | PASA |
| PR-04 | Documento extranjero demasiado corto | Nacionalidad: Peruana, Documento: "AB" | Error: documento inválido | Muestra error de formato | PASA |
| PR-05 | Email con formato inválido | Email: "correo_sin_arroba" | Error "Correo con formato inválido" | Muestra error en campo email | PASA |
| PR-06 | Email ya registrado | Email: viajero@bordersync.cl | Error "Ya existe una cuenta con este correo" | Muestra error de duplicado | PASA |
| PR-07 | Contraseña sin número | Contraseña: "sololetras" | Error "Debe incluir al menos una letra y un número" | Muestra error de complejidad | PASA |
| PR-08 | Contraseñas no coinciden | Contraseña: "test123", Confirmar: "test456" | Error "Las contraseñas no coinciden" | Muestra error en campo confirmación | PASA |
| PR-09 | Nombre muy corto | Nombre: "Al" | Error "Ingresa tu nombre completo" | Muestra error en campo nombre | PASA |
| PR-10 | Campos obligatorios vacíos | Formulario vacío, presionar Registrar | Errores en todos los campos requeridos | Muestra todos los errores | PASA |

---

### 4.2 Inicio de sesión y bloqueo de cuenta (HU02 / RNF20)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-11 | Login exitoso | Email: viajero@bordersync.cl, Contraseña: 123456 | Accede al panel del viajero | Redirige al dashboard correctamente | PASA |
| PR-12 | Contraseña incorrecta (1 intento) | Email válido, contraseña: "wrongpass" | Error genérico, muestra intentos restantes | Muestra "4 intentos restantes" | PASA |
| PR-13 | Bloqueo temporal tras 5 intentos | 5 intentos fallidos seguidos | Cuenta bloqueada 15 minutos | Muestra mensaje de bloqueo con tiempo | PASA |
| PR-14 | Intento en cuenta bloqueada temporalmente | Login en cuenta con bloqueo activo | Mensaje indicando bloqueo temporal y tiempo restante | Muestra bloqueo sin procesar contraseña | PASA |
| PR-15 | Cuenta bloqueada por administrador | Login con cuenta en estado "bloqueado" | Mensaje de cuenta suspendida, sin acceso | Muestra error de cuenta bloqueada | PASA |
| PR-16 | Email inexistente | Email: noexiste@test.cl | Error genérico (no revela si el email existe) | Muestra mismo error que contraseña incorrecta | PASA |
| PR-17 | Acceso rápido (botones de demo) | Clic en botón "Viajero" en pantalla de login | Rellena credenciales automáticamente | Credenciales rellenadas correctamente | PASA |

---

### 4.3 Documentación de viaje (HU03 / RF03)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-18 | Crear trámite completo | Destino, fecha futura, motivo de viaje completos | Trámite creado con ID único y QR | Trámite creado, aparece en lista | PASA |
| PR-19 | Fecha de viaje pasada | Fecha: ayer | Error "La fecha no puede ser anterior a hoy" | Bloquea envío con error de fecha | PASA |
| PR-20 | Campos obligatorios vacíos | Formulario vacío | Errores campo por campo | Muestra errores en todos los campos | PASA |
| PR-21 | Pase con QR generado | Trámite creado exitosamente | QR escaneable apunta a /estado/:id | QR visible, descargable como PNG y SVG | PASA |
| PR-22 | Búsqueda de trámite por fecha | Buscar trámites del día actual | Lista filtrada por fecha de creación | Filtra correctamente | PASA |

---

### 4.4 Gestión de vehículo (HU04 / RF04)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-23 | Vehículo particular válido | Tipo: Particular, Patente: BBBB12, Modelo: Toyota, Propietario: Juan | Documento "Salida y Admisión Temporal..." vigencia 180 días | Documento generado con vencimiento correcto | PASA |
| PR-24 | Vehículo diplomático con placa CD | Tipo: Diplomático, Placa: CD | Documento "Título de Salida Temporal..." vigencia 90 días | Documento generado con 90 días | PASA |
| PR-25 | Placa diplomática no reconocida | Tipo: Diplomático, Placa: "XX" | Error "Tipo de placa diplomática no reconocido" | Muestra error y bloquea envío | PASA |
| PR-26 | Patente con formato internacional | Patente: "AB 123 CD" | Aceptada (formato internacional) | Patente aceptada correctamente | PASA |
| PR-27 | Campos vacíos en vehículo | Formulario vacío | Error "Patente, modelo y propietario son obligatorios" | Muestra error de campos obligatorios | PASA |

---

### 4.5 Declaración SAG (HU05 / RF05)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-28 | Solo productos permitidos | Productos: Agua embotellada, Galletas envasadas | Sin advertencia, riesgo bajo | Declaración creada sin advertencia | PASA |
| PR-29 | Incluye producto restringido | Productos: Frutas frescas (manzanas) | Advertencia sanitaria, riesgo medio | Advertencia visible, nivel riesgo medio | PASA |
| PR-30 | Incluye producto prohibido | Productos: Carne fresca | Advertencia sanitaria, riesgo alto | Advertencia visible, nivel riesgo alto | PASA |
| PR-31 | Mezcla prohibidos y permitidos | Embutidos artesanales + Chocolate sellado | Riesgo alto (prevalece lo prohibido) | Clasifica correctamente como alto | PASA |

---

### 4.6 Declaración de mascotas (HU06 / RF09)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-32 | Mayor de edad, sin representante | Menor: No, Animal: Perro, Cantidad: 1 | Declaración registrada | Declaración creada correctamente | PASA |
| PR-33 | Menor de edad con representante legal | Menor: Sí, Representante: "María González" | Declaración registrada con datos del representante | Registrada con representante | PASA |
| PR-34 | Menor de edad sin representante | Menor: Sí, Representante: "" | Error "debes registrar un representante legal válido" | Bloquea envío con error | PASA |
| PR-35 | Cantidad fuera de rango | Cantidad: 0 / Cantidad: 21 | Error "La cantidad debe estar entre 1 y 20" | Muestra error de rango | PASA |
| PR-36 | Tipo de animal vacío | Animal: "" | Error "Indica el tipo de animal" | Muestra error en campo | PASA |

---

### 4.7 Consulta de estado (HU07 / RF07)

| ID | Caso | Datos de entrada | Resultado esperado | Resultado obtenido | Estado |
|----|------|-----------------|--------------------|--------------------|--------|
| PR-37 | Consulta por ID válido (sin sesión) | Ingresar ID de trámite en /estado/:id | Muestra estado, workflow y datos del trámite | Página pública carga correctamente | PASA |
| PR-38 | Consulta por ID inexistente | ID: "ID-NO-EXISTE" | Mensaje "no existe un registro con ese identificador" | Muestra mensaje de no encontrado | PASA |
| PR-39 | QR escaneable enlaza a página pública | Escanear QR del pase de cruce | Abre /estado/:id en el navegador | URL correcta, página carga | PASA |

---

### 4.8 Workflow encadenado PDI → SAG → Aduanas (RF06)

| ID | Caso | Estado del trámite | Resultado esperado | Resultado obtenido | Estado |
|----|------|-------------------|--------------------|--------------------|--------|
| PR-40 | Aduanas intenta aprobar sin PDI ni SAG | PDI: pendiente, SAG: pendiente | Botón "Validar" deshabilitado; indica que faltan ambos controles | Botón deshabilitado con mensaje explicativo | PASA |
| PR-41 | Aduanas intenta aprobar solo con PDI | PDI: aprobado, SAG: pendiente | Botón deshabilitado; indica que falta control sanitario | Muestra "falta control sanitario (SAG)" | PASA |
| PR-42 | Aduanas intenta aprobar solo con SAG | PDI: pendiente, SAG: aprobado | Botón deshabilitado; indica que falta control migratorio | Muestra "falta control migratorio (PDI)" | PASA |
| PR-43 | Aduanas aprueba con PDI y SAG aprobados | PDI: aprobado, SAG: aprobado | Botón "Validar" habilitado; aprueba el trámite | Trámite pasa a estado Aprobado | PASA |
| PR-44 | Aduanas rechaza sin importar PDI/SAG | PDI: pendiente, SAG: pendiente | Botón "Rechazar" siempre disponible (exige motivo) | Rechaza con motivo; estado actualizado | PASA |
| PR-45 | Trámite sin declaraciones (SAG implícitamente ok) | Sin declaración SAG ni mascota | Control sanitario considerado aprobado automáticamente | SAG no bloquea si no hay declaraciones | PASA |

---

### 4.9 Estimación de tiempo de espera

| ID | Caso | Estado del trámite | Resultado esperado | Resultado obtenido | Estado |
|----|------|-------------------|--------------------|--------------------|--------|
| PR-46 | Trámite aprobado por Aduanas | Estado: aprobado | 2 min — Carril preferente (pre-autorizado) — verde | Muestra 2 min en verde | PASA |
| PR-47 | Trámite rechazado | Estado: rechazado | 30 min — Requiere atención presencial — rojo | Muestra 30 min en rojo | PASA |
| PR-48 | Pendiente con riesgo SAG alto | SAG: riesgo alto, estado: pendiente | 25 min — Inspección SAG probable — rojo | Muestra 25 min en rojo | PASA |
| PR-49 | Pendiente con declaraciones (riesgo medio/bajo) | Con vehículo o declaración, riesgo no alto | 15 min — Validación en curso — ámbar | Muestra 15 min en ámbar | PASA |
| PR-50 | Pendiente sin ninguna declaración | Solo documentación básica | 10 min — Documentación básica — ámbar | Muestra 10 min en ámbar | PASA |

---

### 4.10 Roles de funcionarios

| ID | Caso | Actor | Resultado esperado | Resultado obtenido | Estado |
|----|------|-------|--------------------|--------------------|--------|
| PR-51 | Cola de validación Aduanas | Aduanas | Lista de trámites pendientes con preview completo | Cola visible con datos reales del viajero | PASA |
| PR-52 | Rechazo Aduanas exige motivo | Aduanas | No permite rechazar sin ingresar motivo | Campo motivo obligatorio al rechazar | PASA |
| PR-53 | Exportar reporte a Excel (CSV) | Aduanas | Descarga archivo CSV con datos estadísticos | Archivo descargado correctamente | PASA |
| PR-54 | Exportar reporte a PDF | Aduanas | Descarga PDF con gráficos y estadísticas | Archivo PDF generado y descargado | PASA |
| PR-55 | Cola SAG priorizada por riesgo | SAG | Declaraciones ordenadas: alto → medio → bajo | Orden de prioridad correcto | PASA |
| PR-56 | SAG aprueba declaración | SAG | Declaración sale de la cola, queda en historial | Se mueve a "Declaraciones revisadas" | PASA |
| PR-57 | PDI aprueba control migratorio | PDI | Trámite pasa a control migratorio aprobado | Estado migratorio actualizado | PASA |
| PR-58 | Historial de procesados (Aduanas/SAG/PDI) | Aduanas, SAG, PDI | Vista de trámites ya resueltos con detalle y quién/cuándo | Historial visible con trazabilidad | PASA |

---

### 4.11 Administrador del sistema (HU12–HU14)

| ID | Caso | Resultado esperado | Resultado obtenido | Estado |
|----|------|--------------------|--------------------|--------|
| PR-59 | Bloquear usuario activo | Estado del usuario cambia a "bloqueado" | Usuario bloqueado, no puede iniciar sesión | PASA |
| PR-60 | Reactivar usuario bloqueado | Estado del usuario vuelve a "activo" | Usuario reactivado correctamente | PASA |
| PR-61 | Parámetros de seguridad (solo lectura) | Muestra estado de MFA, cifrado, bloqueo por intentos | Parámetros visibles, no editables | PASA |
| PR-62 | Monitoreo de integraciones externas | Muestra estado de SAG, PDI, Aduanas, Aduanas Argentina | 4 integraciones con estado visible | PASA |
| PR-63 | Auditoría de actividad | Registro completo de acciones de todos los usuarios | Log de auditoría visible y ordenado | PASA |

---

### 4.12 Control de acceso por roles (RBAC)

| ID | Caso | Resultado esperado | Resultado obtenido | Estado |
|----|------|--------------------|--------------------|--------|
| PR-64 | Viajero no puede acceder a rutas de Aduanas | Intento directo a /customs/* | Redirige al panel del viajero o muestra acceso denegado | Redirigido correctamente | PASA |
| PR-65 | Funcionario no puede acceder a panel de Admin | Intento directo a /admin/* | Redirigido a su propio panel | Redirigido correctamente | PASA |
| PR-66 | Acceso al Admin requiere clave | Clic en ícono de candado en pantalla de login | Solicita clave antes de ingresar | Muestra modal de clave | PASA |

---

## 5. Resumen de resultados

| Módulo | Casos probados | Pasan | Fallan |
|--------|---------------|-------|--------|
| Registro de usuario | 10 | 10 | 0 |
| Login y bloqueo | 7 | 7 | 0 |
| Documentación de viaje | 5 | 5 | 0 |
| Gestión de vehículo | 5 | 5 | 0 |
| Declaración SAG | 4 | 4 | 0 |
| Declaración de mascotas | 5 | 5 | 0 |
| Consulta de estado | 3 | 3 | 0 |
| Workflow PDI → SAG → Aduanas | 6 | 6 | 0 |
| Estimación de espera | 5 | 5 | 0 |
| Roles de funcionarios | 8 | 8 | 0 |
| Administrador | 5 | 5 | 0 |
| Control de acceso (RBAC) | 3 | 3 | 0 |
| **Total** | **66** | **66** | **0** |

---

## 6. Conclusiones

El prototipo web BorderSync v0.13.0 cumple con la totalidad de los requisitos funcionales verificados en este informe. Los 66 casos de prueba ejecutados resultaron exitosos sin excepciones.

Aspectos destacados verificados:

- La **validación diferenciada por nacionalidad** funciona correctamente: viajeros chilenos requieren RUT con dígito verificador; extranjeros ingresan pasaporte o documento de identidad genérico.
- El **workflow encadenado** (PDI → SAG → Aduanas) impide que Aduanas apruebe un trámite sin que los controles previos estén completos, con mensajes claros al funcionario sobre qué falta.
- La **clasificación automática SAG** y la **estimación de tiempo de espera** funcionan de forma consistente con las reglas definidas en el dominio.
- El **control de acceso por roles (RBAC)** impide el acceso cruzado entre roles en todas las rutas verificadas.

**Limitación conocida del prototipo:** al tratarse de un sistema sin backend, los datos se pierden al limpiar el `localStorage` del navegador. Esto es intencional dentro del alcance de este prototipo funcional.
