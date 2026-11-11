# Memoria del proyecto: pulse (connect_fronted)

Reglas acumuladas trabajando con Claude en este repo.

## Cambios en pulse se anotan para connect-app
`connect-app` es el port Expo/React Native de este frontend. Cada vez que cambia funcionalidad aquí, revisa el código equivalente en connect-app (no lo asumas) y agrega una entrada en la sección "Pendientes" de `connect-app/docs/cambios-pendientes-pulse.md` con: fecha, commit de pulse, qué cambió en pulse y connect, la API que usa (endpoints, datos enviados y recibidos), los archivos de pulse que sirven de modelo y los archivos de connect-app que hay que tocar.
- **Por qué:** el usuario porta los cambios a connect-app más tarde. Lo pidió el 2026-10-14 y corrigió a Claude cuando borró un plan con detalles sin pasarlos antes a ese documento.
- **Cómo aplicarlo:** al terminar un cambio en pulse, agrega la entrada y haz commit y push en connect-app (rama `master`) sin esperar a que lo pida. No edites el código de connect-app salvo que lo pida. Si se borra un documento con detalles de implementación, pasa primero lo útil a esa entrada.

## Correcciones de la auditoría 2026-11-09 en `fix/seguridad-login`
Lo de `docs/pending/auditoria-seguridad-logica-pulse-2026-11-09.md` se trabaja en la rama `fix/seguridad-login`, que sale de `main` (pulse no tiene `master`).
- **Por qué:** el usuario lo pidió el 2026-11-09, después del fix de SEC1.
- **Cómo aplicarlo:** cámbiate a esa rama antes de tocar código de la auditoría; no crees ramas por punto ni trabajes en `develop`. La rama no tiene upstream a `main` a propósito (para que un push no vaya ahí): súbela con `git push -u origin fix/seguridad-login`. Al terminar cada punto, actualiza su estado en el documento de la auditoría.
- **Ramas:** desde el 2026-11-11 la rama de trabajo de pulse es `develop` (antes `developer`) y la principal es `main`. El plan de mejoras de estilos se trabajó y terminó en `develop` por pedido del usuario; su resumen está en `docs/planes-terminados.md`.

## Planes terminados: se resumen y salen de `docs/pending/`
Cuando un plan de `docs/pending/` se termina, se resume en `docs/planes-terminados.md` (qué se hizo, decisiones vigentes, cosas que cuidar y commits clave) y se borra de `docs/pending/`. El texto completo queda en git.
- **Por qué:** es la misma regla de connect; el usuario aprobó aplicarla en pulse el 2026-11-11 al cerrar el plan de estilos.
- **Cómo aplicarlo:** al terminarlo, cambia las referencias a su ruta en otros documentos.

## Commits en español
Los mensajes de commit y las descripciones de PR de este repo van en español, salvo que el usuario pida otra cosa.
