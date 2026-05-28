---
tags:
  - pricing
  - estrategia
  - ab-testing
  - métricas
  - SkillsRamp
created: 2026-05-27
type: estrategia
status: borrador
---

# Estrategia de Pricing — SkillsRamp

> Documento de trabajo para definir la estructura de planes, experimentos de pricing y métricas de validación.
> Ver también: [[business-model-canvas.md]] para el contexto general del modelo de negocio.

---

## Contexto y Problema

SkillsRamp procesa **todos** los pagos de estudiantes vía MercadoPago. Hoy la plataforma no captura ningún porcentaje de ese volumen — solo cobra suscripción mensual.

El modelo a explorar combina:
- **% sobre ventas** (por encima del fee de MercadoPago, no en lugar de él)
- **Límites por tier** para forzar el upgrade orgánicamente
- **Suscripción mensual** en tiers superiores

El riesgo principal identificado: tenants con cursos de ticket bajo generan menos ingresos para la plataforma de lo que cuestan en infraestructura.

---

## Costo Mínimo de Servicio por Tenant

Antes de definir precios, hay que entender el piso de costo:

| Componente | Costo estimado/mes por tenant |
|---|---|
| Infraestructura / hosting (Railway) | $2–5 |
| Almacenamiento de video | $1–10 (según catálogo) |
| SendGrid (emails transaccionales) | $0.50–2 |
| Base de datos (PostgreSQL compartido) | $0.50–1 |
| Soporte amortizado | $5–15 |
| **Total mínimo** | **$9–33/mes** |

**Conclusión:** un tenant que genera menos de ~$15/mes en ingresos para SkillsRamp es un costo neto.

---

## Estructura de Planes Propuesta

### Lógica del modelo

- El % es **sobre el precio de venta bruto**, por encima del fee de MercadoPago (~4%)
- MercadoPago cobra al tenant por separado — no es problema de SkillsRamp
- La presión de upgrade viene de dos mecanismos distintos (ver sección A/B Testing)

### Tabla de planes

| Plan | Fee mensual | % sobre ventas | Límites |
|---|---|---|---|
| **Starter** | $0 | 5–10% | Ver hipótesis A/B abajo |
| **Active** | $79 | 2% | Sin límite de estudiantes / cursos |
| **Pro** | $149 | 0.5% | Todo desbloqueado + analytics avanzados |
| **Enterprise** | Custom | 0% | SLA, SSO/SAML, implementación dedicada |

### GMV de equilibrio por plan

Para que cada tenant sea rentable:

```
Starter (5%):  necesita mínimo $300/mes en GMV  →  ej. 6 cursos de $50
Starter (10%): necesita mínimo $150/mes en GMV  →  ej. 3 cursos de $50
Active ($79):  la suscripción ya cubre los costos base, el % es ganancia extra
```

---

## Decisiones Pendientes de Pricing

Antes de lanzar, hay que definir:

- [ ] ¿Cuál es el % exacto del plan Starter? (entre 5% y 10%)
- [ ] ¿El plan Starter tiene fee mínimo por transacción o solo límites duros?
- [ ] ¿Cuál es el ticket promedio real de los tenants actuales o potenciales?
- [ ] ¿Los planes se cobran en USD o en moneda local?
- [ ] ¿Hay período de gracia al subir de plan (ej. 14 días para evaluar)?
- [ ] ¿Los tenants existentes se grandfatherian con precios anteriores?

---

## A/B Testing — Dos Hipótesis de Upgrade

El objetivo del test es encontrar qué mecanismo convierte más Starters en planes pagos **y genera más ingresos reales** a los 90 días.

---

### Hipótesis A — Límites Duros + Fee Mensual Fijo

**Idea central:** el tenant paga un monto fijo pequeño, tiene límites claros, y cuando los explota el upgrade se vende solo. Costo predecible, sin comisiones sobre ventas.

**Configuración del Starter:**
- **Fee fijo: $12/mes** (cubre costo de infraestructura base)
- **Sin % sobre ventas** — lo que venden es 100% de ellos (menos fee de MP)
- Máx **20 estudiantes** activos
- Máx **2 cursos** publicados
- Máx **5 GB** de almacenamiento
- Sin dominio custom
- Sin analytics (solo conteo básico)

**Mecanismo de upgrade:**
Al alcanzar cualquier límite, la plataforma muestra:
> *"Llegaste al límite de tu plan. Actualizá a Active para seguir creciendo."*

**Mensaje de venta al tenant:**
> *"$12/mes, sin comisiones. Lo que vendés es tuyo."*

**Por qué puede funcionar:**
- Muy atractivo para creadores que odian los porcentajes — muchos se fueron de Hotmart exactamente por eso
- Costo predecible: el tenant sabe exactamente cuánto le cuesta la plataforma
- SkillsRamp cubre costos de infraestructura desde el día 1, aunque el tenant venda poco
- El dolor de upgrade es concreto e inmediato ("no puedo agregar más cursos")

**Ejemplo:**
```
Tenant vende $500/mes en cursos
→ Se queda con $500 completos (menos fee de MP ~4%)
→ Le paga a SkillsRamp $12/mes fijo
→ SkillsRamp cubre costos, el tenant no siente comisión
```

**Riesgo:**
- Tenants que pagan $12 pero no venden nada — aportan poco, igual consumen soporte
- Si el límite de 20 estudiantes es muy alto, algunos nunca upgradeian

---

### Hipótesis B — Sin Límites + Fee Mínimo por Transacción

**Idea central:** el tenant no paga nada hasta que vende. A medida que el volumen sube, el costo acumulado hace que el upgrade a suscripción se justifique solo económicamente.

**Configuración del Starter:**
- **Fee mensual: $0**
- **Fee por venta: 5% o $1 mínimo** (lo que sea mayor)
- Sin límite de estudiantes ni cursos
- Sin dominio custom
- Sin analytics avanzados

**Ejemplos del fee mínimo:**
```
Curso de $10  →  paga $1.00  (mínimo aplicado, 5% = $0.50 no alcanza)
Curso de $25  →  paga $1.25  (5% aplicado)
Curso de $50  →  paga $2.50  (5% aplicado)
Curso de $100 →  paga $5.00  (5% aplicado)
```

**Mecanismo de upgrade:**
Al acumular cierto volumen de fees mensuales, la plataforma muestra:
> *"Este mes pagaste $X en fees. Con el plan Active ($79/mes) te ahorrarías $Y."*

**Mensaje de venta al tenant:**
> *"Empezá gratis. Solo pagás cuando vendés."*

**Por qué puede funcionar:**
- Barrera de entrada cero — ideal para captar creadores que recién empiezan
- El upgrade es una decisión racional y calculable por el propio tenant
- Los tenants más rentables (mayor GMV) sienten más el fee y convierten mejor

**Riesgo:**
- Tenants con tickets muy bajos ($10–20) generan muy poco aunque vendan bastante
- Sin límites, un tenant inactivo consume infraestructura sin generar nada
- SkillsRamp no cobra nada hasta que el tenant vende — puede pasar meses sin ingresos por tenant

---

### La Diferencia Real entre A y B

|                          | **Hipótesis A**                   | **Hipótesis B**                |
| ------------------------ | --------------------------------- | ------------------------------ |
| **Cobro mensual**        | $12 fijo                          | $0                             |
| **Cobro por venta**      | Sin %                             | 5% o $1 mínimo                 |
| **Límites**              | Sí — estudiantes, cursos, storage | No — sin límites artificiales  |
| **Costo para el tenant** | Predecible siempre                | Variable según ventas          |
| **Presión de upgrade**   | Choca el límite físico            | Siente el % acumulado          |
| **Mensaje**              | "Sin comisiones, costo fijo"      | "Gratis hasta que vendas"      |
| **Riesgo SkillsRamp**    | Tenant inactivo igual paga $12    | Tenant inactivo no genera nada |
| **Atrae a**              | Creador que ya vende y odia los % | Creador nuevo sin ventas aún   |

---

### Punto de Upgrade en Cada Hipótesis

**En A** — el tenant sube de plan cuando choca el muro:
```
Llega a 20 estudiantes → no puede inscribir más → sube a Active ($79)
Diferencia de costo:  pasa de $12/mes a $79/mes
Ganancia:             escala sin límites, sigue sin pagar %
```

**En B** — el tenant sube cuando le conviene económicamente:
```
GMV × 5% > $79  →  a partir de $1,580/mes en ventas, Active es más barato
Ejemplo:
  $500/mes GMV  → paga $25 en fees   → todavía conviene Starter
  $1,600/mes GMV → paga $80 en fees  → Active ($79) ya es más barato
  $3,000/mes GMV → pagaría $150      → Active le ahorra $71/mes
```

---

### Diseño del Experimento

**Asignación:**
- Nuevos registros asignados aleatoriamente: 50% Grupo A / 50% Grupo B
- Tenants existentes: mantener plan actual durante el test (no alterar base instalada)

**Duración mínima:** 90 días
- Razón: el ciclo de decisión de upgrade en creadores LATAM no es inmediato
- Menos de 60 días no da señal estadística suficiente

**Tamaño mínimo de muestra:** 50 tenants por grupo para señal confiable

**Variables a controlar:**
- País de origen (Brasil tiene tickets más altos)
- Tipo de tenant (creador individual vs. institución)
- Canal de adquisición (orgánico vs. referido)

---

## Métricas del Experimento

### Métrica Principal

| Métrica | Descripción | Objetivo |
|---|---|---|
| **Ingreso total por tenant a 90 días** | Suma de fees + suscripción generada por cada tenant | Grupo ganador genera más ingreso/tenant |

### Métricas Secundarias

| Métrica | Descripción | Señal de |
|---|---|---|
| **Tasa de conversión Starter → pago** | % de Starters que upgradean en 90 días | Efectividad del mecanismo de presión |
| **Tiempo hasta primer upgrade** | Días desde registro hasta primer pago | Velocidad del funnel |
| **GMV promedio al momento del upgrade** | Cuánto estaba vendiendo cuando convirtió | ¿Upgradean por éxito o por frustración? |
| **Churn a 90 días** | % que cancela o abandona sin upgradeaer | Costo del mecanismo de presión |
| **Tenants en equilibrio** | % cuyo GMV cubre el costo de servirlos | Salud del tier gratuito |
| **NPS por grupo** | Satisfacción durante el trial | Experiencia del mecanismo |

### Métricas de Salud del Modelo (post-lanzamiento)

| Métrica | Objetivo | Frecuencia |
|---|---|---|
| GMV procesado total | Crecimiento MoM >10% | Mensual |
| Ingreso por tenant activo | >$50/mes promedio | Mensual |
| % tenants en equilibrio | >70% cubren su costo | Mensual |
| Conversión Starter → Active | >25% a 90 días | Por cohorte |
| Tiempo medio hasta upgrade | <60 días | Por cohorte |
| Churn por tier | Starter <15%, Active <5%, Pro <2% | Mensual |
| Revenue Churn | <3% mensual | Mensual |
| Net Revenue Retention | >110% | Trimestral |

---

## Análisis de Sensibilidad — Ticket Promedio

El ticket promedio del curso es la variable más sensible del modelo. Estos escenarios muestran el impacto:

### Escenario Pesimista — Ticket promedio $30

```
Tenant típico: vende 10 cursos/mes × $30 = $300 GMV
Fee 5%       → $15/mes para SkillsRamp
Costo servir → $15/mes estimado
Resultado    → Punto de equilibrio justo, sin ganancia
```

**Conclusión:** Con tickets de $30, el 5% no alcanza. Necesitaría 10% o límites muy duros que fuercen upgrades rápidos.

---

### Escenario Base — Ticket promedio $80

```
Tenant típico: vende 15 cursos/mes × $80 = $1,200 GMV
Fee 5%       → $60/mes para SkillsRamp
Costo servir → $15/mes estimado
Resultado    → $45/mes de ganancia por tenant Starter
```

**Conclusión:** El modelo funciona bien. El upgrade a Active ($79/mes) conviene al tenant cuando vende más de $1,580/mes.

---

### Escenario Optimista — Ticket promedio $150

```
Tenant típico: vende 10 cursos/mes × $150 = $1,500 GMV
Fee 5%       → $75/mes para SkillsRamp
Costo servir → $15/mes estimado
Resultado    → $60/mes de ganancia por tenant Starter
```

**Conclusión:** El modelo es muy rentable incluso en Starter. El upgrade a Active conviene al tenant cuando vende más de $1,580/mes.

---

### Punto de upgrade automático (el tenant hace el cálculo solo)

```
¿Cuándo le conviene al tenant upgradearse a Active ($79/mes)?

  GMV × 5% > $79
  GMV > $1,580/mes

  → Si vende más de ~$1,600/mes, Active es más barato que Starter
```

Este número hay que comunicarlo explícitamente en la página de pricing:
> *"Si vendés más de $1,600/mes, el plan Active te sale más barato que el Starter."*

---

## Cómo Ejecutar el A/B Test

### Paso 1 — Preparación (Semana 1–2)
- [ ] Definir el % exacto del Starter (recomendación: empezar con 8%)
- [ ] Implementar el sistema de límites (Grupo A) en la plataforma
- [ ] Implementar el fee mínimo por transacción (Grupo B)
- [ ] Configurar el tracking de métricas por grupo en el dashboard
- [ ] Definir el mensaje de upgrade para cada grupo

### Paso 2 — Lanzamiento (Semana 3)
- [ ] Activar la asignación aleatoria para nuevos registros
- [ ] Documentar la fecha de inicio del experimento
- [ ] Configurar alertas si algún grupo muestra churn anormal en las primeras 2 semanas

### Paso 3 — Revisión Intermedia (Día 45)
- [ ] Revisar métricas secundarias (no tomar decisiones aún)
- [ ] Verificar que la distribución de tenants por tipo sea equivalente entre grupos
- [ ] Ajustar solo si hay un problema crítico (ej. churn >30% en un grupo)

### Paso 4 — Lectura Final (Día 90)
- [ ] Calcular ingreso total generado por cada grupo
- [ ] Calcular tasa de conversión y tiempo hasta upgrade
- [ ] Calcular churn por grupo
- [ ] Decidir: ¿se adopta A, B, o una combinación?

### Paso 5 — Iteración
Si ningún grupo gana claramente, considerar:
- **Combinación A+B:** límites duros + fee mínimo (doble presión)
- **Ajuste del %:** probar 8% en lugar de 5%
- **Ajuste de límites:** bajar a 10 estudiantes máx en Starter

---

## Posibles Resultados y Decisiones

| Resultado | Decisión |
|---|---|
| A convierte más y genera más ingreso | Adoptar límites duros como mecanismo principal |
| B convierte menos pero tenants más rentables | Adoptar fee mínimo, aceptar menor volumen de conversiones |
| A convierte más pero con churn alto | Los límites frustran → suavizar o combinar con B |
| Ninguno supera el equilibrio de costos | Revisar el % base — probablemente hay que subir a 10% |
| Ambos funcionan igual | Combinar ambos mecanismos en el Starter definitivo |

---

## Variables Externas a Monitorear

Factores que pueden afectar el resultado del test y que hay que registrar:

- **Estacionalidad:** los meses de inicio de año tienen más lanzamientos de cursos en LATAM
- **País de origen del tenant:** Brasil tiene tickets más altos → sesgar el análisis si la distribución es desigual
- **Canal de adquisición:** un tenant orgánico (SEO) tiene comportamiento distinto a uno referido
- **Tipo de producto:** cursos vs. consultoría tienen tickets y frecuencias de venta muy diferentes
- **Cambios en el fee de MercadoPago:** un aumento de MP afecta la percepción del fee de SkillsRamp

---

## Próximos Pasos

1. **Definir el ticket promedio real** — encuestar o analizar datos de tenants actuales o leads calificados
2. **Elegir el % inicial del Starter** — recomendación: 8% como punto de partida
3. **Implementar el tracking** — sin métricas no hay experimento
4. **Definir el mensaje de pricing** — cómo comunicar el valor de cada tier en la página de precios
5. **Crear la página de pricing** — test de comunicación antes del test de producto

---

## Referencias

- [[business-model-canvas.md]] — modelo de negocio completo
- `lms-docs/FEATURE_ROADMAP.md` — features necesarios para tiers superiores (SSO, analytics avanzados)
- GitHub Project: https://github.com/orgs/lms-tenant/projects/1
