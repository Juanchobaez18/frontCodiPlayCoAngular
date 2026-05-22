export interface ModuloLeccion {
  titulo: string;
  descripcion: string;
  href?: string;
}

export type ModuloCardAccent = 'cyan' | 'pink' | 'lavender' | 'sky';

export interface ModuloPanelConfig {
  numero: number;
  titulo: string;
  totalLecciones: number;
  imagen: string;
  subtitulo?: string;
  lecciones: ModuloLeccion[];
  locked: boolean;
  /** Fondo del anillo central (mockup inicio). */
  accent: ModuloCardAccent;
  /** Muestra etiqueta "Próximo" arriba a la derecha. */
  showProximo?: boolean;
}
export const MODULOS_PANEL: ModuloPanelConfig[] = [
  {
    numero: 1,
    titulo: 'Módulo 1 - HTML',
    totalLecciones: 9,
    imagen: '/assetsPanelUsuaario/Codiplay Html-Photoroom.png',
    subtitulo: 'Plan de clases — fundamentos web',
    locked: false,
    accent: 'cyan',
    lecciones: [
      { titulo: '¿Qué es Internet y las Páginas Web?', descripcion: 'Qué es una página web y cómo funciona Internet.', href: '/dashboard/lecciones' },
      { titulo: 'Introducción a HTML', descripcion: 'Primera estructura básica HTML.', href: '/dashboard/lecciones' },
      { titulo: 'Etiquetas de Título y Texto', descripcion: 'Etiquetas básicas de HTML.', href: '/dashboard/lecciones' },
      { titulo: 'Agregar Imágenes', descripcion: 'Etiqueta img y rutas.', href: '/dashboard/lecciones' },
      { titulo: 'Listas en HTML', descripcion: 'Listas ordenadas y desordenadas.', href: '/dashboard/lecciones' },
      { titulo: 'Enlaces', descripcion: 'Etiqueta anchor y navegación.', href: '/dashboard/lecciones' },
      { titulo: 'Tablas', descripcion: 'Organizar datos en tablas.', href: '/dashboard/lecciones' },
      { titulo: 'Formularios', descripcion: 'Inputs y formularios básicos.', href: '/dashboard/lecciones' },
      { titulo: 'Proyecto final Módulo 1', descripcion: 'Integra lo aprendido en una mini página.', href: '/dashboard/lecciones' },
    ],
  },
  {
    numero: 2,
    titulo: 'Módulo 2',
    totalLecciones: 6,
    imagen: '/assetsPanelUsuaario/Codiplay Html-Photoroom.png',
    locked: false,
    accent: 'pink',
    lecciones: [
      { titulo: 'Lección 1', descripcion: 'Contenido del módulo 2.', href: '/dashboard/lecciones' },
      { titulo: 'Lección 2', descripcion: 'Contenido del módulo 2.', href: '/dashboard/lecciones' },
      { titulo: 'Lección 3', descripcion: 'Contenido del módulo 2.', href: '/dashboard/lecciones' },
      { titulo: 'Lección 4', descripcion: 'Contenido del módulo 2.', href: '/dashboard/lecciones' },
      { titulo: 'Lección 5', descripcion: 'Contenido del módulo 2.', href: '/dashboard/lecciones' },
      { titulo: 'Lección 6', descripcion: 'Contenido del módulo 2.', href: '/dashboard/lecciones' },
    ],
  },
  {
    numero: 3,
    titulo: 'Módulo 3',
    totalLecciones: 10,
    imagen: '/assetsPanelUsuaario/Codiplay Html-Photoroom.png',
    locked: true,
    accent: 'lavender',
    showProximo: true,
    lecciones: [],
  },
  {
    numero: 4,
    titulo: 'Módulo 4',
    totalLecciones: 15,
    imagen: '/assetsPanelUsuaario/Codiplay Html-Photoroom.png',
    locked: true,
    accent: 'sky',
    showProximo: true,
    lecciones: [],
  },
];

export function getModuloConfig(num: number): ModuloPanelConfig | undefined {
  return MODULOS_PANEL.find((m) => m.numero === num);
}
