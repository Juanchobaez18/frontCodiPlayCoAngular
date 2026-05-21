# Índice de Archivos - Panel Docente

**Documento:** Referencia Rápida de Archivos  
**Proyecto:** CodiPlayCo - Frontend Angular  
**Fecha:** 21 de Mayo de 2026

---

## 📂 Listado Completo de Archivos

### 🗂️ Estructura de Directorios

```
src/app/
├── features/docente/
│   ├── dashboard/
│   │   ├── dashboard.component.ts              [Componente + Lógica]
│   │   ├── dashboard.component.html            [Template]
│   │   └── dashboard.component.scss            [Estilos]
│   │
│   ├── mis-cursos/
│   │   ├── mis-cursos.component.ts             [Componente + Lógica]
│   │   ├── mis-cursos.component.html           [Template]
│   │   └── mis-cursos.component.scss           [Estilos]
│   │
│   ├── estudiantes/
│   │   ├── estudiantes.component.ts            [Componente + Lógica]
│   │   ├── estudiantes.component.html          [Template]
│   │   └── estudiantes.component.scss          [Estilos]
│   │
│   ├── tareas/
│   │   ├── tareas.component.ts                 [Componente + Lógica]
│   │   ├── tareas.component.html               [Template]
│   │   └── tareas.component.scss               [Estilos]
│   │
│   ├── mensajes/
│   │   ├── mensajes.component.ts               [Componente + Lógica]
│   │   ├── mensajes.component.html             [Template]
│   │   └── mensajes.component.scss             [Estilos]
│   │
│   ├── foros/
│   │   ├── foros.component.ts                  [Componente + Lógica]
│   │   ├── foros.component.html                [Template]
│   │   └── foros.component.scss                [Estilos]
│   │
│   ├── foro-detalle/
│   │   ├── foro-detalle.component.ts           [Componente + Lógica]
│   │   ├── foro-detalle.component.html         [Template]
│   │   └── foro-detalle.component.scss         [Estilos]
│   │
│   ├── services/
│   │   └── docente-api.service.ts              [Servicio API]
│   │
│   ├── index.ts                                [Barril de exportaciones]
│   └── shared-styles.scss                      [Estilos compartidos]
│
├── core/
│   ├── components/
│   │   ├── docente-layout/
│   │   │   ├── docente-layout.component.ts     [Layout + Lógica]
│   │   │   ├── docente-layout.component.html   [Template]
│   │   │   └── docente-layout.component.scss   [Estilos]
│   │   │
│   │   └── [otros componentes...]
│   │
│   ├── routing/
│   │   ├── docente.routes.ts                   [Rutas docente]
│   │   ├── admin.routes.ts                     [Rutas admin]
│   │   ├── estudiante.routes.ts                [Rutas estudiante]
│   │   └── [otros archivos de routing]
│   │
│   ├── guards/
│   │   ├── docente.guard.ts                    [Guard docente]
│   │   ├── auth.guard.ts                       [Guard auth]
│   │   └── [otros guards]
│   │
│   └── services/
│       ├── docente-api.service.ts              [Servicio DEPRECATED]
│       ├── auth.ts                             [Servicio Auth]
│       └── [otros servicios]
│
└── app.routes.ts                               [Rutas principales]
```

---

## 📋 Descripción por Archivo

### Componentes Principales

#### 1. **dashboard.component.ts**
- **Ubicación:** `src/app/features/docente/dashboard/`
- **Líneas:** ~70
- **Responsabilidades:**
  - Mostrar perfil del docente
  - Upload de foto de perfil
  - Preview de imagen
  - Mensajes de éxito/error
- **Selector:** `app-docente-dashboard`
- **Inputs:** None
- **Outputs:** None
- **Signals:**
  - `selectedFile`
  - `filePreview`
  - `uploadMessage`
  - `uploadError`
  - `uploading`
  - `selectedFileName`

#### 2. **mis-cursos.component.ts**
- **Ubicación:** `src/app/features/docente/mis-cursos/`
- **Líneas:** ~100
- **Responsabilidades:**
  - Cargar cursos del docente
  - Mostrar progreso de estudiantes
  - Mostrar progreso por módulo/lección
  - Cálculos de estados
- **Selector:** `app-mis-cursos`
- **Signals:**
  - `cursos`
  - `cursosLoading`
  - `cursosError`
  - `cursosDetalle`
  - `detalleLoading`

#### 3. **estudiantes.component.ts**
- **Ubicación:** `src/app/features/docente/estudiantes/`
- **Líneas:** ~40
- **Responsabilidades:**
  - Listar estudiantes
  - Mostrar progreso
  - Información de contacto
- **Selector:** `app-estudiantes`
- **Signals:**
  - `estudiantes`
  - `estudiantesLoading`
  - `estudiantesError`

#### 4. **tareas.component.ts**
- **Ubicación:** `src/app/features/docente/tareas/`
- **Líneas:** ~60
- **Responsabilidades:**
  - Cargar tareas
  - Calificar entregas
  - Mostrar estado de entregas
- **Selector:** `app-tareas`
- **Signals:**
  - `tareas`
  - `tareasLoading`
  - `tareasError`
  - `calificando`

#### 5. **mensajes.component.ts**
- **Ubicación:** `src/app/features/docente/mensajes/`
- **Líneas:** ~120
- **Responsabilidades:**
  - Enviar mensajes
  - Ver mensajes enviados
  - Ver mensajes recibidos
  - Gestionar tabs
- **Selector:** `app-mensajes`
- **Signals:**
  - `mensajesTab`
  - `mensajesEnviados`
  - `mensajesRecibidos`
  - `mensajesLoading`
  - `mensajeSending`
  - `estudiantes`
  - `estudiantesLoading`
  - `mensajeDestinatarioId`
  - `mensajeBody`
  - `successMessage`
  - `errorMessage`

#### 6. **foros.component.ts**
- **Ubicación:** `src/app/features/docente/foros/`
- **Líneas:** ~150+
- **Responsabilidades:**
  - Crear foros
  - Editar foros (modal)
  - Eliminar foros
  - Listar foros por curso
- **Selector:** `app-foros`
- **Signals:**
  - `cursos`
  - `forosData`
  - `forosLoading`
  - `forosError`
  - `nuevoTitulo`
  - `nuevaDescripcion`
  - `nuevoCursoId`
  - `creando`
  - `modalOpen`
  - `editarForoId`
  - `editarTitulo`
  - `editarDescripcion`
  - `editando`
  - `successMessage`
  - `errorMessage`

#### 7. **foro-detalle.component.ts**
- **Ubicación:** `src/app/features/docente/foro-detalle/`
- **Líneas:** ~60
- **Responsabilidades:**
  - Mostrar detalles del foro
  - Listar respuestas de estudiantes
  - Navegar de vuelta
- **Selector:** `app-foro-detalle`
- **Signals:**
  - `foro`
  - `respuestas`
  - `loading`
  - `error`
  - `foroId`

#### 8. **docente-layout.component.ts**
- **Ubicación:** `src/app/core/components/docente-layout/`
- **Líneas:** ~150+
- **Responsabilidades:**
  - Layout general del panel
  - Sidebar y navegación
  - Toggle tema oscuro/claro
  - Información del usuario
- **Selector:** `app-docente-layout`
- **Signals:**
  - `docentePanelView`
  - `isDarkMode`
  - `misCursosSig`
  - `cursosLoading`
- **Computed:**
  - `userDisplayName`
  - `userRoleLabel`
  - `userEmail`
  - `userDocNumber`
  - `userInitial`
  - `misStats`

---

### Servicios

#### **docente-api.service.ts**
- **Ubicación:** `src/app/features/docente/services/`
- **Líneas:** ~200+
- **Responsabilidades:**
  - Centralizar todas las llamadas HTTP
  - Manejo de DTOs
  - Configuración de endpoints
- **ProvidedIn:** 'root'
- **Inyecciones:**
  - `HttpClient`

**Métodos públicos:**
```
// Dashboard
getDashboardStats(): Observable<DocenteDashboardStats>

// Cursos
getCursos(): Observable<DocenteCurso[]>
getCursoDetalle(cursoId: number): Observable<CursoDetalle>

// Estudiantes
getEstudiantes(): Observable<DocenteEstudiante[]>

// Tareas
getTareas(): Observable<DocenteTarea[]>
calificarTarea(entregaId: number, resultado: string): Observable<any>

// Mensajes
getMensajes(): Observable<DocenteMensaje[]>
getMensajesEnviados(): Observable<DocenteMensaje[]>
getMensajesRecibidos(): Observable<DocenteMensaje[]>
sendMensaje(dto: SendMensajeDto): Observable<any>

// Foros
getForos(): Observable<DocenteForo[]>
getForoById(foroId: number): Observable<DocenteForo>
createForo(dto: CreateForoDto): Observable<DocenteForo>
updateForo(foroId: number, dto: UpdateForoDto): Observable<DocenteForo>
deleteForo(foroId: number): Observable<any>
getForoRespuestas(foroId: number): Observable<ForoRespuesta[]>

// Perfil
uploadFotoPerfil(file: File): Observable<any>
```

---

### Rutas y Configuración

#### **docente.routes.ts**
- **Ubicación:** `src/app/core/routing/`
- **Líneas:** ~90
- **Responsabilidades:**
  - Definir rutas del panel docente
  - Incluir redirects legacy
  - Aplicar guards
- **Exports:**
  - `DOCENTE_ROUTES: Routes`
  - `DOCENTE_LEGACY_REDIRECTS: Routes`

**Rutas principales definidas:**
```
/docente/dashboard
/docente/mis-cursos
/docente/mis-cursos/:id/editar
/docente/estudiantes
/docente/tareas
/docente/mensajes
/docente/foros
/docente/foros/:id
/docente (redirect)
```

#### **app.routes.ts**
- **Ubicación:** `src/app/`
- **Líneas:** ~60+
- **Responsabilidades:**
  - Definir rutas principales de la app
  - Cargar rutas de módulos
  - Definir rutas públicas
- **Imports:**
  - `ADMIN_ROUTES`
  - `DOCENTE_ROUTES`
  - `ESTUDIANTE_ROUTES`

---

### Guards

#### **docente.guard.ts**
- **Ubicación:** `src/app/core/guards/`
- **Líneas:** ~25
- **Responsabilidades:**
  - Verificar autenticación
  - Verificar rol "docente"
  - Verificar usuario activo
- **Type:** `CanActivateFn`
- **Retorna:**
  - `true` - Acceso permitido
  - `false` - Redirecciona a /auth/login

**Verificaciones:**
```
1. isAuthenticated()
2. isDocente() - rol contiene "docente"
3. isActive() - isActive === true
```

---

### Interfaces/DTOs

#### **docente-api.service.ts** (Interfaces exportadas)
- `DocenteDashboardStats`
- `DocenteCurso`
- `CursoDetalle`
- `EstudianteProgreso`
- `ModuloDetalle`
- `LeccionDetalle`
- `DocenteEstudiante`
- `DocenteTarea`
- `TareaEntrega`
- `DocenteMensaje`
- `DocenteForo`
- `ForoRespuesta`
- `CreateForoDto`
- `UpdateForoDto`
- `SendMensajeDto`

---

### Templates HTML

#### **dashboard.component.html**
- **Líneas:** ~100
- **Elementos principales:**
  - Foto de perfil (avatar)
  - Saludo personalizado
  - Información del usuario
  - Formulario de upload
  - Preview de imagen

#### **mis-cursos.component.html**
- **Líneas:** ~150+
- **Elementos principales:**
  - Header con título
  - Tabla 1: Progreso general
  - Tabla 2: Progreso por módulo
  - Barras de progreso
  - Estados visuales

#### **tareas.component.html**
- **Líneas:** ~100+
- **Elementos principales:**
  - Header con título
  - Por cada tarea: información + tabla entregas
  - Tabla con datos de estudiante y calificación
  - Botones Aprobar/No Aprobar

#### **mensajes.component.html**
- **Líneas:** ~150+
- **Elementos principales:**
  - 3 Tabs (Enviar, Enviados, Recibidos)
  - Formulario de envío
  - Listados de mensajes
  - Selectores de destinatario

#### **foros.component.html**
- **Líneas:** ~180+
- **Elementos principales:**
  - Formulario crear foro
  - Listado de foros (agrupado por curso)
  - Acciones (Editar, Ver respuestas, Eliminar)
  - Modal de edición

#### **estudiantes.component.html**
- **Líneas:** ~60
- **Elementos principales:**
  - Tabla de estudiantes
  - Información: Nombre, Email, Cursos, Progreso
  - Barra de progreso

#### **foro-detalle.component.html**
- **Líneas:** ~50
- **Elementos principales:**
  - Botón volver
  - Información del foro
  - Listado de respuestas

#### **docente-layout.component.html**
- **Líneas:** ~200+
- **Elementos principales:**
  - Sidebar con navegación
  - Logo y marca
  - Perfil del usuario
  - Links de navegación
  - Router outlet
  - Toggle de tema

---

### Estilos SCSS

#### **dashboard.component.scss**
- Estilos para panel de bienvenida
- Estilos para formulario de upload
- Estilos para foto de perfil

#### **mis-cursos.component.scss**
- Estilos para tablas
- Estilos para barras de progreso
- Estilos para estados

#### **tareas.component.scss**
- Estilos para tablas de entregas
- Estilos para botones de calificación

#### **mensajes.component.scss**
- Estilos para tabs
- Estilos para formulario
- Estilos para listados

#### **foros.component.scss**
- Estilos para formulario
- Estilos para listado de foros
- Estilos para modal

#### **estudiantes.component.scss**
- Estilos para tabla
- Estilos para barras de progreso

#### **foro-detalle.component.scss**
- Estilos para información del foro
- Estilos para respuestas

#### **docente-layout.component.scss**
- Estilos para sidebar
- Estilos para navegación
- Estilos para usuario
- Media queries para responsive

#### **shared-styles.scss**
- Estilos compartidos
- Variables comunes
- Mixins reutilizables

---

## 🔍 Mapeo de Funcionalidades a Archivos

### Funcionalidad: Ver Dashboard
```
Route: /docente/dashboard
Component: src/app/features/docente/dashboard/dashboard.component.ts
Template: src/app/features/docente/dashboard/dashboard.component.html
Styles: src/app/features/docente/dashboard/dashboard.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
```

### Funcionalidad: Ver Cursos y Progreso
```
Route: /docente/mis-cursos
Component: src/app/features/docente/mis-cursos/mis-cursos.component.ts
Template: src/app/features/docente/mis-cursos/mis-cursos.component.html
Styles: src/app/features/docente/mis-cursos/mis-cursos.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
Métodos: getCursos(), getCursoDetalle()
```

### Funcionalidad: Calificar Tareas
```
Route: /docente/tareas
Component: src/app/features/docente/tareas/tareas.component.ts
Template: src/app/features/docente/tareas/tareas.component.html
Styles: src/app/features/docente/tareas/tareas.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
Métodos: getTareas(), calificarTarea()
```

### Funcionalidad: Enviar Mensajes
```
Route: /docente/mensajes
Component: src/app/features/docente/mensajes/mensajes.component.ts
Template: src/app/features/docente/mensajes/mensajes.component.html
Styles: src/app/features/docente/mensajes/mensajes.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
Métodos: getEstudiantes(), getMensajes(), sendMensaje()
```

### Funcionalidad: Gestionar Foros
```
Route: /docente/foros
Component: src/app/features/docente/foros/foros.component.ts
Template: src/app/features/docente/foros/foros.component.html
Styles: src/app/features/docente/foros/foros.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
Métodos: getCursos(), getForos(), createForo(), updateForo(), deleteForo()
```

### Funcionalidad: Ver Detalles del Foro
```
Route: /docente/foros/:id
Component: src/app/features/docente/foro-detalle/foro-detalle.component.ts
Template: src/app/features/docente/foro-detalle/foro-detalle.component.html
Styles: src/app/features/docente/foro-detalle/foro-detalle.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
Métodos: getForoById(), getForoRespuestas()
```

### Funcionalidad: Ver Estudiantes
```
Route: /docente/estudiantes
Component: src/app/features/docente/estudiantes/estudiantes.component.ts
Template: src/app/features/docente/estudiantes/estudiantes.component.html
Styles: src/app/features/docente/estudiantes/estudiantes.component.scss
Service: src/app/features/docente/services/docente-api.service.ts
Métodos: getEstudiantes()
```

---

## 📊 Estadísticas de Código

| Tipo | Cantidad | Total Líneas |
|------|----------|--------------|
| Componentes TS | 8 | ~700 |
| Templates HTML | 8 | ~1,000+ |
| Servicios | 1 | ~200 |
| Rutas | 1 | ~90 |
| Guards | 1 | ~25 |
| Estilos SCSS | 8 | ~500+ |
| **TOTAL** | **27** | **~2,500+** |

---

## 🔗 Importaciones Comunes

### En Componentes
```typescript
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DocenteApiService } from '../services/docente-api.service';
import { Auth } from '../../../core/services/auth';
import Swal from 'sweetalert2';
```

### En Servicios
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
```

### En Guards
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs';
```

---

## 💾 Configuraciones de Proyecto

### Angular Configuration
- **Angular Version:** 17+ (Latest)
- **TypeScript:** Strict mode
- **Component Style:** Standalone components
- **Reactivity:** Signals API
- **Styling:** SCSS

### Dependencies
- `@angular/core`
- `@angular/common`
- `@angular/forms`
- `@angular/router`
- `@angular/platform-browser`
- `lucide-angular` (Icons)
- `sweetalert2` (Modals)
- `rxjs` (Reactive)

---

## 📝 Convenciones de Nombres

### Componentes
```
{feature}.component.ts
{feature}.component.html
{feature}.component.scss
```

### Servicios
```
{domain}-{entity}.service.ts
Ejemplo: docente-api.service.ts
```

### Guards
```
{role}.guard.ts
Ejemplo: docente.guard.ts
```

### Rutas
```
{role}.routes.ts
Ejemplo: docente.routes.ts
```

### Interfaces/DTOs
```
{Entity}{Purpose}
Ejemplo: DocenteCurso, CreateForoDto
```

### Signals
```
camelCase: nombreSignal = signal()
```

---

## 🗂️ Estructura de Carpetas por Tipo

### Por Funcionalidad
```
features/docente/
├── dashboard/
├── mis-cursos/
├── estudiantes/
├── tareas/
├── mensajes/
├── foros/
├── foro-detalle/
└── services/
```

### Por Tipo
```
core/
├── components/
│   └── docente-layout/
├── guards/
│   └── docente.guard.ts
├── routing/
│   └── docente.routes.ts
└── services/
```

---

## 📞 Documentación Relacionada

- **Exploración Completa:** `PANEL_DOCENTE_EXPLORACION.md`
- **Resumen Ejecutivo:** `PANEL_DOCENTE_RESUMEN.md`
- **Endpoints Requeridos:** `ENDPOINTS_REQUERIDOS.md`
- **Diagramas de Arquitectura:** `ARQUITECTURA_DIAGRAMAS.md`

---

_Documento generado: 21 de Mayo de 2026_
_Exploración exhaustiva del panel docente del frontend Angular_
