---
tags: [finanzas, proyecciones, revenue, pricing]
created: 2026-05-31
type: análisis
---

# Proyecciones de Revenue y Márgenes — SkillsRamp

> Basado en: [[business-model-canvas.md]] · [[pricing-strategy.md]]
> Modelos de pricing analizados: **Modelo A** (fee fijo Starter) vs **Modelo B** (comisión Starter)

---

## Supuestos Base

### Planes y tarifas

| Plan | Modelo A | Modelo B |
|---|---|---|
| **Starter** | $12/mes fijo + 0% comisión | $0/mes + 8% comisión |
| **Active** | $79/mes + 2% comisión | $79/mes + 2% comisión |
| **Pro** | $149/mes + 0.5% comisión | $149/mes + 0.5% comisión |
| **Enterprise** | $500/mes + 0% | $500/mes + 0% |

> La comisión es **sobre el precio de venta bruto**, por encima del fee de MercadoPago (~4%) que paga el tenant por separado.

---

### GMV promedio por tenant por mes

| Plan | GMV estimado/mes | Base: ventas × ticket |
|---|---|---|
| Starter | $600 | ~10 ventas × $60 ticket promedio |
| Active | $3,500 | ~35 ventas × $100 ticket promedio |
| Pro | $8,000 | ~80 ventas × $100 ticket promedio |
| Enterprise | $25,000 | estimado institucional |

---

### Costo de infraestructura variable por tenant

| Componente | Costo estimado/tenant/mes |
|---|---|
| Hosting / Railway | $2–5 |
| Video storage + CDN | $2–8 |
| SendGrid (emails) | $0.50–2 |
| Claude API | $0.50–1 |
| **Total variable** | **$5–16/tenant/mes** |

---

## Escenarios de Escala

### 🟡 Escenario 1 — Early Stage (Año 1, primeros clientes)

**Mix de tenants:**

| Plan | Cantidad |
|---|---|
| Starter | 20 |
| Active | 5 |
| Pro | 1 |
| Enterprise | 0 |
| **Total** | **26 tenants** |

#### Revenue mensual

| Fuente | Modelo A | Modelo B |
|---|---|---|
| Suscripciones | 20×$12 + 5×$79 + 1×$149 = **$784** | 0 + 5×$79 + 1×$149 = **$544** |
| Comisiones | 0 + 5×($3,500×2%) + 1×($8,000×0.5%) = **$390** | 20×($600×8%) + 5×($3,500×2%) + 1×($8,000×0.5%) = **$1,310** |
| **Total revenue** | **$1,174/mes** | **$1,854/mes** |
| **ARR** | **$14,088** | **$22,248** |

#### Costos operativos estimados (Early Stage)

| Categoría | Mensual |
|---|---|
| Engineering (1–2 devs, LATAM) | $4,500 |
| Cloud + Video + APIs | $350 |
| Soporte (founder) | $500 |
| Marketing | $500 |
| **Total OpEx** | **$5,850/mes** |

#### Resultado

| | Modelo A | Modelo B |
|---|---|---|
| Revenue | $1,174 | $1,854 |
| OpEx | $5,850 | $5,850 |
| **Resultado neto** | **-$4,676/mes** | **-$3,996/mes** |
| **Burn rate anual** | **-$56,112** | **-$47,952** |

> 📌 En Early Stage ambos modelos pierden plata — es normal. El negocio es pre-product-market fit. El Modelo B quema $700/mes menos gracias a comisiones de Starters.

---

### 🟠 Escenario 2 — Growth Stage (Año 1–2, tracción validada)

**Mix de tenants:**

| Plan | Cantidad |
|---|---|
| Starter | 80 |
| Active | 25 |
| Pro | 8 |
| Enterprise | 1 |
| **Total** | **114 tenants** |

#### Revenue mensual

| Fuente | Modelo A | Modelo B |
|---|---|---|
| Suscripciones | 80×$12 + 25×$79 + 8×$149 + 1×$500 = **$5,127** | 0 + 25×$79 + 8×$149 + 1×$500 = **$3,667** |
| Comisiones | 0 + 25×($3,500×2%) + 8×($8,000×0.5%) + 0 = **$2,070** | 80×($600×8%) + 25×($3,500×2%) + 8×($8,000×0.5%) + 0 = **$5,910** |
| **Total revenue** | **$7,197/mes** | **$9,577/mes** |
| **ARR** | **$86,364** | **$114,924** |

#### Costos operativos estimados (Growth Stage)

| Categoría | Mensual |
|---|---|
| Engineering (2–3 devs) | $8,000 |
| Cloud + Video + APIs | $900 |
| Soporte / CS (part-time) | $1,500 |
| Marketing | $1,500 |
| **Total OpEx** | **$11,900/mes** |

#### Resultado

| | Modelo A | Modelo B |
|---|---|---|
| Revenue | $7,197 | $9,577 |
| OpEx | $11,900 | $11,900 |
| **Resultado neto** | **-$4,703/mes** | **-$2,323/mes** |
| **Punto de equilibrio** | Necesita +65 Actives más | Necesita +25 Actives más |

> 📌 Todavía negativo, pero Modelo B está significativamente más cerca del breakeven. La diferencia de $2,380/mes viene de las comisiones sobre los 80 Starters.

---

### 🟢 Escenario 3 — Scale Stage (Año 2–3, negocio establecido)

**Mix de tenants:**

| Plan | Cantidad |
|---|---|
| Starter | 200 |
| Active | 80 |
| Pro | 25 |
| Enterprise | 5 |
| **Total** | **310 tenants** |

#### Revenue mensual

| Fuente | Modelo A | Modelo B |
|---|---|---|
| Suscripciones | 200×$12 + 80×$79 + 25×$149 + 5×$500 = **$16,645** | 0 + 80×$79 + 25×$149 + 5×$500 = **$12,145** |
| Comisiones | 0 + 80×($3,500×2%) + 25×($8,000×0.5%) + 0 = **$6,600** | 200×($600×8%) + 80×($3,500×2%) + 25×($8,000×0.5%) + 0 = **$16,200** |
| **Total revenue** | **$23,245/mes** | **$28,345/mes** |
| **ARR** | **$278,940** | **$340,140** |

#### Costos operativos estimados (Scale Stage)

| Categoría | Mensual |
|---|---|
| Engineering (3–4 devs) | $12,000 |
| Cloud + Video + APIs | $2,500 |
| Soporte / CS | $3,000 |
| Marketing | $3,000 |
| **Total OpEx** | **$20,500/mes** |

#### Resultado

| | Modelo A | Modelo B |
|---|---|---|
| Revenue | $23,245 | $28,345 |
| OpEx | $20,500 | $20,500 |
| **Resultado neto** | **+$2,745/mes** | **+$7,845/mes** |
| **Margen neto** | **11.8%** | **27.7%** |
| **ARR neto** | **$32,940** | **$94,140** |

> 📌 Ambos modelos son rentables en Scale Stage, pero Modelo B genera 2.8x más ganancia neta. El 27.7% de margen neto es sólido para un SaaS en etapa de crecimiento.

---

## Análisis de Punto de Equilibrio

¿Cuántos tenants necesita cada modelo para cubrir los costos?

### Con estructura de costos de Growth Stage (~$11,900/mes)

**Modelo A:**
```
Revenue mínimo necesario: $11,900/mes
Si solo hay Actives ($79 + 2% comisión sobre $3,500 GMV promedio):
  $79 + $70 = $149/Active/mes
  Tenants necesarios: $11,900 / $149 = ~80 Active tenants para breakeven
```

**Modelo B:**
```
Starter genera: $600 × 8% = $48/mes
Active genera: $79 + $70 = $149/mes
Con mix 70%/30% Starter/Active:
  Breakeven con: ~90 Starters + 40 Actives = 130 tenants totales
```

**Con estructura de costos de Scale Stage (~$20,500/mes):**
- Modelo A: necesita ~90 Active + apoyo de Pros y Starters
- Modelo B: necesita ~70 Active + 200 Starters activos

---

## Sensibilidad al Ticket Promedio del Curso

> Este es el factor de mayor incertidumbre. El ticket promedio cambia todo para el Modelo B.

### En Growth Stage (80 Starters) — Modelo B

| Ticket promedio | GMV/Starter/mes | Comisión Starters (8%) | Revenue total | Resultado neto |
|---|---|---|---|---|
| $30 (pesimista) | $300 | $24 × 80 = **$1,920** | $7,587 | **-$4,313** |
| $60 (base conservadora) | $600 | $48 × 80 = **$3,840** | $9,507 | **-$2,393** |
| $100 (base optimista) | $1,000 | $80 × 80 = **$6,400** | $12,067 | **+$167** |
| $150 (premium) | $1,200 | $96 × 80 = **$7,680** | $13,347 | **+$1,447** |

> ⚠️ El Modelo B es muy sensible al ticket. Con ticket de $30 casi no mueve la aguja. Con $100+ es el modelo claramente ganador.

### Conclusión sobre ticket promedio

El ticket de $30 hace que el Modelo B pierda su ventaja. El negocio con Modelo B solo funciona bien si los tenants venden cursos de $80+. Esto sugiere que:
- **Starter $12/mes (Modelo A)** es más predecible si no tenés datos del ticket promedio
- **Starter 8% (Modelo B)** tiene más upside si podés asegurar que los tenants apuntan a tickets altos

---

## Gross Margin (Margen Bruto)

El margen bruto excluye los costos de ventas + marketing y solo mide cuánto queda después de los costos variables de entregar el servicio.

### Costo variable por tenant/mes: $10 promedio

| Escenario | Tenants | Costos variables | Revenue | **Gross Margin** |
|---|---|---|---|---|
| Early (M. A) | 26 | $260 | $1,174 | **77.8%** |
| Early (M. B) | 26 | $260 | $1,854 | **86.0%** |
| Growth (M. A) | 114 | $1,140 | $7,197 | **84.2%** |
| Growth (M. B) | 114 | $1,140 | $9,577 | **88.1%** |
| Scale (M. A) | 310 | $3,100 | $23,245 | **86.7%** |
| Scale (M. B) | 310 | $3,100 | $28,345 | **89.1%** |

> ✅ El margen bruto es excelente en todos los escenarios (~80–90%). Está bien por encima del benchmark SaaS (70%). El problema no es el margen bruto — es que los costos fijos (engineering) son altos en etapas tempranas.

---

## GMV Fee — Oportunidad No Capturada

Como mencionamos en el BMC, SkillsRamp podría cobrar un fee sobre **todo el GMV procesado** (incluyendo los planes Active y Pro actualmente sin comisión sobre parte del revenue).

### Si se agrega 1% de fee sobre GMV de Active y Pro en Scale Stage:

```
Active GMV: 80 tenants × $3,500 = $280,000/mes × 1% = $2,800
Pro GMV: 25 tenants × $8,000 = $200,000/mes × 1% = $2,000
Enterprise GMV: 5 × $25,000 = $125,000/mes × 0% = $0

Revenue adicional: $4,800/mes = $57,600/año
```

**Modelo B + GMV fee:**
- Revenue: $28,345 + $4,800 = **$33,145/mes**
- ARR: **$397,740**
- Margen neto: **+$12,645/mes (38.1%)**

---

## Resumen Ejecutivo

| Métrica | Early Stage | Growth Stage | Scale Stage |
|---|---|---|---|
| Tenants totales | 26 | 114 | 310 |
| ARR (Modelo A) | $14,088 | $86,364 | $278,940 |
| ARR (Modelo B) | $22,248 | $114,924 | $340,140 |
| Margen neto (A) | -338% | -40% | **+11.8%** |
| Margen neto (B) | -216% | -20% | **+27.7%** |
| Breakeven (meses) | — | ~18 meses | — |

---

## Decisiones que Cambian el Modelo

| Decisión | Impacto en Revenue |
|---|---|
| Ticket promedio < $50 | Modelo B pierde ventaja, Modelo A más predecible |
| Ticket promedio > $100 | Modelo B genera 2–3x más revenue que A |
| Agregar GMV fee 1% en Active/Pro | +$57,600 ARR en Scale Stage |
| Convertir 20% más de Starters a Active | +$18,960 ARR en Growth Stage |
| Lograr 50 tenants Enterprise | +$300,000 ARR adicional |
| NRR > 110% (expansión > churn) | Compounding de revenue sin nuevo CAC |

---

## Referencias

- [[pricing-strategy.md]] — hipótesis A/B y estructura de planes
- [[business-model-canvas.md]] — segmentos, LTV/CAC, fuentes de ingresos
- [[spec-plan-billing-features.md]] — implementación técnica del billing
