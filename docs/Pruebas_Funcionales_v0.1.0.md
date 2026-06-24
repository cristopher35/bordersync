# Informe de pruebas funcionales — BorderSync v0.1.0

## Identificación

| Campo | Valor |
|---|---|
| Versión evaluada | `0.1.0` |
| Rama evaluada | `main` |
| Commit evaluado | `123a138` |
| Fecha de ejecución | 2026-06-23 |
| Aplicación | Prototipo web React + Vite |
| Ejecutor | Equipo BorderSync con asistencia de Codex |

## Objetivo

Comprobar el alcance funcional declarado para la versión `0.1.0`, con especial
atención a la validación de formularios, cambios de estado y persistencia de datos
después de recargar la aplicación.

## Entorno y método

- Compilación de producción mediante Vite.
- Ejecución local en `http://127.0.0.1:5173`.
- Pruebas manuales asistidas desde navegador sobre los perfiles Viajero y
  Administrador.
- Inspección del código de `prototipo-web/src/App.jsx` para verificar el mecanismo
  de almacenamiento.

## Resultado general

La aplicación compila y sus paneles principales se pueden recorrer. Sin embargo,
los datos y cambios de estado existen únicamente en memoria mediante `useState`.
La versión no utiliza API, base de datos, `localStorage`, `sessionStorage` ni
`IndexedDB`. Por lo tanto, los cambios se pierden al recargar la página o cerrar la
sesión.

## Casos de prueba ejecutados

| ID | Caso | Pasos resumidos | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| PF-001 | Compilar aplicación | Ejecutar build de producción | Build sin errores | Build generado correctamente | Aprobado |
| PF-002 | Acceder como viajero | Seleccionar Viajero/Turista | Mostrar panel del viajero | Panel cargado con dos trámites de ejemplo | Aprobado |
| PF-003 | Validar formulario incompleto | Enviar documentación con un campo obligatorio faltante | Bloquear envío y mostrar error | Se mostró el mensaje de campos obligatorios | Aprobado |
| PF-004 | Cambiar estado de usuario | Ingresar como administrador y bloquear a Camila Soto | Estado visible cambia a Bloqueado | Estado cambió durante la sesión | Aprobado parcial |
| PF-005 | Persistir cambio tras recarga | Recargar después de PF-004 e ingresar nuevamente | Camila continúa bloqueada | Camila volvió al estado Activo | Rechazado |
| PF-006 | Crear usuario | Presionar Nuevo usuario | Mostrar formulario y guardar usuario | Solo aparece una notificación de simulación | Rechazado |
| PF-007 | Autenticación de usuario | Acceder como viajero con credenciales | Validar usuario y contraseña | El acceso se realiza seleccionando un perfil | Rechazado |

## Cobertura de historias de usuario

| HU | Evaluación real de v0.1.0 | Observación |
|---|---|---|
| HU01 | No implementada | No existe formulario ni almacenamiento de registro. |
| HU02 | No implementada | No existe autenticación para usuarios; administrador usa una clave fija. |
| HU03 | Parcial | Valida y agrega trámites solo durante la sesión. |
| HU04 | Parcial | Valida campos y muestra un mensaje, pero no guarda ni genera un documento real. |
| HU05 | Parcial | Detecta palabras restringidas, pero no persiste ni comparte la declaración con SAG. |
| HU06 | Parcial | Valida edad y representante, pero no persiste ni comparte la declaración. |
| HU07 | Parcial | Busca únicamente en el arreglo local del viajero. |
| HU08 | Parcial | Aprobar o rechazar cambia el estado solo en memoria y no deja trazabilidad. |
| HU09 | No implementada | Existe el campo de búsqueda, pero no ejecuta una consulta. |
| HU10 | No implementada | PDF y Excel muestran una notificación; no generan archivos. |
| HU11 | Parcial | Revisar elimina temporalmente el elemento de la cola. |
| HU12 | Parcial | Bloquear y reactivar son temporales; alta y edición de roles no existen. |
| HU13 | Parcial | Presenta parámetros fijos de solo lectura. |
| HU14 | Parcial | Presenta cuatro estados fijos, sin monitoreo de integraciones. |

## Hallazgos y acciones recomendadas

1. Implementar una capa de almacenamiento antes de ampliar los formularios.
2. Priorizar HU01, HU02 y HU12 para establecer usuarios, autenticación y roles.
3. Hacer que los registros del viajero alimenten las colas de Aduanas y SAG/PDI.
4. Añadir pruebas automáticas para validaciones, persistencia y permisos por rol.
5. Corregir la tabla de trazabilidad cuando una historia cambie de estado.

## Criterio para cerrar la prueba de persistencia

PF-005 solo podrá marcarse como aprobado cuando el estado modificado continúe
vigente después de recargar la aplicación y volver a iniciar sesión. Si se usa
`localStorage`, la persistencia será únicamente local al navegador; para persistencia
compartida entre usuarios se requerirá una API y una base de datos.

