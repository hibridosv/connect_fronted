# Memoria del proyecto: pulse (connect_fronted)

Reglas acumuladas trabajando con Claude en este repo.

## Cambios en pulse se anotan para connect-app
`connect-app` es el port Expo/React Native de este frontend. Cada vez que cambia funcionalidad aquí, revisa el código equivalente en connect-app (no lo asumas) y agrega una entrada en la sección "Pendientes" de `connect-app/docs/cambios-pendientes-pulse.md` con: fecha, commit de pulse, qué cambió en pulse y connect, la API que usa (endpoints, datos enviados y recibidos), los archivos de pulse que sirven de modelo y los archivos de connect-app que hay que tocar.
- **Por qué:** el usuario porta los cambios a connect-app más tarde. Lo pidió el 2026-10-14 y corrigió a Claude cuando borró un plan con detalles sin pasarlos antes a ese documento.
- **Cómo aplicarlo:** al terminar un cambio en pulse, agrega la entrada y haz commit y push en connect-app (rama `master`) sin esperar a que lo pida. No edites el código de connect-app salvo que lo pida. Si se borra un documento con detalles de implementación, pasa primero lo útil a esa entrada.

## Commits en español
Los mensajes de commit y las descripciones de PR de este repo van en español, salvo que el usuario pida otra cosa.
