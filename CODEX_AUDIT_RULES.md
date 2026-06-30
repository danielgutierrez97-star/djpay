# DJPay - Reglas de Auditoría para Codex

## Objetivo

Realizar una auditoría técnica completa del proyecto DJPay y dejar la aplicación funcionando correctamente.

La prioridad es la estabilidad, consistencia y funcionamiento del sistema.

NO agregar nuevas funcionalidades.

NO cambiar la visión del producto.

NO hacer refactors innecesarios.

---

# Alcance permitido

Codex PUEDE:

- Corregir errores de TypeScript.
- Corregir bugs funcionales.
- Corregir problemas de Mercado Pago.
- Corregir problemas de Webhooks.
- Corregir inconsistencias entre frontend y backend.
- Corregir contadores incorrectos.
- Corregir problemas financieros.
- Corregir problemas de Neon/PostgreSQL.
- Corregir imports y rutas rotas.
- Corregir problemas de producción vs localhost.
- Eliminar código muerto confirmado.
- Mejorar validaciones y seguridad básica.

---

# Alcance NO permitido

Codex NO PUEDE:

- Crear nuevas funcionalidades.
- Crear nuevas páginas.
- Cambiar el diseño visual.
- Cambiar la identidad de DJPay.
- Hacer refactors masivos.
- Modificar la arquitectura general.
- Cambiar la lógica del negocio sin autorización.
- Cambiar la comisión por defecto.
- Eliminar funcionalidades existentes.

---

# Política de cambios

Antes de modificar cualquier archivo:

1. Explicar el problema encontrado.
2. Explicar el impacto del problema.
3. Proponer la solución mínima posible.
4. Esperar aprobación antes de aplicar cambios.

---

# Filosofía DJPay

El proyecto debe mantenerse:

- Minimalista.
- Mobile First.
- Fácil de entender.
- Fácil de mantener.
- Escalable.
- Ordenado.
- Sin sobreingeniería.
- Una responsabilidad por pantalla.

---

# Identidad visual

Principios visuales:

- Fondo blanco.
- Bordes negros.
- Violeta como color secundario.
- Componentes reutilizables.
- Diseño consistente en todo el Backoffice.

---

# Comisión

Comisión por defecto DJPay:

12%

Toda la lógica financiera debe respetar este valor, salvo configuración explícita por DJ.

---

# Prioridad máxima

La consistencia financiera es más importante que agregar nuevas funcionalidades.

Debe funcionar correctamente:

- Mercado Pago
- create-preference
- Webhooks
- Tabla tips
- Dashboard
- Pagos
- Perfil DJ
- Liquidaciones
- Exportaciones CSV

---

# Política de refactor

Si algo funciona correctamente:

NO TOCARLO.

Aplicar siempre el menor cambio posible.

No optimizar por optimizar.

No introducir complejidad innecesaria.

---

# Objetivo final

Dejar DJPay estable, coherente y listo para producción, respetando completamente la visión original del proyecto.