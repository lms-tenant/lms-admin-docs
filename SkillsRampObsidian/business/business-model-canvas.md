---
tags:
  - negocio
  - estrategia
  - BMC
  - SkillsRamp
created: 2026-05-27
type: estrategia
status: borrador
---

# Business Model Canvas — SkillsRamp

> Plataforma SaaS de LMS white-label y multi-tenant para la economía creadora de LATAM.
> Ver también: [[business-model-canvas.canvas]] para el diseño visual.

---

## Qué es este documento

Este es el documento de fundación estratégica de SkillsRamp. Mapea cómo el negocio crea, entrega y captura valor. Cada bloque está escrito con suficiente profundidad para guiar decisiones de producto, pricing y GTM — no es solo un resumen de caja.

---

## El negocio en una oración

SkillsRamp permite que educadores, coaches e instituciones lancen una escuela online completamente branded en horas — con pagos nativos para LATAM, reservas de consultoría y construcción visual de páginas — sin escribir una sola línea de código.

---

## 🗺️ Canvas de un vistazo

| Izquierda (Crear Valor)  | Centro                  | Derecha (Entregar Valor) |
| ------------------------ | ----------------------- | ------------------------ |
| Socios Clave             | **Propuestas de Valor** | Relaciones con Clientes  |
| Actividades Clave        |                         | Canales                  |
| Recursos Clave           |                         | Segmentos de Clientes    |
| **Estructura de Costos** |                         | **Fuentes de Ingresos**  |

---

## 1. 🤝 Socios Clave

> De quiénes dependemos para operar y escalar. Las alianzas reducen costos, agregan capacidades o desbloquean distribución.

### Infraestructura de Pagos — El Diferenciador #1

| Socio                               | Rol                                                               | Peso Estratégico                                 |
| ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------ |
| **MercadoPago**                     | Checkout nativo LATAM: PIX, OXXO, PSE, cuotas, pagos fraccionados | **Crítico** — sin sustituto en LATAM             |
| **Otra paserela de pago a definir** | Fallback  menor costes                                            | Importante — habilita compradores fuera de LATAM |

**Por qué importa:** Teachable, Thinkific y Kajabi no ofrecen MercadoPago de forma nativa. Los creadores de LATAM necesitan cuotas para cursos de alto ticket — sin esto, las tasas de conversión se desploman. Esta integración es una barrera de entrada genuina.

**Riesgo:** Deprecación de la API v2 de MercadoPago o cambio de precios. Mitigación: abstraer la capa de pagos para poder cambiar de procesador sin tocar la UI del checkout.

**TODO:** 
- Buscar alternativas a mercadopago que ofrezcan soluciones simialres a menor coste

---

### Infraestructura Tecnológica

| Socio                                      | Rol                                                                                        | Nivel de Riesgo                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Railway**                                | Hosting en producción para agent-api, potencialmente stack completo                        | Medio — sin garantía de SLA en planes gratuitos/starter          |
| **SendGrid**                               | Email transaccional: verificación, certificados, notificaciones, confirmaciones de reserva | Alto — la entregabilidad afecta la activación                    |
| **Google OAuth**                           | Login social para estudiantes y admins                                                     | Bajo — Google Auth es estable                                    |
| **Video CDN** (S3 / Cloudflare R2 / Vimeo) | Almacenamiento, transcodificación y streaming de videos de cursos                          | Alto — el costo y la calidad afectan directamente la experiencia |

**Criticidad de SendGrid:** Cada acción clave del usuario (verificación de email, reseteo de contraseña, recibo de compra, entrega de certificado, confirmación de consultoría) activa una llamada a SendGrid. Tasas de entregabilidad por debajo del 95% afectan directamente la activación y la confianza. Monitorear la reputación del remitente como métrica de salud central.

**TODO:** 
- Buscar una alternativa a sendgrid, quizás https://resend.com/

---

### IA y Automatización

| Socio | Rol |
|---|---|
| **Anthropic (Claude API)** | Impulsa la plataforma de automatización de agentes — pipeline SDD (explorar → spec → diseño → implementar → verificar) |

**Valor estratégico:** La plataforma de agentes no es solo una herramienta de desarrollo — es una ventaja competitiva. Los competidores que construyen LMS a mano tardan semanas en lanzar features. El desarrollo impulsado por agentes lo hace en días. A medida que los modelos de IA mejoran, esta brecha se amplía.

Todo:
- Debido a los costos altos de claude lo mejor sería utilizar un modelo chino, podría ser qwen

---

### Oportunidades de Alianza (Aún No Activadas)

- **Agencias de diseño web** en LATAM → socios referidores (construyen las escuelas de sus clientes en SkillsRamp) 
	- -> habría que ver la estrategia especifica para esto
- **Plataformas de economía creadora** (ej. afiliados de Kiwify, creadores de Hotmart buscando alternativa white-label)
	- -> la idea sería venderser como white-label también
- **Software de RRHH corporativo** (BambooHR, Factorial) → socios de integración para equipos de L&D
	- Descartar, o ver más a futuro
- **Organismos de certificación** en LATAM → programas de certificados co-branded
	- -> quizás ofrecer la plataforma a instituciones que actualmente esten trabajando en otras organizaciones

---

## 2. ⚙️ Actividades Clave

> Qué debemos hacer excepcionalmente bien para entregar la propuesta de valor.

### Desarrollo de Producto

El ciclo central: lanzar features → tenants se activan → estudiantes se inscriben → ingresos crecen → reinvertir en features.

**Prioridades actuales del backlog** (ordenadas por impacto de negocio):

| Feature                                        | Impacto de Negocio                                                     | Esfuerzo | Prioridad |
| ---------------------------------------------- | ---------------------------------------------------------------------- | -------- | --------- |
| Sistema de cupones / descuentos                | Aumento directo de ingresos para tenants                               | Medio    | **P0**    |
| Analytics avanzados + exportaciones            | Retención de tenants (necesitan reportes)                              | Alto     | **P0**    |
| Gamificación (badges, XP, rachas)              | Engagement de estudiantes → retención de tenants                       | Alto     | **P1**    |
| Búsqueda full-text                             | Descubrimiento de cursos → conversión de inscripción                   | Medio    | **P1**    |
| PWA + notificaciones push                      | Retención móvil, mercado LATAM mobile-first                            | Alto     | **P1**    |
| Facturación por suscripción (para estudiantes) | Nuevo modelo de monetización para tenants                              | Medio    | **P2**    |
| Recomendaciones de IA                          | Upsell dentro del catálogo del tenant                                  | Medio    | **P2**    |
| SSO / SAML                                     | Desbloqueo del segmento enterprise                                     | Alto     | **P2**    |
| Marketing                                      | Poder facilitar venta de productos, tener idea de costos de publicidad | Alto     | **P2**    |

**TODO:**
- Continuar con las implementaciones de las features criticas para poder lanzar el MVP

---

### Onboarding de Tenants

El journey de activación es la palanca más importante para la conversión Trial → Active.

**Estado actual:** Manual / guiado por documentación.
**Estado objetivo:** Onboarding guiado dentro de la app con checklist de progreso.

Hitos de activación a trackear:
1. ✅ Dominio configurado (path-based o custom)
2. ✅ Branding aplicado (logo, colores)
3. ✅ Primer curso publicado
4. ✅ Cuenta de pago conectada (MercadoPago OAuth)
5. ✅ Primer estudiante inscrito

Un tenant que completa los 5 pasos en 7 días tiene una retención a 90 días dramáticamente mayor.

TODO:
- Generar plan con documento especificando como va a ser el onboarding de tenants (pasar idea inicial + claude design para las vistas + validación con 1 o 2 tests para refinar)

---

### Operaciones de Entrega de Contenido

- Pipeline de transcodificación de video (subida → transcodificación → CDN → streaming)
- Generación de certificados PDF bajo demanda (por curso, por estudiante)
- Entrega de notificaciones en tiempo real (Socket.IO + fallback por email)
- Flujo de confirmación de reserva de consultoría (email + invitación de calendario)

**Driver de costo:** El almacenamiento y el ancho de banda de video crecen linealmente con el tamaño del catálogo. Se deben aplicar límites de almacenamiento por tenant para proteger los márgenes.

TODO:
- Vamos a tener que ver que tan complej sería hacer este pipeline, vs implementar  un servicio externo como bunny

---

### Desarrollo Impulsado por Agentes (Diferenciador Interno)

El pipeline SDD es un multiplicador de fuerza:
```
task-reader → sdd-explore → sdd-propose → sdd-spec → sdd-design
           → sdd-tasks → sdd-apply → sdd-verify → sdd-archive → PR
```

Documentado en `CLAUDE.md` y ejecutado vía agent-api + agent-dashboard. A escala, esto significa que 1 ingeniero puede hacer el trabajo de 3.

---

### Éxito del Cliente

- **Conversión Trial → Active:** Nudges en la app, drip de email, outreach de CSM al 60% del límite del trial
- **Active → Retenido:** Revisión mensual de salud (frecuencia de login, cantidad de estudiantes, ingresos procesados)
- **Señales de churn:** 0 estudiantes nuevos en 30 días, pico en volumen de tickets de soporte, fallos de pago

TODO:
- Crear estrategia de marketing para lanzar el producto

---

## 3. 🏗️ Recursos Clave

> Activos que poseemos o controlamos que son esenciales para entregar valor.

### Propiedad Intelectual (Core)

| Recurso                                 | Descripción                                                                    | Defensibilidad                       |
| --------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------ |
| Codebase SaaS multi-tenant              | 5 repos, 43 dominios de controladores, LMS completo + e-commerce + consultoría | Alta — años de trabajo               |
| Integración de checkout MercadoPago     | Flujos de pago específicos de LATAM, cuotas, MP Connect OAuth                  | Alta — no trivial de construir       |
| Plataforma de automatización de agentes | Pipeline SDD, agent-api, orquestación de tareas                                | Alta — flujo propietario             |
| Arquitectura white-label                | Multi-tenancy a nivel de fila, routing de dominio custom, portales branded     | Media — replicable pero lleva tiempo |

---

### Infraestructura Técnica

| Recurso                   | Estado Actual                              | Techo de Escala                                    |
| ------------------------- | ------------------------------------------ | -------------------------------------------------- |
| PostgreSQL (multi-tenant) | Aislamiento a nivel de fila via `tenantId` | ~500 tenants con el esquema actual                 |
| Backend Express/TypeORM   | 43 dominios de controladores               | Bueno — modular, extensible                        |
| Frontend Next.js          | Pages Router (14.2)                        | Considerar migración a App Router para performance |
| Despliegue Railway        | agent-api en producción                    | Necesita upgrade de SLA para enterprise            |

---

### Capital Humano

- **Equipo de ingeniería** — actualmente el recurso más limitado
- **Conocimiento de dominio** — producto LMS, pagos LATAM, multi-tenancy, dinámica de la economía creadora
- **Expertise en agentes de IA** — el conocimiento del pipeline SDD es una capacidad poco común

---

### Activos de Datos

Los datos se componen con el tiempo y se convierten en un activo estratégico:

| Dato                                | Valor Actual             | Valor Futuro              |
| ----------------------------------- | ------------------------ | ------------------------- |
| Configuración de tenants            | Plantillas de onboarding | Benchmarks por industria  |
| Patrones de progreso de estudiantes | Señales de engagement    | Recomendaciones de IA     |
| Historial de transacciones          | Inteligencia de pricing  | Forecasting de ingresos   |
| Tasas de completación de cursos     | Señal de calidad         | Alianzas de certificación |
| Patrones de reservas de consultoría | Señal de demanda         | Optimización de agenda    |

---

### Conjunto Mínimo Viable de Recursos

A la escala actual, la plataforma puede funcionar con:
- 1 ingeniero full-stack (modo mantenimiento)
- Railway + PostgreSQL (~$100–300/mes)
- SendGrid Essentials (~$20/mes)
- Cloudflare R2 para video (pago por uso)

Este piso bajo es una ventaja — significa que el negocio puede sobrevivir períodos lean y crecer de forma sostenible.

---

## 4. 💡 Propuestas de Valor

> Las razones específicas por las que los clientes eligen SkillsRamp sobre las alternativas.

### Para Tenants (Clientes que Pagan)

#### 🚀 Velocidad al Mercado
**Job to be done:** "Quiero vender mi conocimiento online pero no tengo 6 meses ni $50K para desarrollo custom."

SkillsRamp colapsa el timeline de idea a primera venta a menos de una semana:
- Registrarse → configurar branding → publicar curso → conectar pagos → compartir enlace
- Sin equipo de dev. Sin decisiones de hosting. Sin trabajo de integración de pagos.

**Comparación:** Hotmart, udemy y otros requieren listar en su marketplace (pérdida de marca). Construir custom tarda meses. SkillsRamp es la alternativa white-label del medio.

---

#### 💳 Pagos Nativos LATAM (Mayor Diferenciador Funcional)
**Job to be done:** "Mis estudiantes están en Argentina, México y Brasil. Necesito que paguen en moneda local con cuotas."

Lo que SkillsRamp entrega que los competidores globales no:
- MercadoPago: cuotas, métodos de pago locales (PIX, OXXO, PSE, Rapipago)
- Sin fricción de conversión de moneda para los estudiantes
- MP Connect OAuth: los tenants conectan su propia cuenta de MP → SkillsRamp nunca toca el dinero directamente

**Impacto en conversión:** Los cursos de alto ticket ($200+) en LATAM requieren cuotas. Sin ellas, el abandono del checkout sube a más del 70%.

---

#### 🏷️ Propiedad White-Label Real
**Job to be done:** "Quiero que mis estudiantes sepan que están aprendiendo de MÍ, no de alguna plataforma."

Lo que esto significa en la práctica:
- Dominio custom: `cursos.miacademia.com` no `skillsramp.com/t/miacademia`
- Branding completo: logo, colores, fuentes, favicon — cero branding de SkillsRamp visible
- Los estudiantes construyen una relación con la marca del tenant, no con SkillsRamp
- A largo plazo: cuando los tenants crecen, su brand equity se queda con ellos

**Costo de cambio creado:** Los dominios custom construyen autoridad SEO, comportamiento de bookmarks de estudiantes y reconocimiento de marca — todo perdido si el tenant migra de plataforma.

---

#### 📅 Consultoría + Cursos Unificados
**Job to be done:** "Vendo cursos async Y sesiones 1:1. Manejarlos en dos herramientas es una pesadilla."

Capacidad actual:
- Gestión de disponibilidad: el admin establece horarios disponibles
- Reserva por estudiantes: reserva self-service con vista de calendario
- Gestión de links de reunión: link de Zoom/Meet adjunto por sesión
- Flujo de reprogramación: iniciado por el estudiante, confirmado por el admin
- Emails de confirmación de reserva (automatizados)

**Lo que desbloquea:** Coaches y consultores pueden ofrecer un "bundle de curso + coaching" — el producto de mayor LTV en la economía creadora — sin necesitar Calendly + Teachable + facturación manual.

#### 📅 Dashboard Marketing  y métricas
**Job to be done:** "Vendo cursos pero no sé qué está funcionando. No sé de dónde vienen mis estudiantes, qué páginas convierten ni cuánto estoy ganando realmente."

Capacidad actual:
  - Estadísticas del dashboard con filtro por rango de fechas
  - Conteo de estudiantes inscritos por curso
  - Historial de órdenes y pagos procesados
  - Progreso y completación de estudiantes por curso

**Lo que desbloquea:** Los tenants dejan de operar a ciegas. Con métricas claras de conversión (visitas → inscripciones → pagos),
  retención de estudiantes y rendimiento por curso, pueden tomar decisiones de pricing, saber qué contenido vale la
  pena producir y justificar el costo de la plataforma con números reales. Es la diferencia entre un creador que
  adivina y uno que escala.


---

#### 🎨 Constructor de Páginas Sin Código (Controla Todo el Funnel)
**Job to be done:** "Necesito landing pages, testimonios y CTAs — pero no puedo pagar un diseñador web."

El constructor visual Craft.js le da a los tenants:
- Construcción de páginas drag-and-drop
- Bloques dinámicos: carruseles de cursos, testimonios, CTAs, tablas de precios
- Control total sobre el funnel de adquisición, no solo la experiencia del curso

**Posicionamiento competitivo:** La mayoría de las plataformas LMS se detienen en el curso. SkillsRamp se extiende hacia arriba del funnel hacia el marketing, lo que significa que los tenants pueden consolidar herramientas (sin más Webflow/WordPress separado).

---

### Para Estudiantes (La Calidad de Experiencia = Driver de Retención de Tenants)

Los estudiantes no le pagan a SkillsRamp — pero su experiencia es lo que determina si los tenants se quedan.

| Valor                                  | Entrega                                           |
| -------------------------------------- | ------------------------------------------------- |
| Portal familiar y con branding         | Dominio custom + branding del tenant              |
| Checkout nativo LATAM                  | Cuotas de MercadoPago                             |
| Seguimiento de progreso + certificados | Tracking de completación + generación de cert PDF |
| Acceso 1:1 al instructor               | Sistema de reserva de consultoría                 |
| Notificaciones en tiempo real          | Socket.IO + email                                 |
| Experiencia mobile-friendly            | UI responsiva (PWA en roadmap)                    |

---

## 5. 💬 Relaciones con Clientes

> Cómo adquirimos, servimos y retenemos cada segmento de clientes.

### Creadores Individuales (Modelo Self-Service)

- **CAC - Coste de Adquisición de Clientes:** $50–$150 (inbound, contenido, SEO)
- **Onboarding:** Checklist en la app + docs + secuencia de email (Días 1/3/7/14/30)
- **Soporte:** Tickets async + FAQ + base de conocimiento
- **Expansión:** Prompts de feature-wall en los límites del plan ("Actualiza para agregar dominio custom")
- **Riesgo de churn:** Alto — los creadores individuales cancelan cuando sus cursos no se venden (culpa a la plataforma aunque no sea su responsabilidad)
- **Mitigación:** Ayudarlos a hacer marketing de sus cursos, no solo hospedarlos - 

Todo:
- Estrategia de marketing: redes + landing page, onboarding simlpe con poca fricción
- Soporte: whatsapp? mail? chatbot más a futuro?
- 

---

### Instituciones de Capacitación (Modelo Guiado)

- **CAC:** $300–$1,500 (inbound + outbound, ciclo de venta más largo)
- **Onboarding:** Setup liderado por CSM (1–2 llamadas, configuración de dominio, branding, importación de staff)
- **Soporte:** SLA por email (48h), contacto dedicado
- **Retención:** QBR (revisión trimestral de negocio) → expandir uso → upgrade de tier
- **Señales de expansión:** Cantidad de estudiantes creciendo, múltiples cursos, agregar cuentas de staff

---

### Enterprise / L&D Corporativo (Modelo High-Touch)

- **CAC:** $2,000–$10,000 (venta directa, revisión de seguridad, POC, legal)
- **Onboarding:** Ingeniero de implementación dedicado + configuración custom
- **Soporte:** Account manager designado + SLA 99.9% (contractual)
- **Retención:** Contratos anuales → lock-in del ciclo de compras
- **Requisito de desbloqueo:** SSO/SAML (actualmente faltante — bloquea este segmento completamente)

TBD: opcional

---

### Métricas de Retención a Trackear

| Métrica                                 | Objetivo | Por qué                                        |
| --------------------------------------- | -------- | ---------------------------------------------- |
| Conversión Trial → Active               | >25%     | Eficiencia del funnel de crecimiento principal |
| Churn mensual de ingresos               | <3%      | Estándar de salud SaaS                         |
| Net Revenue Retention                   | >110%    | Ingresos de expansión > ingresos de churn      |
| NPS (Tenant) Net Promoter Score         | >40      | Referencias impulsadas por promotores          |
| Tiempo hasta primer estudiante inscrito | <7 días  | Indicador líder de activación                  |

---

## 6. 📢 Canales

> Cómo los clientes descubren, evalúan, compran y obtienen valor de SkillsRamp.

### Awareness

| Canal                                                                       | Segmento Objetivo   | Nivel de Inversión         |
| --------------------------------------------------------------------------- | ------------------- | -------------------------- |
| SEO ("crear plataforma cursos online", "LMS LATAM", "vender cursos online") | Creadores           | Medio — contenido continuo |
| Blog / YouTube de economía creadora                                         | Creadores           | Bajo-medio                 |
| Casos de éxito de tenants                                                   | Instituciones       | Medio                      |
| Comunidades tech LATAM (LinkedIn, Twitter/X)                                | Todos los segmentos | Bajo                       |

**Oportunidad de keyword:** "alternativa Hotmart white label" — alta intención, baja competencia.

---

### Consideración

| Canal                                   | Mecanismo                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Tier de prueba gratuita                 | Evaluación sin fricción — sin tarjeta de crédito para Trial                                 |
| Demo en vivo (para instituciones)       | Reserva por Calendly → walkthrough guiado por CSM                                           |


---

### Adquisición

| Canal                                   | Segmento                  |
| --------------------------------------- | ------------------------- |
| Registro directo (sitio lms-marketing)  | Creadores individuales    |
| Cierre por CSM después del demo         | Instituciones             |
| Referidos de socios (agencias, coaches) | Creadores + instituciones |
| Integraciones de apps (Zapier, etc.)    | Creadores tech-savvy      |

---

### Expansión (Upsell / Cross-sell)

- Feature walls en la app: "El dominio custom requiere el plan Active"
- Nudges basados en uso: "Has inscrito 48/50 estudiantes en tu plan actual"
- Outreach de CSM al 60% de utilización del plan
- Drip de email: "Tu escuela está creciendo — esto desbloquea el siguiente tier"

---

### Canales Faltantes (Roadmap)

| Canal | Prioridad | Impacto Esperado |
|---|---|---|
| Programa de afiliados / referidos | **P1** | Convierte tenants activos en representantes de ventas |
| Listado en Zapier / Make | P2 | Distribución via comunidades no-code |
| Alianzas con influencers LATAM | P2 | Llega a la audiencia creadora de forma auténtica |
| Marketplace de apps (Stripe App Marketplace, etc.) | P3 | Descubrimiento enterprise |

---

## 7. 👥 Segmentos de Clientes

> Plataforma de dos lados: los Tenants pagan; los Estudiantes usan. Ambos lados deben ser atendidos.

### Lado que Paga — Tenants

#### Segmento 1: Creador de Cursos Individual

| Atributo                | Detalle                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------- |
| **Perfil**              | 1 persona, digital-first, 50–500 estudiantes                                          |
| **Geografía**           | LATAM (MX, AR, BR, CO, PE como prioridad)                                             |
| **Productos que vende** | Cursos en video, talleres, PDFs, webinars en vivo                                     |
| **Dolor principal**     | Sin presupuesto para dev custom; Hotmart cobra demasiado %; quiere dueñez de su marca |
| **Gana con SkillsRamp** | White-label a bajo costo, pagos LATAM, constructor sin código                         |
| **LTV estimado**        | $600–$2,400/año                                                                       |
| **CAC estimado**        | $50–$150                                                                              |
| **LTV:CAC**             | ~12:1 (excelente, pero se necesita volumen alto)                                      |
| **Riesgo de churn**     | Alto — si los cursos no se venden, culpan a la plataforma                             |

---

#### Segmento 2: Institución de Capacitación

| Atributo | Detalle |
|---|---|
| **Perfil** | Bootcamp, escuela de idiomas, centro de tutorías, 100–2,000 estudiantes |
| **Staff** | 5–50 personas, mix de instructores y admins |
| **Dolor principal** | Herramientas fragmentadas, sin control white-label, preocupaciones de compliance |
| **Gana con SkillsRamp** | Dominio custom, multi-admin, inscripción masiva, certificados, reportes de progreso |
| **LTV estimado** | $3,600–$24,000/año |
| **CAC estimado** | $300–$1,500 |
| **LTV:CAC** | ~10:1 (sólido) |
| **Riesgo de churn** | Bajo — alto costo de cambio una vez que los estudiantes + cursos están en la plataforma |

---

#### Segmento 3: Equipo L&D Corporativo

| Atributo                | Detalle                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| **Perfil**              | Departamento de capacitación interno, 50–500 empleados                                              |
| **Dolor principal**     | Compliance, reportes, SSO, acceso basado en roles                                                   |
| **Gana con SkillsRamp** | Roles de admin, reportes de progreso, certificados, portal branded                                  |
| **Brecha bloqueante**   | SSO/SAML no está disponible — bloqueador duro para la mayoría de los departamentos de TI enterprise |
| **LTV estimado**        | $12,000–$60,000/año                                                                                 |
| **CAC estimado**        | $2,000–$10,000                                                                                      |
| **LTV:CAC**             | ~6:1 (aceptable — alto valor absoluto)                                                              |
| **Riesgo de churn**     | Muy bajo — contratos anuales + ciclos de compras                                                    |
-- A futuro


---

#### Segmento 4: Coach / Consultor

| Atributo                     | Detalle                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| **Perfil**                   | Experto individual, monetiza vía cursos + sesiones 1:1                       |
| **Dolor principal**          | Manejar Calendly + Teachable + facturación = caos operativo                  |
| **Gana con SkillsRamp**      | Consultoría + cursos unificados, todos los pagos en un lugar                 |
| **Oportunidad de expansión** | "Bundle de curso + coaching" → producto de mayor LTV en la economía creadora |
| **LTV estimado**             | $1,200–$6,000/año                                                            |
| **CAC estimado**             | $100–$400                                                                    |
| **LTV:CAC**                  | ~10:1 (sólido)                                                               |


---

### Lado que No Paga — Estudiantes

Los estudiantes no le pagan a SkillsRamp, pero su experiencia es con lo que los tenants juzgan la plataforma.

| Característica             | Detalle                                                        |
| -------------------------- | -------------------------------------------------------------- |
| **Geografía**              | LATAM principalmente (MX, BR, AR, CO, PE)                      |
| **Demografía**             | 18–45, desarrollo profesional o interés personal               |
| **Dispositivo**            | Mobile-first (60–70% mobile en LATAM)                          |
| **Comportamiento de pago** | Cuotas preferidas para compras de más de $50                   |
| **Expectativas**           | Rápido, con branding, simple — no quieren saber que es un SaaS |

**Implicación clave:** La experiencia móvil es un driver silencioso de churn de tenants. Si los estudiantes se quejan de la UX móvil, los tenants migran. La PWA no es opcional — es una inversión en retención.

---

### Recomendación de Estrategia de Segmento

> No servir a los 4 por igual. Elegir una cabeza de playa primaria.

**Foco recomendado:** Creadores individuales + Coaches/Consultores primero (alto LTV:CAC, self-serve, validan la plataforma), luego Instituciones de Capacitación segundo (contratos más grandes, referidos), luego L&D Corporativo último (requiere inversión en SSO/SAML).

---

## 8. 💸 Estructura de Costos

> Cuánto cuesta operar el negocio y dónde está en riesgo el margen.

### Desglose de Costos

| Categoría                            | Tipo      | Driver Principal                        | % Estimado del OpEx Total |
| ------------------------------------ | --------- | --------------------------------------- | ------------------------- |
| Salarios de ingeniería               | Fijo      | Headcount                               | ~55%                      |
| Infraestructura cloud (Railway, DB)  | Variable  | Cantidad de tenants + volumen de datos  | ~12%                      |
| Hosting + CDN de video               | Variable  | Horas de curso almacenadas/transmitidas | ~10%                      |
| Fees de procesamiento de pagos       | Variable  | GMV procesado (MP: ~3.5-5%)             | ~8%                       |
| Email SendGrid                       | Variable  | MAU + volumen transaccional             | ~3%                       |
| QWEN API (automatización de agentes) | Variable  | Ejecuciones de agentes por sprint       | ~3%                       |
| Soporte y Éxito del Cliente          | Semi-fijo | Cantidad de tenants                     | ~5%                       |
| Marketing y Ventas                   | Variable  | Inversión en fase de crecimiento        | ~4%                       |

---

### Puntos de Riesgo en Economía Unitaria

**Crecimiento ilimitado del almacenamiento de video:**
Sin límites de almacenamiento por tenant, un tenant con 50 horas de video en 4K genera costos desproporcionados. Solución: limitar el almacenamiento por tier (ej. Starter = 10GB, Active = 100GB, Enterprise = ilimitado).

**Compresión de margen por fees de MercadoPago:**
MP cobra ~3.5–5% por transacción. Si SkillsRamp no toma un porcentaje del GMV, la plataforma absorbe este costo indirectamente (carga de soporte, infraestructura para volumen de transacciones) sin upside de ingresos. El modelo de fee sobre GMV revertería esto.

**Escalamiento de costos de la API de agentes:**
El uso de la API de Claude escala con la complejidad y el volumen de tareas. A medida que la plataforma de agentes se usa más intensamente, los costos de Claude crecen. Se necesitan presupuestos de tokens por proyecto o acceso a features de agentes por tiers.

---

### Palancas de Optimización de Costos

| Palanca | Mecanismo | Impacto |
|---|---|---|
| Tiers self-service | Reducir costo de soporte por creador | Medio |
| Facturación anual | Mejorar flujo de caja, reducir churn | Alto |
| Tiers de almacenamiento | Limitar costo de video por tenant | Alto |
| Optimización de caché CDN | Reducir ancho de banda a escala | Medio |
| Batching de agentes | Reducir llamadas a la API de Claude | Bajo-Medio |
| Railway → AWS (futuro) | A escala, ~30–40% reducción de costos infra | Alto |

---

### Posicionamiento Costo vs. Valor

| Segmento | ¿Orientado a Costo o a Valor? |
|---|---|
| Creador individual | Orientado a costo: alta sensibilidad al precio, compara agresivamente |
| Institución de capacitación | Equilibrado: le importa el precio por asiento + completitud de features |
| L&D Corporativo | Orientado a valor: importa el costo total de propiedad, no el precio de etiqueta |
| Coach / consultor | Orientado a costo inicialmente, orientado a valor una vez que ve el impacto en ingresos |

---

## 9. 💰 Fuentes de Ingresos

> Cómo el negocio captura valor del valor que crea.

### Fuentes de Ingresos Activas

#### Fuente 1: Suscripción SaaS (Principal)

- **Modelo:** Recurrente mensual o anual por tenant
- **Tiers:** Trial (gratis) → Active (pago) → Enterprise (precio custom)
- **Feature gates:** Dominio custom, eliminación de white-label, analytics avanzados, features de IA
- **Anual vs. mensual:** Objetivo: 40%+ de tenants en facturación anual (flujo de caja + reducción de churn)

**Palancas de estrategia de pricing:**
- Límites de estudiantes (crea presión de upgrade a medida que las escuelas crecen)
- Límites de almacenamiento (crea presión de upgrade a medida que los catálogos crecen)
- Asientos de admin (crea presión de upgrade a medida que los equipos crecen)
- Feature gates (impulsa upgrades limitando features de alto valor)

---

#### Fuente 2: Add-on de Dominio Custom / White-Label

- **Actual:** Feature premium (gated por tier o add-on de pago)
- **Precio:** $20–$50/mes add-on o incluido en el tier Active
- **Valor:** Alto valor percibido (dueñez de marca), bajo costo marginal (configuración DNS está automatizada)
- **Upsell:** Posicionar como "lo que te hace parecer un negocio real"

---

### Fuentes de Alto Potencial Aún No Realizadas

#### Fuente 3: Fee de Transacción sobre GMV: Gross Merchandise Value 🔥

**La oportunidad:** SkillsRamp procesa TODOS los pagos de estudiantes via MercadoPago. La plataforma actualmente toma 0% de los ingresos de transacciones. Este es un upside importante no realizado.
 
 GMV = Gross Merchandise Value (Valor Bruto de Mercancía)

  Es el volumen total de dinero que los estudiantes pagan a través de la plataforma — antes de descontar cualquier
  fee o comisión.

**Precedentes:**
- Hotmart: 9.9% + R$1 por transacción (agresivo, pero ofrecen marketplace + red de afiliados)
- Kajabi: 0% pero cobra $149–$399/mes de SaaS (capturan valor via precio de suscripción)
- Thinkific: 0–5% dependiendo del plan (usado para impulsar upgrades de plan)
- **Oportunidad SkillsRamp:** 1–2.5% de take-rate neto (después de absorber fees de MP en el cálculo)

**Modelos a considerar:**
1. **Revenue share bruto:** El tenant paga 2% de los ingresos de transacciones de estudiantes. SkillsRamp absorbe fees de MP. Neto ~0-0.5% pero crea alineación.
2. **Revenue share neto:** El tenant paga 1% por encima de los fees de MP. SkillsRamp recibe 1% neto adicional a la suscripción. Más limpio.
3. **Basado en plan:** 0% de fee de transacción en el plan Enterprise (premium), 1.5% en Active, 3% en Trial → impulsa upgrades.

**Riesgo:** Los tenants que actualmente pagan 0% van a resistir. Encuadrarlo como "infraestructura de pagos" en lugar de un porcentaje de ingresos. Grandfathering a tenants existentes por 6 meses.

---

#### Fuente 4: Fee de Setup / Onboarding

- **Modelo:** Fee único para instituciones que requieren implementación custom
- **Rango:** $500–$5,000 dependiendo de la complejidad (branding custom, migración de datos, capacitación)
- **Beneficio estratégico:** Los clientes que pagaron por el onboarding tienen un churn 40–60% menor (sunk cost + inversión)
- **Estado actual:** Probablemente informal o gratuito — formalizar esto es low-effort, high-impact

---

#### Fuente 5: Tier de Features de IA (Roadmap)

- **Modelo:** Add-on de suscripción premium o gate en el tier más alto
- **Features:** Recomendaciones de cursos con IA, analytics avanzados con resúmenes de IA, insights automatizados, alertas predictivas de churn para tenants
- **Precio:** $50–$200/mes add-on
- **Ventaja:** Construido sobre la plataforma de agentes existente + API de Claude — único en SkillsRamp

---

#### Fuente 6: Programa de Afiliados / Referidos (Roadmap)

- **Modelo:** Los tenants activos ganan % de la suscripción del primer año del tenant referido
- **Comisión:** 20–30% del ARR del primer año
- **Por qué funciona:** Los creadores conocen a otros creadores. Su recomendación de pares es el canal de mayor confianza.
- **Requisito:** Tracking de atribución + mecanismo de pago

---

### Resumen del Modelo de Ingresos

| Fuente | Modelo | Estado | % del ARR (Objetivo) |
|---|---|---|---|
| Suscripción SaaS | MRR/ARR | Activo | ~75% |
| Add-on de dominio custom | Add-on MRR | Activo | ~5% |
| Fee de transacción GMV | % del GMV | Oportunidad | ~15% |
| Fee de setup / onboarding | Único | Informal hoy | ~3% |
| Tier de features de IA | Add-on MRR | Roadmap | ~5% (después) |
| Comisiones de afiliados | Revenue share | Roadmap | Costo de distribución, no ingreso |

---

### Objetivos de Economía Unitaria

| Segmento | LTV | CAC | LTV:CAC | Payback |
|---|---|---|---|---|
| Creador individual | $1,200 promedio | $100 | 12:1 | 1 mes |
| Coach / consultor | $2,400 promedio | $250 | 10:1 | 1.5 meses |
| Institución de capacitación | $12,000 promedio | $800 | 15:1 | 1 mes |
| L&D Corporativo | $36,000 promedio | $6,000 | 6:1 | 24 meses |

**Objetivo de margen bruto:** >70% (benchmark SaaS para un negocio duradero)
**Objetivo de Net Revenue Retention:** >110% (los ingresos de expansión superan los ingresos de churn)

---

## Tensiones Estratégicas Clave

### Tensión 1: Volumen de Creadores vs. Valor Institucional

Creadores individuales = alto volumen, LTV bajo, riesgo de churn alto, amigable con self-serve.
Instituciones = bajo volumen, LTV alto, churn bajo, necesitan más soporte.

El producto, pricing y movimiento GTM para cada uno son diferentes. **Recomendación:** Construir el producto para instituciones (riqueza de features, confiabilidad, reportes) pero venderlo primero a creadores (velocidad, facilidad de uso, pagos LATAM). Los creadores validan la plataforma; las instituciones pagan por su madurez.

---

### Tensión 2: Marketplace vs. White-Label Puro

White-label puro significa que los tenants hacen toda su propia adquisición. Los estudiantes nunca descubren otras escuelas en la plataforma. Esto protege el brand equity del tenant pero limita los efectos de red.

Una capa de marketplace (descubrimiento de estudiantes, inscripción cross-school, promociones a nivel de plataforma) aceleraría el crecimiento pero erosiona la promesa white-label.

**Recomendación:** Mantenerse white-label puro por ahora. Es el diferenciador central vs. Hotmart. Construir el marketplace como feature opt-in para tenants que lo quieran, no como default.

---

### Tensión 3: Fee de GMV vs. Confianza del Tenant

Introducir un fee de GMV retroactivamente arriesga una rebelión de tenants. Pero dejar todo el valor de transacciones sobre la mesa limita el crecimiento.

**Recomendación:** Introducirlo solo para nuevos tenants. Encuadrarlo como "infraestructura de pagos" — SkillsRamp maneja toda la integración de MP, compliance y reconciliación. Cobrar 1% por este servicio. Grandfathering a tenants existentes con aviso de 6 meses.

---

## Registro de Supuestos y Riesgos

| # | Supuesto | Cómo Validar | Riesgo si Falla |
|---|---|---|---|
| 1 | MercadoPago es una ventaja real vs. plataformas LMS globales | Monitorear soporte de pagos de competidores trimestralmente | La diferenciación se erosiona, competir por precio |
| 2 | Los creadores LATAM prefieren white-label sobre el marketplace de Hotmart | Entrevistas de churn: "¿por qué dejaste Hotmart?" | Desajuste de product-market en el posicionamiento |
| 3 | Los tenants en trial convertirán si consiguen 1 estudiante inscrito | Trackear correlación entre hito de activación → conversión | CAC demasiado alto para el segmento de creadores individuales |
| 4 | Los costos de almacenamiento de video pueden gestionarse con límites por tier | Modelar costo por tenant a 10GB / 100GB / ilimitado | Compresión de margen a escala |
| 5 | Los creadores individuales aceptarán un fee del 1% sobre GMV encuadrado como infraestructura de pagos | A/B test del mensaje en la página de pricing | Pico de churn al introducir el fee |
| 6 | La plataforma de agentes es una ventaja de ingeniería duradera | Trackear time-to-feature vs. competidores | Los competidores adoptan dev asistido por IA, la brecha se cierra |
| 7 | El segmento L&D corporativo vale la pena perseguir | Contar interés inbound activo de corporativos antes de invertir en SSO | La inversión en SSO no desbloquea ARR significativo |

---

## Links y Referencias

- [[business-model-canvas.canvas]] — Diseño visual del BMC (abrir en Obsidian Canvas)
- `lms-docs/FEATURE_ROADMAP.md` — Matriz de prioridades para los próximos features
- `lms-docs/MULTI_TENANT_TECHNICAL_SPEC.md` — Especificación técnica completa de multi-tenancy
- `CLAUDE.md` — Instrucciones del agente hub, cola de tareas, pipeline SDD
- GitHub Project: https://github.com/orgs/lms-tenant/projects/1
