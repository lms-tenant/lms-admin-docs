# Scripts de seguimiento

Podés agregar scripts de seguimiento (Google Analytics, Meta Pixel, Hotjar, etc.) que se cargan en todas las páginas de tu academia.

## Agregar un script

Desde **Personalización → Scripts**:

1. Hacé clic en **Agregar script**
2. Pegá el código del script (sin las etiquetas `<script>`)
3. Elegí dónde cargarlo: **`<head>`** o **`<body>`**
4. Guardá

## Ejemplos comunes

### Google Analytics 4

```
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
```

*(El script de carga externo `gtag.js` se agrega automáticamente)*

### Meta Pixel (Facebook)

```
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
...
fbq('init', 'TU_PIXEL_ID');
fbq('track', 'PageView');
```

## Verificar que funciona

Usá las extensiones de navegador oficiales de cada plataforma para verificar que el script carga correctamente:

- Google Analytics: [Tag Assistant](https://tagassistant.google.com)
- Meta Pixel: [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

> **Nota de seguridad:** Solo agregá scripts de fuentes confiables. Los scripts tienen acceso completo a las páginas de tu academia.
