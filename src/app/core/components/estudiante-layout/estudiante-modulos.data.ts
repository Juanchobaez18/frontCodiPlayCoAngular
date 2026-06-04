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
    subtitulo: 'Plan de Clases — Clase, tema, descripción y actividad en casa',
    locked: false,
    accent: 'cyan',
    lecciones: [
      {
        titulo: '¿Qué es Internet y las Páginas Web?',
        descripcion:
          'Explicación con dibujos y ejemplos de qué es una página web y cómo funciona Internet. Dibujar cómo se imagina su propia web.',
      },
      {
        titulo: 'Introducción a HTML',
        descripcion:
          'Explicar qué es HTML, para qué sirve y crear su primera estructura básica. Escribir una página con su nombre.',
      },
      {
        titulo: 'Etiquetas de Título y Texto',
        descripcion: 'Aprender etiquetas básicas de HTML. Crear una hoja con 3 títulos y 3 párrafos.',
      },
      {
        titulo: 'Agregar Imágenes — etiqueta img',
        descripcion: 'Etiqueta img y rutas de imagen. Colocar 3 imágenes favoritas.',
      },
      {
        titulo: 'Listas en HTML',
        descripcion: 'Listas ordenadas y desordenadas (ul, ol, li). Crear lista de juguetes o películas favoritas.',
      },
      {
        titulo: 'Enlaces y Navegación',
        descripcion: 'Etiquetas a y href para crear enlaces. Crear un menú con enlaces ficticios.',
      },
      {
        titulo: 'Tablas Básicas',
        descripcion: 'Crear tablas sencillas con table, tr, td. Tabla de calificaciones ficticias.',
      },
      {
        titulo: 'Formularios Simples',
        descripcion: 'Etiquetas input, label y button. Crear un formulario con nombre y edad.',
      },
      {
        titulo: 'Proyecto Mini Página Personal',
        descripcion: 'Integrar imágenes, texto y enlaces en una sola página. Personalizar su página.',
      },
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
