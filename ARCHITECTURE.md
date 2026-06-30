# DJPay Architecture

## Propósito

DJPay es una plataforma de apoyo económico para DJs mediante propinas digitales.

La prioridad del proyecto es:

1. Estabilidad
2. Consistencia financiera
3. Simplicidad
4. Escalabilidad
5. Experiencia móvil

No agregar complejidad innecesaria.

---

# Stack Tecnológico

## Frontend

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS

## Backend

- Next.js API Routes

## Base de datos

- Neon PostgreSQL

## Pagos

- Mercado Pago

## Hosting

- Vercel

---

# Filosofía de Desarrollo

Principios obligatorios:

- Mobile First
- Minimalista
- Fácil de entender
- Fácil de mantener
- Una responsabilidad por pantalla
- Componentes reutilizables
- Menor complejidad posible
- Cambios mínimos y seguros

---

# Identidad Visual

## Colores

Principal:

- Blanco (#FFFFFF)

Secundario:

- Negro (#000000)

Acento:

- Violeta DJPay

---

## Componentes

Patrones visuales:

- border-black
- rounded-3xl
- shadow-lg / shadow-2xl
- max-w-7xl
- Tipografía limpia
- Hover suaves

Mantener consistencia en todo el Backoffice.

---

# Arquitectura Backoffice

## Dashboard

Ruta:

/backoffice

Responsabilidad:

- Total plataforma
- Total pendiente DJs
- Total DJs
- Accesos rápidos

No debe contener lógica compleja.

---

## DJs

Ruta:

/backoffice/djs

Componente:

components/DJsTable.tsx

Responsabilidad:

- Buscar DJs
- Filtrar DJs
- Exportar CSV
- Editar DJs

No manejar pagos directamente.

---

## Perfil DJ

Ruta:

/backoffice/djs/[dj]

Responsabilidad:

- Información personal
- Datos bancarios
- Estadísticas
- Historial del DJ

Depende completamente de la tabla tips.

---

## Pagos

Ruta:

/backoffice/pagos

Componente:

components/PagosTable.tsx

Responsabilidad:

- Historial financiero
- Buscar pagos
- Filtrar pagos
- Exportar CSV

No realizar liquidaciones directamente.

---

## Liquidaciones

Ruta:

/backoffice/liquidaciones

Responsabilidad:

- Mostrar liquidaciones realizadas
- Deshacer última liquidación
- Historial financiero

---

## Solicitudes

Ruta:

/backoffice/solicitudes

Responsabilidad:

- Aprobar nuevos DJs
- Rechazar solicitudes

---

# Base de Datos

---

## Tabla djs

Representa artistas registrados.

Campos principales:

- id
- instagram
- nombre
- activo
- rut
- banco
- tipo_cuenta
- numero_cuenta
- email
- password_hash
- tipo_liquidacion
- comision
- instagram_verificado

Comisión default:

12%

---

## Tabla tips

Representa pagos aprobados.

Campos esperados:

- id
- dj
- instagram
- comentario
- monto
- pagado
- comision
- neto_dj
- estado
- payment_id
- fecha_pago
- liquidado
- created_at

Reglas:

payment_id debe ser único.

Una propina aprobada debe reflejarse automáticamente en:

- Dashboard
- Pagos
- Perfil DJ
- Liquidaciones
- CSV

---

## Tabla liquidaciones

Representa pagos realizados a DJs.

Debe estar sincronizada con:

tips.liquidado

---

## Tabla admins

Responsable del acceso al Backoffice.

---

# Flujo Financiero

Usuario
↓

Selecciona monto

↓

create-preference

↓

Mercado Pago

↓

Webhook

/api/mp/webhook

↓

INSERT INTO tips

↓

Dashboard

↓

Pagos

↓

Perfil DJ

↓

Liquidaciones

---

# APIs Importantes

## Mercado Pago

app/api/create-preference

Responsabilidad:

Crear preferencias de pago.

Debe incluir:

- metadata
- notification_url
- external_reference

---

## Webhook

app/api/mp/webhook

Responsabilidad:

Guardar pagos aprobados.

Debe:

- Evitar duplicados
- Calcular comisión
- Calcular neto DJ
- Insertar en tips

---

## Liquidaciones

app/api/liquidar-dj

Responsabilidad:

Liquidar propinas pendientes.

---

## Deshacer Liquidación

app/api/deshacer-liquidacion

Responsabilidad:

Revertir la última liquidación.

---

# Reglas de Auditoría

Antes de modificar cualquier cosa:

Verificar:

- TypeScript
- Mercado Pago
- Dashboard
- Pagos
- DJs
- Liquidaciones
- Producción
- Consistencia financiera

La estabilidad tiene prioridad sobre nuevas funcionalidades.