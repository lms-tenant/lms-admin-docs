# Diseño: Marketing Suite para Tenants — SkillsRamp

> **Estado:** Kickoff / Ideación
> **Prioridad roadmap:** P2
> **Objetivo:** Dar a los tenants herramientas reales para vender más cursos — no solo hostearlo, sino ayudarlos a crecer.

---

## El Problema

Hoy SkillsRamp es excelente para **entregar** contenido. Pero los tenants llegan con una pregunta que la plataforma no responde:

> *"¿Cómo consigo más estudiantes?"*

Un creador que no vende, cancela. No porque la plataforma sea mala — sino porque no le ayudó a crecer. La Marketing Suite convierte SkillsRamp de "donde alojas tu curso" a "donde tu negocio crece".

---

## Visión General — Qué Incluye

```
Marketing Suite
├── 1. Cupones y Descuentos
├── 2. Programa de Afiliados
├── 3. Pixel & UTM Tracking
├── 4. Calculadora de ROI Publicitario  ← diferenciador único
├── 5. Recuperación de Carrito Abandonado
├── 6. Upsell / Cross-sell Engine
├── 7. Waitlist & Pre-lanzamiento
├── 8. Flash Sales (Contador de urgencia)
└── 9. Marketing Dashboard unificado
```

---

## 1. 🎟️ Cupones y Descuentos

> **Prioridad:** P0 — ya en roadmap. Base de todo lo demás.

### Tipos de descuento

| Tipo | Ejemplo | Uso |
|---|---|---|
| Porcentaje | 20% off | Lanzamiento, Black Friday |
| Monto fijo | $10 off | Bajo precio final, impulso rápido |
| Precio especial | $49 en vez de $99 | Oferta para lista de email |
| 100% (gratis) | Free access | Influencers, prensa, testeo |

### Configuración por cupón

```
Código               [ LANZAMIENTO20 ]
Tipo de descuento    [ % / monto fijo / precio especial / gratis ]
Valor                [ _______ ]
Aplica a             [ todos los cursos / curso específico / categoría ]
Fecha de vencimiento [ ____________ ]  (opcional)
Límite de usos       [ _______ ]  (opcional — ej. "primeros 50")
Usos por persona     [ 1 / ilimitado ]
```

### Vista del tenant

- Listado de cupones activos / vencidos
- Métricas por cupón: usos, ingresos generados, descuento total otorgado
- Botón de desactivar sin borrar (preservar historial)

### Cupones en el checkout

- Campo visible en el checkout del estudiante
- Validación en tiempo real ("¡Cupón aplicado! Ahorrás $20")
- Si el cupón venció o se agotó: mensaje claro ("Este cupón ya no está disponible")

---

## 2. 🤝 Programa de Afiliados

> **Diferenciador clave:** En LATAM, el boca a boca y los afiliados mueven más que los ads. Hotmart construyó su negocio sobre esto.

### Cómo funciona

1. El tenant activa el programa de afiliados para un curso o todos sus cursos
2. Cualquier persona (incluyendo estudiantes) puede solicitar ser afiliado
3. El tenant aprueba o rechaza solicitudes
4. Cada afiliado recibe un **link único** de tracking
5. Cuando alguien compra a través del link, el afiliado acumula comisión
6. El tenant paga las comisiones manualmente (o via integración futura)

### Configuración del programa

```
Comisión             [ % del precio de venta ]  ej. 30%
Aplica a             [ todos los cursos / cursos específicos ]
Cookie duration      [ 7 / 14 / 30 días ]  (si el usuario compra después de X días)
Pago mínimo          [ $_______ ]  (umbral mínimo para cobrar)
Tipo de comisión     [ primera venta / recurrente ]
```

### Panel del afiliado (vista del afiliado)

```
┌────────────────────────────────────────────────────┐
│  Mi link: skillsramp.com/t/miacademia?ref=JUAN123  │
│  ─────────────────────────────────────────────────  │
│  Clics:          342                               │
│  Ventas:         12                                │
│  Conversión:     3.5%                              │
│  Comisión total: $180                              │
│  Pendiente:      $120                              │
└────────────────────────────────────────────────────┘
```

### Panel del tenant (gestión de afiliados)

- Lista de afiliados activos + métricas
- Historial de ventas por afiliado
- Estado de pagos (pendiente / pagado)
- Botón "Marcar como pagado" (manual por ahora)

❓ **Decisión abierta:** ¿Los estudiantes pueden convertirse automáticamente en afiliados después de completar un curso? ("Recomendá lo que ya compraste") → esto sería un flujo de referral muy natural post-completación.

---

## 3. 📡 Pixel & UTM Tracking

> Permite a los tenants conectar sus campañas de Meta / Google con sus ventas reales.

### Integraciones de Pixel

El tenant pega su ID de pixel en los ajustes. SkillsRamp lo inyecta automáticamente en sus páginas:

| Plataforma | Implementación | Eventos a trackear |
|---|---|---|
| **Meta Pixel** | ID del pixel en `<head>` | PageView, ViewContent (curso), InitiateCheckout, Purchase |
| **Google Tag Manager** | Container ID | Igual — via GTM |
| **Google Analytics 4** | Measurement ID | SessionStart, PageView, Purchase |
| **TikTok Pixel** | Pixel ID | ViewContent, AddToCart, CompletePayment |

### UTM Tracking automático

- Todos los links generados por la plataforma (cupones, afiliados, páginas de curso) incluyen UTM params automáticamente
- El tenant puede ver de dónde vienen sus ventas sin configurar nada adicional

```
Fuente de la venta:
  Google Ads → 8 ventas ($640)
  Meta Ads   → 14 ventas ($1,120)
  Instagram  → 3 ventas ($240)
  Directo    → 6 ventas ($480)
```

---

## 4. 🧮 Calculadora de ROI Publicitario

> **El diferenciador más interesante.** Ninguna plataforma LMS tiene esto built-in.

### El problema que resuelve

Los creadores LATAM gastan en Meta Ads sin saber si les conviene. Preguntas típicas:
- *"¿Cuánto tengo que gastar para llegar a X ventas?"*
- *"Si mi curso vale $80, ¿me conviene pagar $15 por lead?"*
- *"¿Cuál es mi punto de equilibrio en ads?"*

### La herramienta

Una calculadora interactiva dentro del panel del tenant:

```
┌─────────────────────────────────────────────────────┐
│  🧮 Calculadora de Rentabilidad Publicitaria        │
│  ───────────────────────────────────────────────── │
│  Precio del curso          $ [ 80 ]                │
│  Presupuesto de ads        $ [ 200 ]               │
│  Costo por lead (CPL)      $ [ 8  ]  ← de Meta/Google│
│  Tasa de conversión        [ 10 ]%  ← leads → compra│
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Leads estimados:          25                       │
│  Ventas estimadas:         2.5  (~2–3 ventas)      │
│  Ingresos estimados:       $ 200                   │
│  Costo de ads:             $ 200                   │
│  ─────────────────────────────────────────────────  │
│  💡 Resultado: En equilibrio. Necesitás una         │
│     conversión del 12.5% para ser rentable.         │
│                                                     │
│  Para ser 2x rentable:                              │
│  → Bajá el CPL a $4, o subí el precio a $160,      │
│    o mejorá la conversión al 20%.                   │
└─────────────────────────────────────────────────────┘
```

### Variables de la calculadora

| Variable | Descripción | Fuente |
|---|---|---|
| Precio del curso | Precio de venta | Auto-populated del curso |
| Presupuesto de ads | Cuánto va a gastar | Input del tenant |
| CPL (costo por lead) | Costo por lead en Meta/Google | Input del tenant |
| Tasa de conversión | % de leads que compran | Input (o calculado de datos históricos) |
| Fee de plataforma | % que se lleva SkillsRamp | Auto-populated del plan |
| Fee de MercadoPago | ~4% | Auto-populated |

### Output de la calculadora

- Ingresos brutos estimados
- Ingresos netos (después de fees)
- ROI (%)
- Punto de equilibrio (CPL máximo tolerable)
- Recomendaciones: "Para ser rentable necesitás X"

### Por qué esto es un diferenciador

- Crea engagement con el panel — el tenant vuelve a la plataforma para planificar sus campañas
- Posiciona a SkillsRamp como socio de negocio, no solo hosting
- Datos reales de conversión histórica se van pre-poblando con el tiempo
- Nadie más lo tiene en el mercado LMS LATAM

---

## 5. 🛒 Recuperación de Carrito Abandonado

> Estudiantes que llegaron al checkout y no compraron. Alta intención, fácil recuperación.

### Flujo

```
Estudiante inicia checkout → no completa → espera 1h
→ Email automático: "Te quedaste a un paso de [Nombre del curso]"
→ Si no compra → Email a las 24h: "Tu lugar todavía está disponible + cupón 10%"
→ Si compra → secuencia de bienvenida normal
```

### Configuración del tenant

```
Activar recuperación de carrito    [ toggle ]
Email de 1 hora                    [ toggle + editar asunto/cuerpo ]
Email de 24 horas                  [ toggle + editar asunto/cuerpo ]
Incluir cupón de descuento         [ toggle + seleccionar cupón ]
```

### Métricas

- Carritos abandonados por período
- Emails enviados
- Recuperaciones (compras después del email)
- Ingresos recuperados
- Tasa de recuperación (% de abandonos que terminaron comprando)

**Benchmark de referencia:** plataformas de e-commerce reportan 5–15% de recuperación con emails bien configurados.

---

## 6. ⬆️ Upsell & Cross-sell Engine

> Después de que un estudiante compra o completa un curso, sugerirle el siguiente paso.

### Tipos de upsell

| Momento | Tipo | Ejemplo |
|---|---|---|
| Post-compra | Oferta de bundle | "Compraste Diseño Básico. Agregá Diseño Avanzado por $30 más" |
| Post-completación | Próximo nivel | "¡Terminaste! El siguiente curso de la serie está disponible" |
| Durante el curso | Consultoría | "¿Querés una sesión 1:1 con el instructor? Reservá acá" |
| En el checkout | Order bump | Checkbox: "Agregá acceso a la comunidad privada por $10" |

### Configuración

El tenant define para cada curso:
```
Producto de upsell            [ seleccionar curso / consultoría / bundle ]
Timing                        [ post-compra / post-completación / al 50% del curso ]
Descuento especial de upsell  [ % off si compran ahora ]
Mensaje personalizado         [ "Ya que completaste X, te va a encantar Y..." ]
```

---

## 7. ⏳ Waitlist & Pre-lanzamiento

> Construir audiencia antes de que el curso exista. El método de Jeff Walker para LATAM.

### Cómo funciona

1. El tenant crea un curso en estado `pre-lanzamiento`
2. La landing page del curso muestra: "Próximamente — Anotate en la lista de espera"
3. Interesados dejan su email
4. El tenant puede enviar updates a la lista
5. Cuando lanza, la lista recibe acceso anticipado (o descuento de early bird)

### Configuración

```
Fecha estimada de lanzamiento   [ date picker ]
Mensaje de la waitlist          [ editable ]
Descuento early bird            [ % off para los primeros X de la lista ]
```

### Panel del tenant

- Cantidad de personas en la lista
- Tasa de crecimiento diaria
- Botón "Lanzar y notificar a la lista" (activa el curso + envía email a todos)

---

## 8. ⚡ Flash Sales & Contador de Urgencia

> La urgencia es uno de los drivers de conversión más potentes. Especialmente en LATAM.

### Tipos de campaña de urgencia

| Tipo | Descripción |
|---|---|
| **Fecha límite** | "Oferta válida hasta el domingo 23:59hs" |
| **Cupos limitados** | "Solo quedan 8 lugares" |
| **Primeros compradores** | "Precio de lanzamiento: primeros 50 estudiantes" |
| **Evento especial** | "Black Friday / Cyber Monday / Buen Fin" |

### Implementación

- El tenant configura la campaña con precio especial + fecha de fin
- En la landing page del curso aparece un **countdown timer** visible
- Al vencer, el precio vuelve al normal automáticamente
- Si es cupos limitados, el contador de lugares disponibles decrece en tiempo real

### Configuración

```
Tipo de urgencia          [ fecha límite / cupos / primeros N ]
Precio de campaña         $ [ _______ ]
Fecha/hora de fin         [ ____________ ]
Mostrar contador en       [ landing page / checkout / ambos ]
Mensaje personalizado     [ "¡Oferta de lanzamiento! Solo por 48hs" ]
```

---

## 9. 📊 Marketing Dashboard Unificado

> Todos los datos de marketing en un solo lugar para que el tenant entienda qué funciona.

### Métricas del dashboard

```
┌─────────────────────────────────────────────────────┐
│  RESUMEN DEL MES                                    │
│  ─────────────────────────────────────────────────  │
│  Visitas a páginas de cursos    1,240               │
│  Checkouts iniciados              89  (7.2%)        │
│  Compras completadas              34  (38.2%)       │
│  Ingresos totales             $2,720                │
│  ─────────────────────────────────────────────────  │
│  FUENTES DE TRÁFICO                                 │
│  Meta Ads     42%  ████████████░░░░░░░░             │
│  Orgánico     28%  ████████░░░░░░░░░░░░             │
│  Afiliados    18%  █████░░░░░░░░░░░░░░░             │
│  Directo      12%  ████░░░░░░░░░░░░░░░░             │
│  ─────────────────────────────────────────────────  │
│  CAMPAÑAS ACTIVAS                                   │
│  Cupón VERANO20   →  12 usos  →  $480 generados    │
│  Flash Sale       →  vence en 2 días               │
│  ─────────────────────────────────────────────────  │
│  CARRITOS ABANDONADOS                               │
│  Esta semana: 23 abandonos → 3 recuperados (13%)   │
└─────────────────────────────────────────────────────┘
```

---

## Fases de Implementación

### Fase 1 — Base (MVP de Marketing)
- [ ] Cupones y descuentos (P0 — ya en roadmap)
- [ ] UTM tracking básico (de dónde vienen las ventas)
- [ ] Pixel de Meta integrado (ID en ajustes → inyectado automáticamente)

### Fase 2 — Conversión
- [ ] Recuperación de carrito abandonado
- [ ] Flash sales con countdown timer
- [ ] Calculadora de ROI publicitario
- [ ] Marketing Dashboard básico

### Fase 3 — Crecimiento
- [ ] Programa de afiliados completo
- [ ] Upsell & cross-sell engine
- [ ] Waitlist & pre-lanzamiento
- [ ] Marketing Dashboard avanzado (fuentes, atribución)

---

## Impacto Esperado por Feature

| Feature | Impacto para el tenant | Impacto para SkillsRamp |
|---|---|---|
| Cupones | +15–30% conversión en lanzamientos | Mayor GMV → más fee de plataforma |
| Afiliados | Canal de distribución propio | Viralidad → más tenants referidos |
| Pixel tracking | Ads más eficientes, menor CPL | Retención (ven ROI claro) |
| Calculadora ROI | Decisiones de ad spend más inteligentes | Engagement con el panel, diferenciación |
| Carrito abandonado | 5–15% recuperación de ventas perdidas | Mayor GMV |
| Flash sales | Picos de venta predecibles | Mayor GMV en eventos |
| Upsell engine | +20–40% revenue por estudiante | Mayor GMV |
| Waitlist | Lanzamientos con audiencia validada | Menor churn (tenants que venden no se van) |

---

## Decisiones Abiertas

| # | Pregunta | Opciones | Recomendación |
|---|---|---|---|
| 1 | ¿Los estudiantes pueden ser afiliados automáticamente? | Sí auto / Solo por invitación | Opt-in manual para MVP |
| 2 | ¿La calculadora de ROI usa datos históricos reales del tenant? | Sí / Solo inputs manuales | Manual primero, histórico en V2 |
| 3 | ¿El carrito abandonado requiere que el estudiante tenga cuenta? | Solo con cuenta / Capturar email antes | Requiere cuenta para MVP |
| 4 | ¿El programa de afiliados incluye pago automatizado? | Manual / Via PayPal/MP | Manual para MVP |
| 5 | ¿Flash sales con cupos limitados en tiempo real? | Sí (Socket.IO) / Aproximado | Aproximado para MVP |
| 6 | ¿La Marketing Suite está disponible en todos los planes? | Todos / Solo Active/Pro | Solo Active y Pro — palanca de upgrade |

---

## Por Qué Esto Cambia el Negocio de SkillsRamp

La mayoría de las plataformas LMS te dan herramientas para **crear y entregar** cursos. Pocos te ayudan a **venderlos**.

Si un tenant lanza un curso y no vende → cancela. No importa qué tan buena sea la plataforma.

La Marketing Suite convierte a SkillsRamp en el lugar donde el negocio del creador **crece** — no solo donde vive su contenido. Eso cambia la propuesta de valor de "hosting con pagos" a "plataforma de crecimiento para creadores".

**El creador que vende con SkillsRamp no se va.**

---

## Referencias

- [[business-model-canvas.md]] — Propuesta de valor y segmentos de clientes
- [[pricing-strategy.md]] — El GMV fee hace más valioso el crecimiento del tenant
- [[spec-plan-billing-features.md]] — Feature flags para gatear Marketing Suite por plan
