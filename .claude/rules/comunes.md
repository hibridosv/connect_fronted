# Reglas comunes (todos los repos de Hibrido)

Estas reglas son iguales en todos los repos. Si cambias una, cámbiala en todos.

## Idioma

- Todo el texto dirigido al usuario (explicaciones, resúmenes, preguntas) va en español, aunque el usuario escriba en inglés o el código esté en inglés. Los términos técnicos sin traducción natural ("commit", "deploy", "config cache") pueden quedar en inglés.
- El código, los identificadores, las columnas y los mensajes de commit siguen la convención del repo (si el `CLAUDE.md` del repo no dice nada, usa el idioma de los commits recientes).

## Dónde guardar las reglas nuevas

- Las reglas y el contexto de cada repo viven en `.claude/rules/` y se suben a git para que estén disponibles en cualquier equipo. No las guardes solo en la memoria local (`~/.claude/projects/.../memory`).
- Cuando el usuario pida recordar algo de un proyecto o corrija cómo trabajar, agrégalo a `.claude/rules/memoria-proyecto.md` del repo (créalo si no existe) y avisa que hay que hacer commit.
- Las preferencias personales que aplican a todos los proyectos van en el repo `claude-config` (`~/claude-config/CLAUDE.md`).
