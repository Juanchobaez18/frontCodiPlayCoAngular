# Exploración Completa: Panel Docente - Frontend Angular

**Fecha:** Mayo 21, 2026  
**Proyecto:** CodiPlayCo - Frontend Angular  
**Carpeta Base:** `src/app/features/docente/` y `src/app/core/`

---

## 📋 Tabla de Contenidos

1. [Estructura General](#estructura-general)
2. [Componentes Encontrados](#componentes-encontrados)
3. [Sistema de Rutas](#sistema-de-rutas)
4. [Servicio API](#servicio-api)
5. [Modelos de Datos (DTOs/Interfaces)](#modelos-de-datos)
6. [Endpoints Backend Esperados](#endpoints-backend-esperados)
7. [Funcionalidades por Vista](#funcionalidades-por-vista)
8. [Seguridad y Guards](#seguridad-y-guards)
9. [Archivos HTML](#archivos-html)
10. [Estado Actual y TODOs](#estado-actual-y-todos)

---

## 🏗️ Estructura General

### Árbol de carpetas principal

```
src/app/
├── features/docente/
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.scss
│   ├── mis-cursos/
│   │   ├── mis-cursos.component.ts
│   │   ├── mis-cursos.component.html
│   │   └── mis-cursos.component.scss
│   ├── estudiantes/
│   │   ├── estudiantes.component.ts
│   │   ├── estudiantes.component.html
│   │   └── estudiantes.component.scss
│   ├── tareas/
│   │   ├── tareas.component.ts
│   │   ├── tareas.component.html
│   │   └── tareas.component.scss
│   ├── mensajes/
│   │   ├── mensajes.component.ts
│   │   ├── mensajes.component.html
│   │   └── mensajes.component.scss
│   ├── foros/
│   │   ├── foros.component.ts
│   │   ├── foros.component.html
│   │   └── foros.component.scss
│   ├── foro-detalle/
│   │   ├── foro-detalle.component.ts
│   │   ├── foro-detalle.component.html
│   │   └── foro-detalle.component.scss
│   ├── services/
│   │   └── docente-api.service.ts
│   ├── index.ts
│   └── shared-styles.scss
├── core/
│   ├── components/docente-layout/
│   │   ├── docente-layout.component.ts
│   │   ├── docente-layout.component.html
│   │   └── docente-layout.component.scss
│   ├── guards/docente.guard.ts
│   ├── routing/docente.routes.ts
│   └── services/docente-api.service.ts (¡Deprecated!)
```

---

## 🧩 Componentes Encontrados

### 1. **DocenteLayoutComponent**
- **Ubicación:** `src/app/core/components/docente-layout/`
- **Selector:** `app-docente-layout`
- **Tipo:** Layout (Standalone)
- **Responsabilidades:**
  - Layout general del panel docente
  - Sidebar con navegación principal
  - Perfil de usuario y logout
  - Toggle tema oscuro/claro
  - Gestión de vista actual (dashboard, mis-cursos, etc.)
- **Rutas internas de navegación:**
  - `/docente/dashboard`
  - `/docente/mis-cursos`
  - `/docente/estudiantes`
  - `/docente/tareas`
  - `/docente/mensajes`
  - `/docente/foros`

### 2. **DashboardComponent**
- **Ubicación:** `src/app/features/docente/dashboard/`
- **Selector:** `app-docente-dashboard`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/dashboard`
- **Funcionalidades:**
  - Bienvenida personalizada con nombre del docente
  - Información del usuario (nombre, email, documento)
  - **Upload de foto de perfil** (feature principal)
  - Preview de imagen antes de subir
  - Mensajes de error/éxito
  - Estado de carga durante upload
- **Servicios usados:**
  - `Auth` (para obtener datos del usuario)
  - `DocenteApiService` (para upload)
- **Signals usados:**
  - `selectedFile`: Archivo seleccionado
  - `filePreview`: Preview de la imagen
  - `uploadMessage`: Mensaje de éxito
  - `uploadError`: Mensaje de error
  - `uploading`: Estado de carga
  - `selectedFileName`: Nombre del archivo

### 3. **MisCursosComponent**
- **Ubicación:** `src/app/features/docente/mis-cursos/`
- **Selector:** `app-mis-cursos`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/mis-cursos`
- **Funcionalidades:**
  - Listado de cursos asignados al docente
  - **Progreso General de Estudiantes** (por curso)
  - **Progreso Detallado por Módulo**
  - Tabla interactiva con barras de progreso
  - Estados: Completado, En progreso, Iniciando
  - Iconos representativos de estado
  - Carga de detalles por curso
- **Interfaces principales:**
  - `DocenteCurso`
  - `CursoDetalle`
  - `EstudianteProgreso`
  - `ModuloDetalle`
  - `LeccionDetalle`
- **Métodos destacados:**
  - `loadCursos()`: Carga lista de cursos
  - `loadCursoDetalle(cursoId)`: Carga detalles del curso
  - `getEstadoClass()`: Retorna clase CSS según progreso
  - `getEstadoLabel()`: Retorna etiqueta de estado
  - `getEstadoIcon()`: Retorna icono de estado

### 4. **TareasComponent**
- **Ubicación:** `src/app/features/docente/tareas/`
- **Selector:** `app-tareas`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/tareas`
- **Funcionalidades:**
  - Listado de tareas/actividades
  - **Calificación de entregas de estudiantes**
  - Estados de entrega
  - Información de módulo y lección
  - Fechas de vencimiento
  - Acciones de calificación (APROBADO/NO_APROBADO)
- **Interface:** `DocenteTarea`
  - id, titulo, descripcion
  - fechaVencimiento, fechaCreacion
  - estudiantes, estado, modulo, leccion
  - entregas (array de `TareaEntrega`)
- **Métodos destacados:**
  - `loadTareas()`: Carga tareas
  - `calificar(entregaId, resultado)`: Envía calificación
  - `isCalificando(entregaId)`: Verifica si está calificando

### 5. **MensajesComponent**
- **Ubicación:** `src/app/features/docente/mensajes/`
- **Selector:** `app-mensajes`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/mensajes`
- **Funcionalidades:**
  - Sistema de mensajería interna
  - **3 Tabs principales:**
    1. **Enviar:** Formulario para enviar mensajes a estudiantes
    2. **Enviados:** Historial de mensajes enviados
    3. **Recibidos:** Historial de mensajes recibidos
  - Selector de destinatarios (estudiantes)
  - Textarea para redacción
  - Notificaciones de éxito/error
- **Interfaces principales:**
  - `DocenteMensaje`
  - `DocenteEstudiante`
  - `SendMensajeDto`
- **Métodos destacados:**
  - `loadEstudiantes()`: Carga lista de estudiantes
  - `loadMensajes()`: Carga mensajes (enviados y recibidos)
  - `enviarMensaje()`: Envía nuevo mensaje
  - `setMensajesTab(tab)`: Cambia de pestaña

### 6. **ForosComponent**
- **Ubicación:** `src/app/features/docente/foros/`
- **Selector:** `app-foros`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/foros`
- **Funcionalidades:**
  - **Crear nuevos foros**
  - **Editar foros existentes** (modal)
  - **Eliminar foros**
  - Agrupar foros por curso
  - Ver cantidad de respuestas por foro
  - Modal para edición con validaciones
- **Interfaces principales:**
  - `DocenteForo`
  - `CreateForoDto`
  - `UpdateForoDto`
- **Métodos destacados:**
  - `loadData()`: Carga cursos y foros
  - `crearForo()`: Crea nuevo foro
  - `abrirEditar(foro)`: Abre modal de edición
  - `guardarEdicion()`: Guarda cambios del foro
  - `eliminarForo(foro)`: Elimina un foro
  - `verRespuestas(foroId)`: Navega a detalle del foro
  - `getForosPorCurso()`: Agrupa foros por curso

### 7. **ForoDetalleComponent**
- **Ubicación:** `src/app/features/docente/foro-detalle/`
- **Selector:** `app-foro-detalle`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/foros/:id`
- **Funcionalidades:**
  - Muestra detalles de un foro específico
  - **Lista de respuestas de estudiantes**
  - Información del foro (título, descripción, fecha)
  - Botón para volver a foros
- **Interfaces principales:**
  - `DocenteForo`
  - `ForoRespuesta`
- **Métodos destacados:**
  - `loadForo(foroId)`: Carga datos del foro
  - `loadRespuestas(foroId)`: Carga respuestas
  - `volverAForos()`: Navega a /docente/foros

### 8. **EstudiantesComponent**
- **Ubicación:** `src/app/features/docente/estudiantes/`
- **Selector:** `app-estudiantes`
- **Tipo:** Vista (Standalone)
- **URL:** `/docente/estudiantes`
- **Funcionalidades:**
  - Listado de todos los estudiantes
  - Información: nombre, email, cantidad de cursos
  - **Barra de progreso general**
  - Tabla interactiva
- **Interface:** `DocenteEstudiante`
  - id, nombre, apellido, email
  - cursos (array de nombres)
  - progreso (porcentaje)
- **Métodos destacados:**
  - `loadEstudiantes()`: Carga lista de estudiantes

---

## 🛣️ Sistema de Rutas

### Archivo: `src/app/core/routing/docente.routes.ts`

#### Rutas Legacy (Redirects desde Spring/Thymeleaf)
```
/InterfazDocente/paneldocente → /docente/dashboard
/InterfazDocente/MisCursos.html → /docente/mis-cursos
/InterfazDocente/Tareas.html → /docente/tareas
/InterfazDocente/Mensajes.html → /docente/mensajes
/InterfazDocente/Foros.html → /docente/foros
/InterfazDocente/logout → /auth/login
```

#### Rutas Principales
```typescript
DOCENTE_ROUTES = [
  // Editar curso
  {
    path: 'docente/mis-cursos/:id/editar',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard],
    data: { mode: 'edit' }
  },
  
  // Mis Cursos
  {
    path: 'docente/mis-cursos',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  
  // Estudiantes
  {
    path: 'docente/estudiantes',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  
  // Tareas
  {
    path: 'docente/tareas',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  
  // Mensajes
  {
    path: 'docente/mensajes',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  
  // Foros (con y sin ID)
  {
    path: 'docente/foros/:id',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  {
    path: 'docente/foros',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  
  // Dashboard (default)
  {
    path: 'docente/dashboard',
    component: DocenteLayoutComponent,
    canActivate: [docenteGuard]
  },
  
  // Redirect default
  {
    path: 'docente',
    pathMatch: 'full',
    redirectTo: '/docente/dashboard'
  }
];
```

### Orden de especificidad
1. `/docente/mis-cursos/:id/editar` (más específica)
2. `/docente/mis-cursos`
3. `/docente/foros/:id`
4. `/docente/foros`
5. `/docente/dashboard`
6. `/docente` (redirect)

---

## 🔌 Servicio API

### Archivo: `src/app/features/docente/services/docente-api.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class DocenteApiService {
  private readonly http = inject(HttpClient);
  private readonly docenteUrl = `http://localhost:3000/docente`;
  private readonly forosUrl = `http://localhost:3000/foros`;
  private readonly mensajesUrl = `http://localhost:3000/mensajes`;
  
  // Métodos implementados...
}
```

### Métodos disponibles

#### Dashboard
```typescript
getDashboardStats(): Observable<DocenteDashboardStats>
// GET /docente/dashboard/stats
```

#### Cursos
```typescript
getCursos(): Observable<DocenteCurso[]>
// GET /docente/cursos

getCursoDetalle(cursoId: number): Observable<CursoDetalle>
// GET /docente/cursos/{cursoId}
```

#### Estudiantes
```typescript
getEstudiantes(): Observable<DocenteEstudiante[]>
// GET /docente/estudiantes
```

#### Tareas
```typescript
getTareas(): Observable<DocenteTarea[]>
// GET /docente/tareas

calificarTarea(entregaId: number, resultado: string): Observable<any>
// POST /docente/tareas/calificar
// Body: { entregaId, calificacion, resultado }
```

#### Mensajes
```typescript
getMensajes(): Observable<DocenteMensaje[]>
// GET /docente/mensajes

getMensajesEnviados(): Observable<DocenteMensaje[]>
// GET /docente/mensajes (similar)

getMensajesRecibidos(): Observable<DocenteMensaje[]>
// GET /docente/mensajes (similar)

sendMensaje(dto: SendMensajeDto): Observable<any>
// POST /docente/mensajes
// Body: { destinatarioId, contenido }
```

#### Foros
```typescript
getForos(): Observable<DocenteForo[]>
// GET /docente/foros

getForoById(foroId: number): Observable<DocenteForo>
// GET /foros/{foroId}

createForo(dto: CreateForoDto): Observable<DocenteForo>
// POST /foros
// Body: { titulo, descripcion, cursoId }

updateForo(foroId: number, dto: UpdateForoDto): Observable<DocenteForo>
// PUT /foros/{foroId}
// Body: { titulo?, descripcion? }

deleteForo(foroId: number): Observable<any>
// DELETE /foros/{foroId}

getForoRespuestas(foroId: number): Observable<ForoRespuesta[]>
// GET /foros/{foroId}/respuestas
```

#### Perfil
```typescript
uploadFotoPerfil(file: File): Observable<any>
// POST /docente/subir-foto (FormData)
// Form field: 'foto' (archivo)
```

---

## 📦 Modelos de Datos (DTOs/Interfaces)

### DocenteDashboardStats
```typescript
interface DocenteDashboardStats {
  totalEstudiantes: number;
  totalCursosActivos: number;
  tasaCompletacion: number;
}
```

### DocenteCurso
```typescript
interface DocenteCurso {
  id: number;
  nombre: string;
  descripcion: string;
  estudiantes: number;
  progreso: number;
  estado: boolean;
}
```

### CursoDetalle
```typescript
interface CursoDetalle {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  estudiantes: EstudianteProgreso[];
  modulos: ModuloDetalle[];
}
```

### EstudianteProgreso
```typescript
interface EstudianteProgreso {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  progreso: number;
  estado: 'completado' | 'en_progreso' | 'iniciando';
  moduloActual?: string;
  leccionActual?: string;
  progresoModulo?: number;
}
```

### ModuloDetalle
```typescript
interface ModuloDetalle {
  id: number;
  nombre: string;
  orden: number;
  lecciones: LeccionDetalle[];
}
```

### LeccionDetalle
```typescript
interface LeccionDetalle {
  id: number;
  nombre: string;
  orden: number;
}
```

### DocenteEstudiante
```typescript
interface DocenteEstudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cursos: string[];
  progreso: number;
}
```

### DocenteTarea
```typescript
interface DocenteTarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaVencimiento: string;
  fechaCreacion?: string;
  estudiantes: number;
  estado: string;
  modulo?: string;
  leccion?: string;
  entregas?: TareaEntrega[];
}
```

### TareaEntrega
```typescript
interface TareaEntrega {
  id: number;
  estudianteNombre: string;
  estudianteApellido?: string;
  estado: string;
  calificacion: string;
}
```

### DocenteMensaje
```typescript
interface DocenteMensaje {
  id: number;
  remitente: string;
  destinatario?: string;
  asunto: string;
  contenido?: string;
  fecha: string;
  leido: boolean;
  tipo?: 'enviado' | 'recibido';
}
```

### DocenteForo
```typescript
interface DocenteForo {
  id: number;
  titulo: string;
  descripcion: string;
  cursoId: number;
  cursoNombre?: string;
  fechaCreacion?: string;
  cantidadRespuestas?: number;
}
```

### ForoRespuesta
```typescript
interface ForoRespuesta {
  id: number;
  mensaje: string;
  estudianteNombre: string;
  estudianteApellido?: string;
  fechaCreacion: string;
}
```

### DTOs de Entrada

#### CreateForoDto
```typescript
interface CreateForoDto {
  titulo: string;
  descripcion: string;
  cursoId: number;
}
```

#### UpdateForoDto
```typescript
interface UpdateForoDto {
  titulo?: string;
  descripcion?: string;
}
```

#### SendMensajeDto
```typescript
interface SendMensajeDto {
  destinatarioId: number;
  contenido: string;
}
```

---

## 🌐 Endpoints Backend Esperados

### Base URL
```
http://localhost:3000
```

### Endpoints por módulo

#### Dashboard
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/docente/dashboard/stats` | Obtener estadísticas del panel |

#### Cursos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/docente/cursos` | Listar todos los cursos del docente |
| GET | `/docente/cursos/:id` | Obtener detalles de un curso |

#### Estudiantes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/docente/estudiantes` | Listar estudiantes del docente |

#### Tareas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/docente/tareas` | Listar tareas del docente |
| POST | `/docente/tareas/calificar` | Calificar una entrega |

#### Mensajes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/docente/mensajes` | Listar mensajes (enviados y recibidos) |
| POST | `/docente/mensajes` | Enviar un nuevo mensaje |

#### Foros
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/docente/foros` | Listar foros del docente |
| GET | `/foros/:id` | Obtener un foro específico |
| POST | `/foros` | Crear un nuevo foro |
| PUT | `/foros/:id` | Actualizar un foro |
| DELETE | `/foros/:id` | Eliminar un foro |
| GET | `/foros/:id/respuestas` | Obtener respuestas de un foro |

#### Perfil
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/docente/subir-foto` | Subir foto de perfil (FormData) |

---

## ⚙️ Funcionalidades por Vista

### Dashboard (`/docente/dashboard`)
**Descripción:** Página de bienvenida y perfil del docente

**Funcionalidades:**
- ✅ Saludo personalizado con nombre y rol
- ✅ Información del usuario (nombre, email, documento)
- ✅ Upload y preview de foto de perfil
- ✅ Mensajes de éxito/error
- ✅ Validaciones de archivo

**Estados visuales:**
- Foto cargada (preview mostrado)
- Foto no cargada (icono por defecto)
- Upload en progreso (botón deshabilitado, spinner)
- Upload exitoso (mensaje verde)
- Upload fallido (mensaje rojo)

---

### Mis Cursos (`/docente/mis-cursos`)
**Descripción:** Visualización de cursos asignados y progreso de estudiantes

**Funcionalidades:**
- ✅ Listado de cursos del docente
- ✅ Progreso general de estudiantes por curso
- ✅ Progreso detallado por módulo y lección
- ✅ Estados visuales: Completado, En progreso, Iniciando
- ✅ Barras de progreso interactivas
- ✅ Carga asíncrona de detalles

**Información mostrada:**
- **Tabla 1 - Progreso General:**
  - Nombre estudiante
  - Porcentaje progreso (0-100%)
  - Estado con icono
  
- **Tabla 2 - Detalles por Módulo:**
  - Nombre estudiante
  - Módulo actual
  - Lección actual
  - Progreso del módulo

---

### Tareas (`/docente/tareas`)
**Descripción:** Gestión y calificación de tareas

**Funcionalidades:**
- ✅ Listado de tareas/actividades
- ✅ Información de módulo y lección
- ✅ Fechas de creación y vencimiento
- ✅ Tabla de entregas con estado
- ✅ **Calificación de entregas** (APROBADO/NO_APROBADO)
- ✅ Indicadores de carga durante calificación

**Campos por tarea:**
- Título
- Descripción
- Módulo
- Lección
- Fecha de creación
- Fecha de vencimiento
- Número de estudiantes
- Estado general

**Campos por entrega:**
- Nombre estudiante
- Estado de entrega
- Calificación
- Botones de acción (Aprobar/No Aprobar)

---

### Mensajes (`/docente/mensajes`)
**Descripción:** Sistema de mensajería interna entre docentes y estudiantes

**Funcionalidades (3 Tabs):**

1. **Enviar Mensaje**
   - ✅ Selector de destinatarios (estudiantes)
   - ✅ Textarea para redactar mensaje
   - ✅ Validaciones de campos obligatorios
   - ✅ Feedback de envío en progreso
   - ✅ Limpiar formulario tras envío exitoso

2. **Mensajes Enviados**
   - ✅ Historial de mensajes enviados
   - ✅ Información: destinatario, fecha, contenido
   - ✅ Estado de carga

3. **Mensajes Recibidos**
   - ✅ Historial de mensajes recibidos
   - ✅ Información: remitente, fecha, contenido
   - ✅ Indicador de lectura (leído/no leído)

**Datos cargados:**
- Lista de estudiantes para selector
- Mensajes enviados y recibidos

---

### Foros (`/docente/foros`)
**Descripción:** Gestión de foros de discusión por curso

**Funcionalidades:**

1. **Crear Foro**
   - ✅ Formulario con campos: Tema, Curso, Descripción
   - ✅ Selector de curso (dropdown)
   - ✅ Validaciones de campos obligatorios
   - ✅ Feedback de creación en progreso
   - ✅ Limpiar formulario tras creación exitosa

2. **Listado de Foros**
   - ✅ Agrupados por curso
   - ✅ Información: Título, Descripción, Fecha
   - ✅ Contador de respuestas
   - ✅ Acciones: Editar, Ver respuestas, Eliminar

3. **Modal Editar Foro**
   - ✅ Campos editables: Título, Descripción
   - ✅ Validaciones
   - ✅ Feedback en progreso
   - ✅ Cerrar modal al guardar

**Estados visuales:**
- Loading: "Cargando foros…"
- Vacío: "No hay foros registrados"
- Errores: Mensajes en rojo
- Éxito: Mensajes en verde

---

### Foro Detalle (`/docente/foros/:id`)
**Descripción:** Visualización detallada de un foro y sus respuestas

**Funcionalidades:**
- ✅ Información del foro (título, descripción, fecha)
- ✅ Listado de respuestas de estudiantes
- ✅ Información por respuesta: Autor, fecha, mensaje
- ✅ Botón para volver a foros
- ✅ Manejo de errores y estados de carga

**Estados visuales:**
- Loading: "Cargando foro…"
- Error: Mensaje de error con ícono
- Vacío: "No hay respuestas todavía en este foro"
- Respuestas: Listado con información

---

### Estudiantes (`/docente/estudiantes`)
**Descripción:** Vista general de todos los estudiantes

**Funcionalidades:**
- ✅ Tabla con lista de estudiantes
- ✅ Información: Nombre, Email, Cantidad de cursos
- ✅ Barra de progreso general por estudiante
- ✅ Porcentaje de progreso
- ✅ Estados de carga y vacío

**Información mostrada:**
- Nombre completo (nombre + apellido)
- Email
- Cantidad de cursos inscritos
- Progreso general (0-100%)
- Barra visual de progreso

---

## 🔒 Seguridad y Guards

### Archivo: `src/app/core/guards/docente.guard.ts`

```typescript
export const docenteGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Verificaciones:
  1. ¿Usuario autenticado?
  2. ¿Rol contiene "docente"?
  3. ¿Usuario activo (isActive === true)?
  
  if (!authenticated || !isDocente || !isActive)
    → Redirigir a /auth/login
    → Retornar false
}
```

### Requisitos
- **Autenticación:** Usuario debe estar logueado
- **Rol:** Usuario debe tener rol que incluya "docente"
- **Estado:** Usuario debe estar activo (isActive = true)
- **Fallback:** Si falla cualquier verificación → `/auth/login`

### Aplicadas en
Todas las rutas bajo `/docente/*` utilizan `canActivate: [docenteGuard]`

---

## 📄 Archivos HTML

### dashboard.component.html
- Panel de bienvenida con imagen
- Datos del usuario (nombre, email, documento)
- Formulario de upload con preview
- Mensajes de error/éxito

### mis-cursos.component.html
- Header con título e icono
- **Tabla 1:** Progreso general por estudiante
- **Tabla 2:** Progreso detallado por módulo
- Estados visuales con iconos
- Barras de progreso con porcentajes

### tareas.component.html
- Header con título
- Por cada tarea:
  - Información general
  - Tabla de entregas (estudiante, estado, calificación)
  - Botones de calificación

### mensajes.component.html
- 3 Tabs (Enviar, Enviados, Recibidos)
- **Tab Enviar:** Formulario con selector y textarea
- **Tab Enviados:** Listado de mensajes
- **Tab Recibidos:** Listado de mensajes
- Alertas de éxito/error

### foros.component.html
- Formulario crear foro (Tema, Curso, Descripción)
- Listado de foros agrupados por curso
- Acciones: Editar, Ver respuestas, Eliminar
- Modal para editar foro
- Alertas de éxito/error

### foro-detalle.component.html
- Botón "Volver a foros"
- Información del foro
- Listado de respuestas de estudiantes

### estudiantes.component.html
- Tabla de estudiantes
- Columnas: Nombre, Email, Cursos, Progreso
- Barra de progreso interactiva

### docente-layout.component.html
- Sidebar con navegación
- Logo y información del usuario
- Links activos para rutas
- Iconos con Lucide Icons
- Responsive (móvil y escritorio)
- Toggle tema oscuro/claro

---

## 🎨 Estilos y Temas

### Variables de tema
- **THEME_KEY:** `'codipayco-admin-theme'`
- **Valores:** `'dark'` | `'light'`
- **Almacenamiento:** `localStorage`
- **Toggle:** Botón en sidebar

### Clases CSS aplicadas
- `.dark` en `<body>` para tema oscuro
- `.admin-sidebar__label` para textos en sidebar
- `.progreso-percentage` para porcentajes
- `.barra-progreso` para barras
- `.estado-completado`, `.estado-progreso`, `.estado-inicial`

### Archivos de estilo
- `dashboard.component.scss`
- `mis-cursos.component.scss`
- `tareas.component.scss`
- `mensajes.component.scss`
- `foros.component.scss`
- `estudiantes.component.scss`
- `foro-detalle.component.scss`
- `shared-styles.scss` (estilos compartidos)
- `docente-layout.component.scss` (layout principal)

---

## 📊 Estado Actual y TODOs

### ✅ Implementado
- [x] Componentes principales (7 vistas + layout)
- [x] Sistema de rutas completo
- [x] Servicio API centralizado
- [x] Guards de autenticación
- [x] Modelos de datos (DTOs e interfaces)
- [x] Carga de datos asíncrona
- [x] Formularios (crear foro, enviar mensaje)
- [x] Upload de archivos (foto perfil)
- [x] Tema oscuro/claro
- [x] Responsive design
- [x] Manejo de estados de carga
- [x] Mensajes de error/éxito
- [x] Validaciones básicas

### ⚠️ Incompleto o Parcial
- [ ] Endpoints de backend (¡Necesitan implementación en NestJS!)
- [ ] Calificación de tareas (endpoint stub con mensaje genérico)
- [ ] Upload de foto (endpoint con fallback)
- [ ] Búsqueda/Filtrado (no implementado)
- [ ] Paginación (no implementado)
- [ ] Edición de estudiantes desde foro detalle (no implementado)
- [ ] Responder a mensajes (no implementado)
- [ ] Responder en foros (no implementado desde frontend)

### 🔴 Errores/Fallbacks conocidos
1. **Calificación de tareas:** 
   ```
   catchError(() => of({ success: false, message: 'Endpoint no disponible aún' }))
   ```

2. **Upload foto:**
   ```
   catchError(() => of({ success: false, message: 'Endpoint no disponible aún' }))
   ```

---

## 🔗 Dependencias y Librerías

### Angular
- `@angular/core` - Core framework
- `@angular/common` - CommonModule
- `@angular/forms` - FormsModule
- `@angular/router` - Routing
- `@angular/platform-browser/http` - HttpClient

### Terceras
- `lucide-angular` - Icons
- `sweetalert2` - Modals (SweetAlert2)
- `rxjs` - Reactive programming

### Servicios inyectados
- `Auth` - Autenticación
- `HttpClient` - Llamadas HTTP
- `Router` - Navegación
- `DocenteApiService` - API específica

---

## 📚 Patrones Usados

### Componentes Standalone
Todos los componentes son **standalone = true**
- No necesitan módulo
- Importan dependencias directamente
- Mejor tree-shaking

### Signals (Angular 17+)
```typescript
const cursos = signal<DocenteCurso[]>([]);
const loading = signal(true);
const error = signal<string>('');
```

### Computed (valores derivados)
```typescript
readonly misStats = computed(() => {
  const userId = this.authService.currentUser()?.id;
  return { totalCursos: mis.length, ... };
});
```

### RxJS
```typescript
this.apiService.getCursos().subscribe({
  next: (data) => { ... },
  error: (error) => { ... }
});
```

### Inyección de dependencias
```typescript
private apiService = inject(DocenteApiService);
public authService = inject(Auth);
```

---

## 🚀 Próximos Pasos

### Para Backend (NestJS)
1. Implementar todos los endpoints `/docente/*`
2. Implementar endpoints `/foros/*`
3. Implementar endpoints `/mensajes`
4. Validar autenticación en cada endpoint
5. Agregar lógica de negocio completa

### Para Frontend
1. Agregar búsqueda/filtrado en tablas
2. Implementar paginación
3. Agregar edición en línea
4. Mejorar validaciones
5. Agregar confirmaciones de eliminación
6. Implementar respuestas en foros
7. Implementar replied functionality en mensajes

### General
1. Tests unitarios
2. Tests E2E
3. Documentación API
4. Manual de usuario

---

## 📞 Contacto y Soporte

**Documento creado:** 21 de Mayo de 2026  
**Versión:** 1.0  
**Proyecto:** CodiPlayCo - Panel Docente Angular  
**Estado:** Exploración Completa

---

_Este documento es un resultado de una exploración exhaustiva del código fuente del panel docente._
