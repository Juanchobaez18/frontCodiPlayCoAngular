/**
 * Contenido estático de lecciones extraído de vistascodi.
 * Estructura: clave = `${moduloOrden}-${leccionOrden}`
 */
export interface LeccionVistaCodiContent {
  gradient: string;
  blobColor1: string;
  blobColor2: string;
  pasos: { titulo: string; html: string }[];
}

export const LECCIONES_CONTENT: Record<string, LeccionVistaCodiContent> = {

  /* ─── MÓDULO 1: HTML ─────────────────────────────────────── */

  '1-1': {
    gradient: 'linear-gradient(90deg, #4dfff6, #63a0ff)',
    blobColor1: 'radial-gradient(circle, #00ffe7, #006d6c)',
    blobColor2: 'radial-gradient(circle, #ff00ff, #1c3aff)',
    pasos: [
      {
        titulo: '🎯 Parte 1: El Mapa del Tesoro',
        html: `
<p style="text-align:center; margin-bottom:28px; color:#cbd5e1;">Para entender Internet, imaginemos que es una ciudad gigante:</p>
<div class="concept-grid">
  <div class="concept-item">
    <span class="concept-icon">🛣️</span>
    <div class="concept-title">Internet</div>
    <span class="concept-analogy">La Carretera Global</span>
    <p class="concept-desc">Son los cables y señales invisibles que conectan a todas las computadoras del mundo.</p>
  </div>
  <div class="concept-item">
    <span class="concept-icon">🏠</span>
    <div class="concept-title">Página Web</div>
    <span class="concept-analogy">El Edificio</span>
    <p class="concept-desc">Un lugar específico con información que vive en esas carreteras digitales.</p>
  </div>
  <div class="concept-item">
    <span class="concept-icon">🏦</span>
    <div class="concept-title">Servidor</div>
    <span class="concept-analogy">El Bibliotecario</span>
    <p class="concept-desc">Una computadora especial que guarda las páginas y te las entrega cuando las pides.</p>
  </div>
  <div class="concept-item">
    <span class="concept-icon">🚗</span>
    <div class="concept-title">Navegador</div>
    <span class="concept-analogy">Tu Vehículo</span>
    <p class="concept-desc">El programa (Chrome, Edge) que usas para viajar por las carreteras de Internet.</p>
  </div>
</div>`
      },
      {
        titulo: '🍕 Parte 2: El Pedido Web',
        html: `
<p style="text-align:center; margin-bottom:28px; color:#cbd5e1;">Visitar una web es exactamente igual a pedir una pizza a domicilio:</p>
<div class="pizza-timeline">
  <div class="timeline-step"><div class="step-num">1</div><div class="step-emoji">🧑‍💻</div><div class="step-info"><strong>Tú haces el pedido</strong><p>Escribes la dirección (URL) de tu juego favorito en el navegador.</p></div></div>
  <div class="timeline-step"><div class="step-num">2</div><div class="step-emoji">➡️☁️</div><div class="step-info"><strong>Viaje por la Carretera</strong><p>Tu pedido viaja por los cables de Internet hasta llegar a la Nube.</p></div></div>
  <div class="timeline-step"><div class="step-num">3</div><div class="step-emoji">🖥️</div><div class="step-info"><strong>El Servidor Cocina</strong><p>El Servidor busca los archivos de tu juego (prepara la pizza).</p></div></div>
  <div class="timeline-step"><div class="step-num">4</div><div class="step-emoji">⬅️📦</div><div class="step-info"><strong>Entrega Express</strong><p>El Servidor envía la página de vuelta a tu casa por Internet.</p></div></div>
  <div class="timeline-step"><div class="step-num">5</div><div class="step-emoji">🎉</div><div class="step-info"><strong>¡A Disfrutar!</strong><p>Tu Navegador recibe los datos y te muestra el juego en pantalla.</p></div></div>
</div>`
      },
      {
        titulo: '🎨 Parte 3: Actividad',
        html: `
<div class="activity-box">
  <p style="font-size:1rem; margin-bottom:16px; color:#e9f5ff;">¡Ahora te toca a ti! Dibuja o describe cómo imaginas <strong>tu propia página web</strong>.</p>
  <ul class="checklist">
    <li><i class="fas fa-check-circle"></i> Un nombre genial (Ej: "El Castillo de Ana").</li>
    <li><i class="fas fa-check-circle"></i> Un fondo de tu color favorito.</li>
    <li><i class="fas fa-check-circle"></i> Botones grandes para jugar o leer.</li>
    <li><i class="fas fa-check-circle"></i> ¡Dibujos de lo que más te guste!</li>
  </ul>
  <p style="font-size:0.9rem; color:#a0b0d0; margin-top:16px;">Comparte tu idea con tu docente y sigue a la siguiente lección.</p>
</div>`
      }
    ]
  },

  '1-2': {
    gradient: 'linear-gradient(90deg, #4dfff6, #63a0ff)',
    blobColor1: 'radial-gradient(circle, #00ffe7, #006d6c)',
    blobColor2: 'radial-gradient(circle, #4da3ff, #1c3aff)',
    pasos: [
      {
        titulo: '📖 ¿Qué es HTML?',
        html: `
<div class="info-block">
  <p><strong>HTML</strong> significa <strong>HyperText Markup Language</strong>. Es el lenguaje que usan las páginas web para organizar el contenido: títulos, textos, imágenes, botones y mucho más.</p>
  <p>Piensa que HTML es como el <strong>esqueleto</strong> de tu sitio web. Le dice al navegador qué partes tiene la página.</p>
</div>
<h2>¿Para qué sirve?</h2>
<div class="info-block">
  <p>Con HTML puedes:</p>
  <ul><li>Crear títulos y textos.</li><li>Organizar secciones de tu página.</li><li>Preparar todo para luego agregar estilos con CSS.</li></ul>
</div>
<h2>Estructura básica</h2>
<pre class="code-sample">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Mi primera página&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;¡Hola, soy [TU NOMBRE]!&lt;/h1&gt;
    &lt;p&gt;Esta es mi primera página en HTML.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>`
      },
      {
        titulo: '✍️ Tu misión: primera página',
        html: `
<div class="info-block">
  <p>En esta misión debes escribir el código HTML de una página desde cero. Tu página debe tener:</p>
  <ul>
    <li><strong>&lt;!DOCTYPE html&gt;</strong> al inicio.</li>
    <li>Las etiquetas <strong>&lt;html&gt;</strong>, <strong>&lt;head&gt;</strong> y <strong>&lt;body&gt;</strong> bien cerradas.</li>
    <li>Un <strong>&lt;h1&gt;</strong> con tu nombre.</li>
    <li>Al menos un <strong>&lt;p&gt;</strong> donde cuentes algo sobre ti.</li>
  </ul>
</div>
<div class="activity-box">
  <p>📝 Escribe tu código en un editor de texto (Notepad, VS Code) y guárdalo como <code>index.html</code>. Luego ábrelo en tu navegador y comparte el resultado con tu docente.</p>
</div>`
      }
    ]
  },

  '1-3': {
    gradient: 'linear-gradient(90deg, #ffdd59, #ff6b81)',
    blobColor1: 'radial-gradient(circle, #ffdd59, #ff6b6b)',
    blobColor2: 'radial-gradient(circle, #ff6b81, #9c27b0)',
    pasos: [
      {
        titulo: '⭐ Etiquetas de Título y Texto',
        html: `
<h2>Paso a paso de la misión 🛸</h2>
<div class="steps">
  <div class="step"><div class="step-number">1</div><div class="step-text">Lee para qué sirven las etiquetas de título (<strong>&lt;h1&gt; – &lt;h3&gt;</strong>) y texto (<strong>&lt;p&gt;</strong>).</div></div>
  <div class="step"><div class="step-number">2</div><div class="step-text">Mira el ejemplo de mini página con 3 títulos y 3 párrafos.</div></div>
  <div class="step"><div class="step-number">3</div><div class="step-text">Escribe tu propia historia espacial con 3 títulos y 3 párrafos.</div></div>
  <div class="step"><div class="step-number">4</div><div class="step-text">Haz clic en <strong>"Ver mi historia"</strong> y si está todo bien, ¡habrás completado la misión! ✅</div></div>
</div>
<h2>Etiquetas que vas a usar</h2>
<div class="tags-grid">
  <div class="tag-card"><strong>&lt;h1&gt;</strong> → Título principal de la página.</div>
  <div class="tag-card"><strong>&lt;h2&gt;</strong> y <strong>&lt;h3&gt;</strong> → Subtítulos de secciones.</div>
  <div class="tag-card"><strong>&lt;p&gt;</strong> → Párrafos de texto descriptivo.</div>
</div>
<h2>Ejemplo de mini página 📄</h2>
<pre class="code-sample">&lt;h1&gt;Mi galaxia favorita&lt;/h1&gt;
&lt;h2&gt;Planetas de colores&lt;/h2&gt;
&lt;p&gt;Tengo planetas azules, verdes y morados que brillan mucho.&lt;/p&gt;
&lt;h3&gt;Estrellas bailarinas&lt;/h3&gt;
&lt;p&gt;Las estrellas de mi galaxia se mueven como si bailaran en el cielo.&lt;/p&gt;
&lt;p&gt;Cada noche, mi galaxia se llena de luces y aventuras.&lt;/p&gt;</pre>`
      },
      {
        titulo: '✍️ Tu misión galáctica',
        html: `
<div class="info-block">
  <p>Crea una hoja HTML con <strong>3 títulos</strong> y <strong>3 párrafos</strong> sobre tu galaxia, planetas o naves espaciales favoritas.</p>
</div>
<div class="activity-box">
  <p>🚀 Recuerda que puedes usar <code>&lt;h1&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code> y <code>&lt;p&gt;</code> para estructurar tu historia. ¡Guárdala como <strong>historia.html</strong> y ábrela en el navegador!</p>
</div>`
      }
    ]
  },

  '1-4': {
    gradient: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
    blobColor1: 'radial-gradient(circle, #a78bfa, #7c3aed)',
    blobColor2: 'radial-gradient(circle, #60a5fa, #1d4ed8)',
    pasos: [
      {
        titulo: '🖼️ Agregar Imágenes con HTML',
        html: `
<div class="info-block">
  <p>Para agregar imágenes en HTML, usamos la etiqueta <strong>&lt;img&gt;</strong>. Es una etiqueta especial porque <strong>no necesita etiqueta de cierre</strong>.</p>
</div>
<h2>Atributos de &lt;img&gt;</h2>
<div class="tags-grid">
  <div class="tag-card"><strong>src</strong> → La ruta o URL de la imagen. Ejemplo: <code>src="foto.jpg"</code></div>
  <div class="tag-card"><strong>alt</strong> → Texto alternativo si la imagen no carga. Ejemplo: <code>alt="Mi mascota"</code></div>
  <div class="tag-card"><strong>width / height</strong> → Controla el tamaño. Ejemplo: <code>width="300"</code></div>
</div>
<h2>Ejemplo de código</h2>
<pre class="code-sample">&lt;!-- Imagen con ruta relativa --&gt;
&lt;img src="mi-foto.jpg" alt="Foto de mi mascota" width="300" /&gt;

&lt;!-- Imagen desde internet --&gt;
&lt;img src="https://ejemplo.com/imagen.png" alt="Imagen en línea" /&gt;</pre>`
      },
      {
        titulo: '✍️ Misión: 3 imágenes favoritas',
        html: `
<div class="info-block">
  <p>Crea una página HTML con <strong>3 imágenes</strong> de tus cosas favoritas (animales, deportes, personajes, etc.).</p>
  <ul>
    <li>Usa el atributo <strong>src</strong> para apuntar a imágenes de internet.</li>
    <li>Siempre agrega el atributo <strong>alt</strong> con una descripción.</li>
    <li>Añade un <strong>&lt;h2&gt;</strong> o <strong>&lt;p&gt;</strong> debajo de cada imagen explicando qué es.</li>
  </ul>
</div>
<pre class="code-sample">&lt;img src="URL_DE_TU_IMAGEN" alt="descripción" width="200" /&gt;
&lt;p&gt;Mi animal favorito es el delfín.&lt;/p&gt;</pre>`
      }
    ]
  },

  '1-5': {
    gradient: 'linear-gradient(90deg, #34d399, #06b6d4)',
    blobColor1: 'radial-gradient(circle, #34d399, #059669)',
    blobColor2: 'radial-gradient(circle, #06b6d4, #0284c7)',
    pasos: [
      {
        titulo: '📋 Listas en HTML',
        html: `
<div class="info-block">
  <p>HTML tiene dos tipos de listas: <strong>ordenadas</strong> (con números) y <strong>desordenadas</strong> (con viñetas).</p>
</div>
<div class="tags-grid">
  <div class="tag-card"><strong>&lt;ul&gt;</strong> → Lista desordenada (viñetas •). Dentro usa <code>&lt;li&gt;</code> para cada elemento.</div>
  <div class="tag-card"><strong>&lt;ol&gt;</strong> → Lista ordenada (números 1, 2, 3). Dentro usa <code>&lt;li&gt;</code> para cada elemento.</div>
  <div class="tag-card"><strong>&lt;li&gt;</strong> → Cada elemento de la lista. Se usa dentro de &lt;ul&gt; o &lt;ol&gt;.</div>
</div>
<h2>Ejemplo</h2>
<pre class="code-sample">&lt;!-- Lista desordenada --&gt;
&lt;h2&gt;Mis juguetes favoritos&lt;/h2&gt;
&lt;ul&gt;
  &lt;li&gt;Lego&lt;/li&gt;
  &lt;li&gt;Pelota&lt;/li&gt;
  &lt;li&gt;Muñeco de acción&lt;/li&gt;
&lt;/ul&gt;

&lt;!-- Lista ordenada --&gt;
&lt;h2&gt;Mis películas favoritas&lt;/h2&gt;
&lt;ol&gt;
  &lt;li&gt;Spider-Man&lt;/li&gt;
  &lt;li&gt;Moana&lt;/li&gt;
  &lt;li&gt;Toy Story&lt;/li&gt;
&lt;/ol&gt;</pre>`
      },
      {
        titulo: '✍️ Misión: tu lista favorita',
        html: `
<div class="activity-box">
  <p>Crea una página con <strong>2 listas</strong>:</p>
  <ul class="checklist">
    <li><i class="fas fa-check-circle"></i> Una lista <strong>desordenada</strong> con tus juguetes o películas favoritas (mínimo 4 elementos).</li>
    <li><i class="fas fa-check-circle"></i> Una lista <strong>ordenada</strong> con los pasos de tu actividad favorita.</li>
  </ul>
</div>`
      }
    ]
  },

  '1-6': {
    gradient: 'linear-gradient(90deg, #f97316, #f59e0b)',
    blobColor1: 'radial-gradient(circle, #f97316, #dc2626)',
    blobColor2: 'radial-gradient(circle, #f59e0b, #d97706)',
    pasos: [
      {
        titulo: '🔗 Enlaces y Navegación',
        html: `
<div class="info-block">
  <p>La etiqueta <strong>&lt;a&gt;</strong> (anchor) crea enlaces o hipervínculos. Con ella puedes navegar entre páginas.</p>
</div>
<div class="tags-grid">
  <div class="tag-card"><strong>href</strong> → Destino del enlace. Puede ser una URL o una ruta de archivo.</div>
  <div class="tag-card"><strong>target="_blank"</strong> → Abre el enlace en una pestaña nueva.</div>
  <div class="tag-card"><strong>Texto del enlace</strong> → Lo que el usuario verá y hará clic.</div>
</div>
<h2>Tipos de enlaces</h2>
<pre class="code-sample">&lt;!-- Enlace externo --&gt;
&lt;a href="https://www.google.com" target="_blank"&gt;Ir a Google&lt;/a&gt;

&lt;!-- Enlace a otra página del mismo sitio --&gt;
&lt;a href="pagina2.html"&gt;Ver mi segunda página&lt;/a&gt;

&lt;!-- Enlace que baja a una sección de la misma página --&gt;
&lt;a href="#seccion1"&gt;Ir a la sección 1&lt;/a&gt;
&lt;h2 id="seccion1"&gt;¡Llegaste aquí!&lt;/h2&gt;</pre>`
      },
      {
        titulo: '✍️ Misión: menú con enlaces',
        html: `
<div class="info-block">
  <p>Crea un menú de navegación con al menos <strong>3 enlaces</strong>. Pueden ser ficticios (que digan "próximamente") o que lleven a páginas reales.</p>
</div>
<pre class="code-sample">&lt;nav&gt;
  &lt;a href="index.html"&gt;Inicio&lt;/a&gt; |
  &lt;a href="about.html"&gt;Sobre mí&lt;/a&gt; |
  &lt;a href="galeria.html"&gt;Galería&lt;/a&gt;
&lt;/nav&gt;</pre>
<div class="activity-box">
  <p>💡 Tip: La etiqueta <code>&lt;nav&gt;</code> es un contenedor semántico especialmente diseñado para menús de navegación.</p>
</div>`
      }
    ]
  },

  '1-7': {
    gradient: 'linear-gradient(90deg, #c084fc, #818cf8)',
    blobColor1: 'radial-gradient(circle, #c084fc, #7c3aed)',
    blobColor2: 'radial-gradient(circle, #818cf8, #4338ca)',
    pasos: [
      {
        titulo: '📊 Tablas en HTML',
        html: `
<div class="info-block">
  <p>Las tablas permiten organizar datos en filas y columnas. Se crean con varias etiquetas que trabajan juntas.</p>
</div>
<div class="tags-grid">
  <div class="tag-card"><strong>&lt;table&gt;</strong> → Contenedor principal de la tabla.</div>
  <div class="tag-card"><strong>&lt;tr&gt;</strong> → Table Row (fila).</div>
  <div class="tag-card"><strong>&lt;th&gt;</strong> → Table Header (encabezado de columna, en negrita).</div>
  <div class="tag-card"><strong>&lt;td&gt;</strong> → Table Data (celda de datos).</div>
</div>
<h2>Ejemplo: tabla de calificaciones</h2>
<pre class="code-sample">&lt;table border="1"&gt;
  &lt;tr&gt;
    &lt;th&gt;Materia&lt;/th&gt;
    &lt;th&gt;Nota&lt;/th&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;Matemáticas&lt;/td&gt;
    &lt;td&gt;9.5&lt;/td&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;Español&lt;/td&gt;
    &lt;td&gt;8.0&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</pre>`
      },
      {
        titulo: '✍️ Misión: tu tabla personal',
        html: `
<div class="activity-box">
  <p>Crea una tabla con tus calificaciones ficticias o una lista de tus datos personales con 2 columnas y al menos 4 filas.</p>
  <ul class="checklist">
    <li><i class="fas fa-check-circle"></i> Usa <code>&lt;th&gt;</code> para los encabezados.</li>
    <li><i class="fas fa-check-circle"></i> Usa <code>&lt;td&gt;</code> para los datos.</li>
    <li><i class="fas fa-check-circle"></i> Agrega el atributo <code>border="1"</code> a <code>&lt;table&gt;</code>.</li>
  </ul>
</div>`
      }
    ]
  },

  '1-8': {
    gradient: 'linear-gradient(90deg, #fb923c, #f43f5e)',
    blobColor1: 'radial-gradient(circle, #fb923c, #dc2626)',
    blobColor2: 'radial-gradient(circle, #f43f5e, #9f1239)',
    pasos: [
      {
        titulo: '📝 Formularios en HTML',
        html: `
<div class="info-block">
  <p>Los formularios permiten a los usuarios <strong>ingresar información</strong>. Se usan en registros, búsquedas, comentarios, etc.</p>
</div>
<div class="tags-grid">
  <div class="tag-card"><strong>&lt;form&gt;</strong> → Contenedor del formulario.</div>
  <div class="tag-card"><strong>&lt;input&gt;</strong> → Campo de entrada. El <code>type</code> define el tipo.</div>
  <div class="tag-card"><strong>&lt;label&gt;</strong> → Etiqueta descriptiva de cada campo.</div>
  <div class="tag-card"><strong>&lt;button&gt;</strong> → Botón de envío o acción.</div>
</div>
<h2>Tipos de input</h2>
<pre class="code-sample">&lt;!-- Texto --&gt;
&lt;input type="text" placeholder="Tu nombre" /&gt;

&lt;!-- Email --&gt;
&lt;input type="email" placeholder="correo@ejemplo.com" /&gt;

&lt;!-- Contraseña --&gt;
&lt;input type="password" placeholder="Contraseña" /&gt;

&lt;!-- Checkbox --&gt;
&lt;input type="checkbox" /&gt; Acepto términos

&lt;!-- Botón --&gt;
&lt;button type="submit"&gt;Enviar&lt;/button&gt;</pre>`
      },
      {
        titulo: '✍️ Misión: formulario de registro',
        html: `
<div class="info-block">
  <p>Crea un formulario de registro con los siguientes campos:</p>
  <ul>
    <li>Nombre completo (<code>text</code>)</li>
    <li>Correo electrónico (<code>email</code>)</li>
    <li>Contraseña (<code>password</code>)</li>
    <li>Fecha de nacimiento (<code>date</code>)</li>
    <li>Botón "Registrarme"</li>
  </ul>
</div>
<pre class="code-sample">&lt;form&gt;
  &lt;label&gt;Nombre:&lt;/label&gt;
  &lt;input type="text" name="nombre" /&gt;

  &lt;label&gt;Email:&lt;/label&gt;
  &lt;input type="email" name="email" /&gt;

  &lt;button type="submit"&gt;Registrarme&lt;/button&gt;
&lt;/form&gt;</pre>`
      }
    ]
  },

  '1-9': {
    gradient: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
    blobColor1: 'radial-gradient(circle, #22d3ee, #0891b2)',
    blobColor2: 'radial-gradient(circle, #a78bfa, #7c3aed)',
    pasos: [
      {
        titulo: '🏆 Proyecto Final: Mini Página Web',
        html: `
<div class="info-block">
  <p>¡Llegaste al proyecto final del Módulo 1! Es hora de demostrar todo lo que aprendiste sobre HTML.</p>
</div>
<h2>Tu misión</h2>
<div class="steps">
  <div class="step"><div class="step-number">1</div><div class="step-text">Crea una página llamada <strong>mi-web.html</strong> sobre tu tema favorito.</div></div>
  <div class="step"><div class="step-number">2</div><div class="step-text">Usa al menos: <strong>h1/h2/h3</strong>, <strong>p</strong>, <strong>img</strong>, <strong>ul/ol</strong>, <strong>a</strong>, <strong>table</strong> y <strong>form</strong>.</div></div>
  <div class="step"><div class="step-number">3</div><div class="step-text">Incluye un menú de navegación con 3 secciones.</div></div>
  <div class="step"><div class="step-number">4</div><div class="step-text">Guárdala y ábrela en el navegador. ¡Comparte el resultado con tu docente!</div></div>
</div>`
      },
      {
        titulo: '✅ Criterios de evaluación',
        html: `
<div class="tags-grid">
  <div class="tag-card"><strong>🏗️ Estructura</strong><br/>¿Tiene DOCTYPE, html, head y body?</div>
  <div class="tag-card"><strong>📑 Contenido</strong><br/>¿Usa al menos 5 etiquetas diferentes?</div>
  <div class="tag-card"><strong>🔗 Navegación</strong><br/>¿Tiene enlaces funcionales?</div>
  <div class="tag-card"><strong>🎨 Creatividad</strong><br/>¿El tema y diseño son originales?</div>
</div>
<div class="activity-box" style="margin-top:20px;">
  <p>🎉 ¡Felicitaciones por completar el Módulo 1 de HTML! En el Módulo 2 aprenderás a darle <strong>estilos</strong> a tu página con <strong>CSS</strong>.</p>
</div>`
      }
    ]
  },

  /* ─── MÓDULO 2: CSS ─────────────────────────────────────── */

  '2-1': {
    gradient: 'linear-gradient(90deg, #a3e635, #22d3ee)',
    blobColor1: 'radial-gradient(circle, #a3e635, #65a30d)',
    blobColor2: 'radial-gradient(circle, #22d3ee, #0891b2)',
    pasos: [
      {
        titulo: '🎨 Introducción a CSS',
        html: `
<div class="info-block">
  <p><strong>CSS</strong> significa <strong>Cascading Style Sheets</strong>. Es el lenguaje que usamos para darle <em>estilo</em> al HTML: colores, tamaños, fuentes, espaciados y mucho más.</p>
  <p>Si HTML es el esqueleto, CSS es la <strong>ropa y la decoración</strong> de tu página web.</p>
</div>
<h2>¿Cómo se conecta al HTML?</h2>
<div class="tags-grid">
  <div class="tag-card"><strong>Externo</strong><br/><code>&lt;link rel="stylesheet" href="estilos.css"&gt;</code></div>
  <div class="tag-card"><strong>Interno</strong><br/><code>&lt;style&gt; ... &lt;/style&gt;</code> dentro del &lt;head&gt;</div>
  <div class="tag-card"><strong>En línea</strong><br/><code>style="color: red;"</code> dentro de un elemento</div>
</div>
<h2>Sintaxis básica</h2>
<pre class="code-sample">/* Selector → a qué elemento aplicar */
h1 {
  color: blue;        /* color del texto */
  font-size: 32px;    /* tamaño de la fuente */
  text-align: center; /* alineación */
}

p {
  color: gray;
  line-height: 1.6;
}</pre>`
      },
      {
        titulo: '✍️ Misión: colorea tu página',
        html: `
<div class="info-block">
  <p>Agrega una hoja de estilos a tu página HTML del Módulo 1 y aplica:</p>
  <ul>
    <li>Un <strong>color de fondo</strong> al body.</li>
    <li>Un <strong>color diferente</strong> para h1, h2 y p.</li>
    <li>Una <strong>fuente personalizada</strong> con font-family.</li>
  </ul>
</div>
<pre class="code-sample">body {
  background-color: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Arial', sans-serif;
}

h1 {
  color: #00eaff;
}

p {
  color: #a0aec0;
}</pre>`
      }
    ]
  },

  '2-2': {
    gradient: 'linear-gradient(90deg, #f472b6, #c084fc)',
    blobColor1: 'radial-gradient(circle, #f472b6, #db2777)',
    blobColor2: 'radial-gradient(circle, #c084fc, #7c3aed)',
    pasos: [
      {
        titulo: '🎨 Colores y Fondos CSS',
        html: `
<div class="info-block">
  <p>CSS ofrece muchas formas de especificar colores y fondos para tus elementos.</p>
</div>
<div class="tags-grid">
  <div class="tag-card"><strong>color</strong> → Color del texto. Ej: <code>color: red;</code></div>
  <div class="tag-card"><strong>background-color</strong> → Color de fondo. Ej: <code>background-color: #1a1a2e;</code></div>
  <div class="tag-card"><strong>background-image</strong> → Imagen de fondo. Ej: <code>background-image: url('fondo.jpg');</code></div>
  <div class="tag-card"><strong>background-size</strong> → Tamaño del fondo: <code>cover</code>, <code>contain</code>, <code>auto</code></div>
</div>
<h2>Formas de escribir colores</h2>
<pre class="code-sample">/* Nombre */      color: blue;
/* Hexadecimal */ color: #4dfff6;
/* RGB */         color: rgb(77, 255, 246);
/* RGBA */        color: rgba(77, 255, 246, 0.8);
/* HSL */         color: hsl(177, 100%, 65%);</pre>
<h2>Degradados</h2>
<pre class="code-sample">background: linear-gradient(90deg, #4dfff6, #63a0ff);
background: radial-gradient(circle, #ff00ff, #1c3aff);</pre>`
      },
      {
        titulo: '✍️ Misión: página colorida',
        html: `
<div class="activity-box">
  <p>Decora tu página HTML usando al menos:</p>
  <ul class="checklist">
    <li><i class="fas fa-check-circle"></i> Un degradado como fondo del <code>body</code>.</li>
    <li><i class="fas fa-check-circle"></i> Colores diferentes para títulos y párrafos.</li>
    <li><i class="fas fa-check-circle"></i> Una imagen de fondo en alguna sección.</li>
  </ul>
</div>`
      }
    ]
  },

  '2-3': {
    gradient: 'linear-gradient(90deg, #fbbf24, #f97316)',
    blobColor1: 'radial-gradient(circle, #fbbf24, #d97706)',
    blobColor2: 'radial-gradient(circle, #f97316, #dc2626)',
    pasos: [
      {
        titulo: '🔤 Tamaño y Tipo de Letra',
        html: `
<div class="info-block">
  <p>CSS te da control total sobre cómo se ven los textos en tu página: tamaño, familia de fuente, peso, estilo y alineación.</p>
</div>
<div class="tags-grid">
  <div class="tag-card"><strong>font-size</strong> → Tamaño. Ej: <code>font-size: 24px;</code> o <code>1.5rem</code></div>
  <div class="tag-card"><strong>font-family</strong> → Fuente. Ej: <code>font-family: 'Arial', sans-serif;</code></div>
  <div class="tag-card"><strong>font-weight</strong> → Grosor: <code>normal</code>, <code>bold</code>, <code>700</code></div>
  <div class="tag-card"><strong>text-align</strong> → Alineación: <code>left</code>, <code>center</code>, <code>right</code></div>
</div>
<h2>Usar Google Fonts</h2>
<pre class="code-sample">&lt;!-- En el &lt;head&gt; de tu HTML --&gt;
&lt;link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet"&gt;

/* En tu CSS */
body {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
}</pre>`
      },
      {
        titulo: '✍️ Misión: tipografía galáctica',
        html: `
<div class="activity-box">
  <p>Importa una fuente de Google Fonts (por ejemplo <strong>Orbitron</strong> o <strong>Poppins</strong>) y aplícala a tu página con diferentes tamaños y pesos para títulos, subtítulos y párrafos.</p>
</div>`
      }
    ]
  },

  '2-4': {
    gradient: 'linear-gradient(90deg, #34d399, #60a5fa)',
    blobColor1: 'radial-gradient(circle, #34d399, #059669)',
    blobColor2: 'radial-gradient(circle, #60a5fa, #2563eb)',
    pasos: [
      {
        titulo: '📐 Bordes y Márgenes',
        html: `
<div class="info-block">
  <p>CSS tiene un modelo de caja (<strong>box model</strong>) que controla el espacio alrededor y dentro de los elementos.</p>
</div>
<div class="concept-grid">
  <div class="concept-item"><span class="concept-icon">📦</span><div class="concept-title">margin</div><p class="concept-desc">Espacio exterior. Separa el elemento de los demás.</p></div>
  <div class="concept-item"><span class="concept-icon">🧱</span><div class="concept-title">border</div><p class="concept-desc">Borde visible alrededor del elemento.</p></div>
  <div class="concept-item"><span class="concept-icon">🛋️</span><div class="concept-title">padding</div><p class="concept-desc">Espacio interior. Separa el contenido del borde.</p></div>
  <div class="concept-item"><span class="concept-icon">📄</span><div class="concept-title">width/height</div><p class="concept-desc">Ancho y alto del contenido.</p></div>
</div>
<pre class="code-sample">.caja {
  width: 200px;
  padding: 20px;
  border: 3px solid #4dfff6;
  border-radius: 12px; /* esquinas redondeadas */
  margin: 10px auto;   /* centrado horizontal */
}</pre>`
      },
      {
        titulo: '✍️ Misión: diseña un recuadro',
        html: `
<div class="activity-box">
  <p>Crea un <code>&lt;div&gt;</code> y dale estilo con:</p>
  <ul class="checklist">
    <li><i class="fas fa-check-circle"></i> Un borde de tu color favorito.</li>
    <li><i class="fas fa-check-circle"></i> Bordes redondeados con <code>border-radius</code>.</li>
    <li><i class="fas fa-check-circle"></i> Padding interno para que el texto no esté pegado al borde.</li>
    <li><i class="fas fa-check-circle"></i> Un <code>box-shadow</code> para darle profundidad.</li>
  </ul>
</div>`
      }
    ]
  },

  '2-5': {
    gradient: 'linear-gradient(90deg, #818cf8, #f472b6)',
    blobColor1: 'radial-gradient(circle, #818cf8, #4338ca)',
    blobColor2: 'radial-gradient(circle, #f472b6, #be185d)',
    pasos: [
      {
        titulo: '🎀 Decorar Listas y Tablas con CSS',
        html: `
<div class="info-block">
  <p>CSS puede transformar por completo el aspecto de listas y tablas, haciéndolas más atractivas y fáciles de leer.</p>
</div>
<h2>Listas con CSS</h2>
<pre class="code-sample">ul {
  list-style: none; /* Quita los puntos */
  padding: 0;
}

ul li {
  background: rgba(77, 255, 246, 0.1);
  border-left: 4px solid #4dfff6;
  padding: 10px 16px;
  margin-bottom: 8px;
  border-radius: 0 8px 8px 0;
}</pre>
<h2>Tablas con CSS</h2>
<pre class="code-sample">table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

th {
  background: rgba(77, 255, 246, 0.15);
  color: #4dfff6;
  text-align: left;
}

tr:hover {
  background: rgba(255, 255, 255, 0.05);
}</pre>`
      },
      {
        titulo: '✍️ Misión: decoración total',
        html: `
<div class="activity-box">
  <p>Toma la lista de películas y la tabla de calificaciones que hiciste en el Módulo 1 y dales estilos CSS para que se vean profesionales.</p>
  <ul class="checklist">
    <li><i class="fas fa-check-circle"></i> Quita los puntos de la lista y agrega bordes de color.</li>
    <li><i class="fas fa-check-circle"></i> Dale zebra striping a la tabla (filas alternadas).</li>
    <li><i class="fas fa-check-circle"></i> Agrega <code>hover</code> effects a los elementos.</li>
  </ul>
</div>`
      }
    ]
  }
};

export function getLeccionContent(moduloOrden: number, leccionOrden: number | string): LeccionVistaCodiContent | undefined {
  const key = `${moduloOrden}-${leccionOrden}`;
  return LECCIONES_CONTENT[key];
}
