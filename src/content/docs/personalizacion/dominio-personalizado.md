---
title: Dominio personalizado
description: Usá tu propio dominio para acceder a la academia.
---

# Dominio personalizado

Un dominio personalizado permite que tu academia sea accesible desde tu propia URL (ej: `academia.tuempresa.com`) en lugar del dominio por defecto de la plataforma.

## Requisitos

- Tener un dominio propio registrado (ej: en GoDaddy, Namecheap, NIC Argentina, etc.)
- Que tu plan incluya la funcionalidad de dominio personalizado

## Configuración

### Paso 1: Agregar el dominio en el panel

1. Desde **Personalización → Dominio personalizado**
2. Ingresá tu dominio (ej: `academia.tuempresa.com`)
3. Hacé clic en **Guardar**
4. El panel te mostrará un registro DNS para configurar

### Paso 2: Configurar el DNS

En el panel de administración de tu dominio (GoDaddy, Namecheap, etc.), agregá un registro **CNAME**:

| Tipo | Nombre | Valor |
|---|---|---|
| CNAME | academia | [valor que te da la plataforma] |

### Paso 3: Esperar la propagación

Los cambios de DNS pueden tardar entre 15 minutos y 48 horas en propagarse. La plataforma verifica automáticamente y activa el dominio cuando detecta la configuración.

## Certificado SSL

El certificado SSL (HTTPS) se genera automáticamente una vez que el dominio está verificado. No necesitás hacer nada adicional.

## Dominio no disponible

Si el dominio personalizado no está incluido en tu plan, contactá a soporte para habilitarlo.
