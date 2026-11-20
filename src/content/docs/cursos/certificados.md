---
title: Certificados
description: Emití certificados automáticos al completar cursos y verificá su autenticidad con el código.
---

# Certificados

Los certificados se emiten automáticamente cuando un estudiante completa los requisitos del curso. Cada certificado tiene un código único y un código QR en la parte inferior, para que cualquier persona pueda verificar su autenticidad.

## Verificar un certificado

La verificación es una página pública. No hace falta iniciar sesión ni tener cuenta.

1. Entrá a la dirección de la academia que emitió el certificado seguida de `/verify`, por ejemplo `https://tu-academia.skillsramp.ai/verify`. Si la academia usa un dominio propio, también funciona con ese dominio.
2. Ingresá el código que figura al pie del certificado, debajo de la fecha. Tiene 12 caracteres con el formato `XXXX-XXXX-XXXX`.
3. Tocá **Verificar**.

Otra forma es escanear el código QR del certificado con el celular. Abre la página de verificación con el código ya cargado.

Si el código es válido, la página muestra **Certificado verificado** con el nombre del estudiante, el curso, la academia que lo emitió, la fecha de aprobación y una vista del certificado, con las opciones **Descargar PDF** y **Compartir**. Si el código no existe, muestra **No encontramos este certificado**.

Los certificados descargados antes de que existiera el código corto tienen un código más largo, que también se puede verificar. Al descargarlo de nuevo sale con el código corto y el QR.

## Habilitar certificados en un curso

1. Abrí el curso desde el panel de administración
2. En la sección **Certificado**, activá el toggle **Emitir certificado al completar**
3. Configurá los requisitos (ver abajo)
4. Guardá

## Requisitos para obtener el certificado

Podés combinar estas condiciones:

- **Completar todas las lecciones**: el estudiante marca cada lección como vista
- **Aprobar todos los exámenes**: superar el puntaje mínimo en cada examen del curso
- **Entregar todos los proyectos**: al menos subir la entrega (sin revisión manual obligatoria)

## Cómo lo ve el estudiante

Cuando cumple los requisitos, aparece un botón **Descargar certificado** en la página del curso. El certificado incluye:

- Nombre del estudiante
- Nombre del curso
- Fecha de emisión
- Logo y nombre de tu academia
- La firma (la imagen que subiste o, sin imagen, el nombre del firmante escrito como firma) y el cargo del firmante
- Código QR y código de verificación

En la misma página el estudiante puede **Ver verificación**, **Copiar enlace**, **Compartir en LinkedIn**, **Compartir en X** y **Agregar a mi perfil de LinkedIn**. El enlace que comparte lleva a la página pública de verificación.

## Personalizar el certificado

El diseño se edita en **Sitio › Certificados**. Ahí podés cambiar:

- Los textos, los colores, el logo y el nombre y el cargo del firmante
- **Firma**: si subís una imagen, el certificado muestra esa imagen. Sin imagen, el nombre del firmante se escribe como firma en letra manuscrita. Si nunca cargaste un firmante, firma el dueño de la academia, y si borrás el nombre y guardás, el certificado sale sin firma
- **Ubicación del logo**: arriba del nombre (por defecto), al pie junto a la firma, en la esquina o en lugar del nombre
- **Tipografía**: la fuente y el tamaño de cada línea. Por defecto usa Playfair Display para la academia, el alumno y el curso, y la fuente de texto de tu marca para el resto

La vista previa muestra el certificado tal como se descarga. Los instructores pueden ver la plantilla pero no modificarla.

> **Nota:** Los certificados son documentos PDF generados en el momento de la descarga.
