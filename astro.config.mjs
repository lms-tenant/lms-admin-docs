import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Docs — Panel de Administración',
      defaultLocale: 'es',
      locales: { root: { label: 'Español', lang: 'es' } },
      social: {},
      sidebar: [
        {
          label: '🚀 Primeros pasos',
          items: [
            { label: 'Configuración inicial', slug: 'primeros-pasos/configuracion-inicial' },
            { label: 'Recorrido por el panel', slug: 'primeros-pasos/recorrido-panel' },
            { label: 'Checklist de lanzamiento', slug: 'primeros-pasos/checklist-lanzamiento' },
          ],
        },
        {
          label: '🎓 Cursos',
          items: [
            { label: 'Crear un curso', slug: 'cursos/crear-curso' },
            { label: 'Módulos y lecciones', slug: 'cursos/modulos-y-lecciones' },
            { label: 'Tipos de lecciones', slug: 'cursos/tipos-de-lecciones' },
            { label: 'Exámenes y quizzes', slug: 'cursos/examenes-y-quizzes' },
            { label: 'Proyectos y entregas', slug: 'cursos/proyectos-y-entregas' },
            { label: 'Certificados', slug: 'cursos/certificados' },
            { label: 'Publicar cursos', slug: 'cursos/publicar-curso' },
          ],
        },
        {
          label: '👥 Usuarios',
          items: [
            { label: 'Roles y permisos', slug: 'usuarios/roles-y-permisos' },
            { label: 'Invitar estudiantes', slug: 'usuarios/invitar-estudiantes' },
            { label: 'Gestionar administradores', slug: 'usuarios/gestionar-administradores' },
            { label: 'Ver progreso de un estudiante', slug: 'usuarios/progreso-estudiante' },
          ],
        },
        {
          label: '🛒 Tienda',
          items: [
            { label: 'Configurar la tienda', slug: 'tienda/configurar-tienda' },
            { label: 'Crear productos', slug: 'tienda/crear-productos' },
            { label: 'Métodos de pago', slug: 'tienda/metodos-de-pago' },
            { label: 'Suscripciones y planes', slug: 'tienda/suscripciones-y-planes' },
            { label: 'Cupones y descuentos', slug: 'tienda/cupones-y-descuentos' },
            { label: 'Ver ventas y órdenes', slug: 'tienda/ventas-y-ordenes' },
          ],
        },
        {
          label: '🗓️ Consultorías',
          items: [
            { label: 'Configurar consultorías', slug: 'consultorias/configurar-consultorias' },
            { label: 'Gestionar sesiones', slug: 'consultorias/gestionar-sesiones' },
            { label: 'Reagendar y cancelar', slug: 'consultorias/reagendar-y-cancelar' },
          ],
        },
        {
          label: '📊 Analíticas',
          items: [
            { label: 'Dashboard principal', slug: 'analiticas/dashboard' },
            { label: 'Progreso de estudiantes', slug: 'analiticas/progreso-estudiantes' },
            { label: 'Métricas de ventas', slug: 'analiticas/metricas-ventas' },
          ],
        },
        {
          label: '🎨 Personalización',
          items: [
            { label: 'Branding: logo y colores', slug: 'personalizacion/branding' },
            { label: 'Dominio personalizado', slug: 'personalizacion/dominio-personalizado' },
            { label: 'WhatsApp flotante', slug: 'personalizacion/whatsapp-flotante' },
            { label: 'Scripts de seguimiento', slug: 'personalizacion/scripts-de-seguimiento' },
          ],
        },
        {
          label: '⚙️ Configuración',
          items: [
            { label: 'Ajustes generales', slug: 'configuracion/ajustes-generales' },
            { label: 'Notificaciones', slug: 'configuracion/notificaciones' },
            { label: 'Integraciones', slug: 'configuracion/integraciones' },
          ],
        },
      ],
    }),
  ],
  output: 'static',
});
