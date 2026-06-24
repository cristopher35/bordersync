# Informe de pruebas funcionales — BorderSync vX.Y.Z

## Identificación

| Campo | Valor |
|---|---|
| Versión evaluada | `X.Y.Z` |
| Rama evaluada | `feat/...` |
| Commit evaluado | `<hash>` |
| Fecha de ejecución | AAAA-MM-DD |
| Aplicación | Prototipo web |
| Ejecutor | Nombre del responsable |

## Objetivo

Describir el alcance y los criterios que se evaluarán en esta versión.

## Entorno y comandos

```bash
cd prototipo-web
npm install
npm run build
npm run dev
```

Registrar versiones de Node.js, navegador y cualquier dependencia relevante.

## Resultado general

Indicar si la versión queda aprobada o rechazada y resumir las limitaciones.

## Casos de prueba

| ID | HU | Caso | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|---|
| PF-XXX | HUXX | Descripción | Comportamiento esperado | Evidencia observada | Aprobado/Rechazado |

## Pruebas automáticas

| Comando | Resultado | Evidencia |
|---|---|---|
| `npm run build` | Pendiente | Completar |
| `npm test` | Pendiente | Completar |

## Defectos y limitaciones

| ID | Severidad | Descripción | Acción siguiente |
|---|---|---|---|
| DEF-XXX | Alta/Media/Baja | Descripción | Commit, issue o versión objetivo |

## Cobertura de historias de usuario

| HU | Estado anterior | Estado en esta versión | Evidencia |
|---|---|---|---|
| HUXX | No implementada/Parcial/Completa | Estado resultante | Caso PF-XXX |

## Aprobación de versión

- [ ] Build aprobado.
- [ ] Pruebas automáticas aprobadas.
- [ ] Pruebas manuales críticas aprobadas.
- [ ] Defectos conocidos documentados.
- [ ] Trazabilidad HU actualizada.
- [ ] CHANGELOG y versión actualizados.

**Decisión:** Pendiente / Aprobada / Rechazada.

