# Flujo de versiones, pruebas y commits

Este documento define cómo desarrollar y registrar las siguientes versiones de
BorderSync sin trabajar directamente sobre `main`.

## Ramas

- `main`: versión estable y revisada.
- `feat/<descripcion>`: funcionalidad nueva o nueva versión funcional.
- `fix/<descripcion>`: corrección de un defecto.
- `docs/<descripcion>`: documentación sin cambio funcional.
- `test/<descripcion>`: pruebas o infraestructura de pruebas.

Cada cambio debe desarrollarse en una rama y llegar a `main` mediante revisión o
pull request. Antes de comenzar una nueva tarea se debe actualizar `main` y crear una
rama desde ella.

## Versionado

Mientras el proyecto esté en prototipo se utilizará SemVer `0.MINOR.PATCH`:

- `0.MINOR.0`: nueva funcionalidad o incremento importante del prototipo.
- `0.MINOR.PATCH`: corrección compatible sobre una versión existente.
- Ejemplo: persistencia y autenticación pueden formar `0.2.0`; una corrección de
  validación posterior puede ser `0.2.1`.

La versión debe actualizarse en `prototipo-web/package.json`, `CHANGELOG.md` y el
informe de pruebas correspondiente.

## Commits

Usar mensajes breves y enfocados:

```text
feat: persistir usuarios en almacenamiento local
fix: conservar estado bloqueado después de recargar
test: cubrir persistencia de usuarios
docs: registrar resultados de pruebas v0.2.0
chore: preparar versión 0.2.0
```

No mezclar toda una versión en un solo commit. Como mínimo, una funcionalidad debe
tener un commit de implementación y otro de pruebas cuando estas sean aplicables.

## Registro obligatorio de cada versión

Para cada versión `X.Y.Z` se debe crear:

```text
docs/Pruebas_Funcionales_vX.Y.Z.md
```

Se debe copiar y completar `docs/Plantilla_Pruebas_Funcionales.md`; la plantilla no
se modifica directamente para conservarla disponible para la versión siguiente.

El informe debe registrar:

1. Versión, rama, commit y fecha evaluados.
2. Entorno y comandos utilizados.
3. Casos de prueba con resultado esperado y obtenido.
4. Cobertura de historias de usuario.
5. Defectos conocidos y limitaciones.
6. Resultado de compilación y pruebas automáticas.
7. Aprobación o rechazo de la versión.

Los fallos no deben borrarse del informe. Se registran como rechazados y se enlazan
con la corrección de la versión siguiente.

## Secuencia recomendada para una nueva versión

```text
Actualizar main
  → crear rama feat/...
  → implementar una HU
  → ejecutar y registrar pruebas
  → actualizar CHANGELOG y versión
  → hacer commits separados
  → abrir pull request
  → revisar
  → integrar a main
  → crear etiqueta vX.Y.Z
```

## Lista de verificación antes de integrar

- [ ] La aplicación compila sin errores.
- [ ] Las pruebas automáticas pasan.
- [ ] Se ejecutaron los casos manuales relevantes.
- [ ] Existe `docs/Pruebas_Funcionales_vX.Y.Z.md`.
- [ ] La trazabilidad HU refleja el estado real.
- [ ] `CHANGELOG.md` describe los cambios.
- [ ] `package.json` contiene la versión correcta.
- [ ] No hay archivos temporales ni credenciales en Git.
- [ ] Los commits son pequeños, descriptivos y revisables.
