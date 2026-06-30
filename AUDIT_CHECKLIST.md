# DJPay Audit Checklist v1

## Objetivo

Verificar que DJPay funcione correctamente antes de agregar nuevas funcionalidades.

La prioridad es:

1. Consistencia financiera
2. Estabilidad
3. Producción
4. Experiencia de usuario

---

# 1. Base de Datos

## Tabla djs

- [ ] Estructura correcta
- [ ] No existen instagram duplicados
- [ ] Comisión por defecto correcta
- [ ] DJs activos funcionan correctamente
- [ ] Verificación Instagram funciona

---

## Tabla tips

- [ ] payment_id es único
- [ ] monto se guarda correctamente
- [ ] comisión se calcula correctamente
- [ ] neto_dj se calcula correctamente
- [ ] pagado funciona correctamente
- [ ] liquidado funciona correctamente
- [ ] estado funciona correctamente
- [ ] fecha_pago se guarda correctamente

---

## Tabla liquidaciones

- [ ] Relaciones correctas con tips
- [ ] Deshacer liquidación funciona
- [ ] No existen inconsistencias financieras

---

## Tabla admins

- [ ] Login funciona
- [ ] Logout funciona
- [ ] Acceso protegido correctamente

---

# 2. Mercado Pago

## create-preference

- [ ] notification_url configurada
- [ ] metadata correcta
- [ ] external_reference correcta
- [ ] URLs de retorno correctas

---

## Webhook

Ruta:

app/api/mp/webhook

Verificar:

- [ ] Se ejecuta correctamente
- [ ] Evita duplicados
- [ ] Guarda tips correctamente
- [ ] Calcula comisión correctamente
- [ ] Calcula neto_dj correctamente
- [ ] Maneja errores correctamente

---

# 3. Dashboard

Ruta:

/backoffice

Verificar:

- [ ] Total plataforma correcto
- [ ] Total pendiente DJs correcto
- [ ] Total DJs correcto
- [ ] Contadores consistentes con la base de datos

---

# 4. DJs

Ruta:

/backoffice/djs

Verificar:

- [ ] Lista DJs correcta
- [ ] Buscador funciona
- [ ] Filtros funcionan
- [ ] Exportación CSV funciona
- [ ] Editar DJ funciona

---

# 5. Perfil DJ

Ruta:

/backoffice/djs/[dj]

Verificar:

- [ ] Total recibido correcto
- [ ] Pendiente correcto
- [ ] Número de propinas correcto
- [ ] Datos personales correctos
- [ ] Datos bancarios correctos

---

# 6. Pagos

Ruta:

/backoffice/pagos

Verificar:

- [ ] Total bruto correcto
- [ ] Total comisiones correcto
- [ ] Total neto DJs correcto
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Exportación CSV funciona
- [ ] Selección múltiple funciona

---

# 7. Liquidaciones

Ruta:

/backoffice/liquidaciones

Verificar:

- [ ] Liquidar DJ funciona
- [ ] Deshacer liquidación funciona
- [ ] Historial correcto
- [ ] Estados financieros consistentes

---

# 8. Solicitudes

Ruta:

/backoffice/solicitudes

Verificar:

- [ ] Aprobar DJ funciona
- [ ] Rechazar DJ funciona
- [ ] Estados actualizados correctamente

---

# 9. Producción

Verificar:

- [ ] Localhost consistente con Vercel
- [ ] Variables .env configuradas
- [ ] Mercado Pago producción correcto
- [ ] Webhooks funcionando en producción
- [ ] Base de datos correcta

---

# 10. QA Manual Obligatorio

Antes de considerar DJPay estable:

## Registro

- [ ] Registrar DJ
- [ ] Aprobar DJ
- [ ] Iniciar sesión DJ

---

## Pagos

- [ ] Hacer pago real
- [ ] Verificar INSERT en tips
- [ ] Verificar Dashboard
- [ ] Verificar Pagos
- [ ] Verificar Perfil DJ

---

## Liquidaciones

- [ ] Liquidar DJ
- [ ] Verificar tips.liquidado
- [ ] Deshacer liquidación
- [ ] Verificar reversión

---

## Exportaciones

- [ ] CSV DJs
- [ ] CSV Pagos

---

# Criterio de aprobación

DJPay solo puede considerarse listo para producción cuando:

- Todas las casillas estén verificadas.
- No existan errores TypeScript.
- La consistencia financiera esté garantizada.
- Mercado Pago funcione extremo a extremo.
- Dashboard, Pagos, DJs y Liquidaciones muestren la misma información.

No agregar nuevas funcionalidades hasta completar esta auditoría.