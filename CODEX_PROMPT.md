# DJPay - Auditoría Técnica Completa

Lee completamente los siguientes documentos antes de hacer cualquier análisis:

- CODEX_AUDIT_RULES.md
- ARCHITECTURE.md
- AUDIT_CHECKLIST.md

## Objetivo

Realizar una auditoría técnica completa del proyecto DJPay.

La prioridad absoluta es:

1. Consistencia financiera
2. Estabilidad
3. Correcto funcionamiento
4. Producción
5. Seguridad básica

NO agregar funcionalidades nuevas.

NO hacer refactors innecesarios.

NO cambiar la arquitectura.

NO cambiar el diseño visual.

NO cambiar la lógica del negocio sin aprobación.

Aplicar siempre el menor cambio posible.

---

## Qué auditar

### Base de datos

Verificar:

- djs
- tips
- liquidaciones
- admins

Buscar:

- inconsistencias
- columnas faltantes
- constraints faltantes
- payment_id UNIQUE
- problemas financieros

---

### Mercado Pago

Verificar:

- create-preference
- notification_url
- metadata
- external_reference
- webhook
- prevención de duplicados
- cálculo de comisión
- cálculo de neto DJ

---

### Dashboard

Verificar:

- Total plataforma
- Total pendiente DJs
- Total DJs
- Contadores correctos

---

### DJs

Verificar:

- listado
- búsqueda
- filtros
- exportación CSV
- edición
- perfil DJ

---

### Pagos

Verificar:

- totales
- filtros
- exportación CSV
- consistencia financiera

---

### Liquidaciones

Verificar:

- liquidar DJ
- deshacer liquidación
- sincronización con tips.liquidado

---

### Producción

Verificar:

- diferencias localhost vs Vercel
- variables de entorno
- webhooks
- Mercado Pago producción

---

## Forma de trabajar

Para cada problema encontrado:

1. Explicar el problema.
2. Explicar el impacto.
3. Proponer la solución mínima.
4. NO aplicar cambios todavía.

Entregar primero un informe completo de auditoría.

El objetivo final es dejar DJPay estable, coherente y listo para producción.