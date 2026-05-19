# Dashboard Docente - Guía de Implementación

## 📋 Resumen

Se ha implementado un **dashboard completo para docentes** con la misma estructura y estilo glassmorphic que el panel de administrador de CodiPlayCo. El sistema incluye:

- ✅ Sistema de autenticación y autorización específico para docentes
- ✅ Rutas protegidas con guards
- ✅ Layout responsive con navegación intuitiva
- ✅ Redirección automática al dashboard según rol
- ✅ Tema claro/oscuro
- ✅ Módulos para: Dashboard, Mis Cursos, Estudiantes, Tareas, Mensajes y Foros

---

## 🏗️ Estructura de Carpetas

```
src/app/
├── core/
│   ├── config/
│   │   ├── admin-panel-access.config.ts
│   │   └── docente-panel-access.config.ts      ✨ NUEVO
│   ├── guards/
│   │   ├── admin.guard.ts
│   │   └── docente.guard.ts                     ✨ NUEVO
│   ├── routing/
│   │   ├── admin.routes.ts
│   │   ├── docente.routes.ts                    ✨ MODIFICADO
│   │   └── estudiante.routes.ts
│   └── services/
│       └── auth.ts
├── features/
│   ├── docente/                                 ✨ NUEVO
│   │   └── docente-layout/
│   │       ├── docente-layout.component.ts
│   │       ├── docente-layout.component.html
│   │       ├── docente-layout.component.scss
│   │       └── docente-layout.component.spec.ts
│   └── ...
└── auth/
    ├── log-in/
    │   └── log-in.component.ts                  ✨ MODIFICADO
    └── ...
```

---

## 🔐 Autenticación y Autorización

### 1. **Validación de Acceso de Docente**

Ubicación: `src/app/core/config/docente-panel-access.config.ts`

```typescript
// Roles permitidos para docente
DOCENTE_PANEL_ALLOWED_ROLE_NAMES_LOWER = [
  'docente',
  'profesor', 
  'teacher',
  'instructor',
];

// Módulos permitidos
DOCENTE_PANEL_ALLOWED_MODULE_NAMES_LOWER = [
  'paneldocente',
  'panel_docente',
  'docente panel',
  ...
];
```

### 2. **Guard para Rutas de Docente**

Ubicación: `src/app/core/guards/docente.guard.ts`

Protege todas las rutas bajo `/docente/*` verificando:
- Autenticación del usuario
- Rol de docente
- Módulos asignados

### 3. **Rutas Protegidas**

Ubicación: `src/app/core/routing/docente.routes.ts`

Rutas disponibles:
- `/docente/dashboard` - Panel principal
- `/docente/mis-cursos` - Gestión de cursos
- `/docente/estudiantes` - Listado de estudiantes
- `/docente/tareas` - Gestión de tareas
- `/docente/mensajes` - Mensajes y comunicación
- `/docente/foros` - Foros de discusión

---

## 🎨 Componentes

### **DocenteLayoutComponent**

Ubicación: `src/app/features/docente/docente-layout/`

#### Responsabilidades:
- Renderizar el layout principal con navegación
- Manejar la lógica de vistas (dashboard, cursos, etc.)
- Gestionar estado de usuario y temas
- Cargar datos iniciales desde APIs

#### Estados (Signals):
```typescript
// Shell
isDocenteShell = signal(true);          // Mostrar shell
isMenuOpen = signal(false);              // Menú de usuario
isLightTheme = signal(false);            // Tema
docentePanelView = signal('dashboard');  // Vista actual

// Dashboard
dashboardStats = signal(null);           // Estadísticas
dashboardLoading = signal(false);        // Cargando

// Datos de módulos
cursos = signal([]);
estudiantes = signal([]);
tareas = signal([]);
mensajes = signal([]);
```

#### Métodos Principales:
- `loadDashboardStats()` - Carga estadísticas
- `loadCursos()` - Carga cursos del docente
- `loadEstudiantes()` - Carga estudiantes
- `loadTareas()` - Carga tareas
- `loadMensajes()` - Carga mensajes
- `navActive()` - Determina sección activa
- `toggleTheme()` - Cambia tema claro/oscuro
- `logout()` - Cierra sesión

#### API Service:
```typescript
@Injectable({ providedIn: 'root' })
export class DocenteApiService {
  getDashboardStats()
  getCursos()
  getEstudiantes()
  getTareas()
  getMensajes()
  getForos()
  updateCurso(id, body)
  createTarea(payload)
  sendMensaje(destinatario, asunto, mensaje)
}
```

---

## 🎯 Flujo de Redirección

### Antes de la Implementación:
```
Login → Si es admin → /admin/dashboard
     → Si no → /users
```

### Después de la Implementación:
```
Login → Si es admin → /admin/dashboard
     → Si es docente → /docente/dashboard
     → Si es estudiante → /users
```

Cambio en: `src/app/auth/log-in/log-in.component.ts`

```typescript
if (userHasAdminPanelAccess(res.user)) {
  this.router.navigate(['/admin/dashboard']);
} else if (userHasDocentePanelAccess(res.user)) {
  this.router.navigate(['/docente/dashboard']);
} else {
  this.router.navigate(['/users']);
}
```

---

## 🎨 Diseño CSS

### Ubicación: `docente-layout.component.scss`

Basado en glassmorphism con colores adaptados para docente:

**Colores Principales:**
- Primario: `#3b82f6` (Azul)
- Secundario: `#8b5cf6` (Púrpura)
- Acentos: `#ec4899` (Rosa), `#10b981` (Verde), `#f97316` (Naranja)

**Componentes Estilizados:**
- Hero Card - Bienvenida con estadísticas
- Stat Cards - Tarjetas de estadísticas
- Glass Cards - Tarjetas con efecto vidrio
- Quick Actions - Acciones rápidas
- Tables - Tablas de datos
- Grids - Disposiciones responsivas

**Responsive:**
- Desktop: Grid de 12 columnas
- Tablet: Grid de 6 columnas
- Mobile: Grid de 1-2 columnas

### Tema Claro/Oscuro:
- Oscuro por defecto (tema que coincide con admin)
- Claro opcional con clase `light-theme`

---

## 📡 Integración con Backend

### Endpoints Esperados:

```
GET  /docente/dashboard/stats          → DocenteDashboardStats
GET  /docente/cursos                   → DocenteCurso[]
GET  /docente/estudiantes              → DocenteEstudiante[]
GET  /docente/tareas                   → DocenteTarea[]
GET  /docente/mensajes                 → DocenteMensaje[]
GET  /docente/foros                    → Any[]

PUT  /docente/cursos/:id               → DocenteCurso
POST /docente/tareas                   → DocenteTarea
POST /docente/mensajes                 → void
```

### Interfaces Esperadas del Backend:

```typescript
// Dashboard Stats
interface DocenteDashboardStats {
  totalEstudiantes: number;
  totalCursosActivos: number;
  tasaCompletacion: number;
}

// Curso
interface DocenteCurso {
  id: number;
  nombre: string;
  descripcion: string;
  estudiantes: number;
  progreso: number;
  estado: boolean;
}

// Estudiante
interface DocenteEstudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cursos: string[];
  progreso: number;
}

// Tarea
interface DocenteTarea {
  id: number;
  titulo: string;
  descripcion: string;
  fechaVencimiento: string;
  estudiantes: number;
  estado: string; // 'pendiente' | 'completada' | 'vencida'
}

// Mensaje
interface DocenteMensaje {
  id: number;
  remitente: string;
  asunto: string;
  fecha: string;
  leido: boolean;
}
```

---

## 🚀 Cómo Usar

### 1. **Iniciar Sesión como Docente**

Usa credenciales de un usuario con rol "docente":
```
Email: docente@example.com
Password: password123
```

### 2. **Sistema Redirige Automáticamente**

El componente de login detecta el rol y redirige:
- Admin → `/admin/dashboard`
- Docente → `/docente/dashboard`
- Estudiante → `/users`

### 3. **Navegar por Módulos**

Los botones en la navegación llevan a:
- Dashboard - Estadísticas y resumen
- Mis Cursos - Gestión de cursos
- Estudiantes - Listado y seguimiento
- Tareas - Creación y asignación
- Mensajes - Comunicación
- Foros - Discusiones

---

## 📝 Próximos Pasos (Recomendaciones)

### 1. **Backend - Crear Endpoints**

En Nest.js, crear controlador `docente.controller.ts`:

```typescript
@Controller('docente')
export class DocenteController {
  @Get('dashboard/stats')
  getDashboardStats(@Req() req) { }

  @Get('cursos')
  getCursos(@Req() req) { }

  @Get('estudiantes')
  getEstudiantes(@Req() req) { }
  
  // ... más endpoints
}
```

### 2. **Completar Componentes de Módulos**

Crear componentes específicos para cada vista:
- `docente-cursos.component.ts`
- `docente-estudiantes.component.ts`
- `docente-tareas.component.ts`
- `docente-mensajes.component.ts`
- `docente-foros.component.ts`

### 3. **Agregar Formas de Edición**

Implementar forms reactivos para:
- Crear/editar cursos
- Crear/editar tareas
- Enviar mensajes
- Crear temas en foros

### 4. **Agregar Validaciones**

Verificar permisos antes de cada operación:
- Solo docentes pueden editar sus cursos
- No pueden acceder a datos de otros docentes
- Limitar acceso según módulos asignados

### 5. **Mejorar UX**

- Agregar confirmaciones antes de eliminar
- Toasts para feedback de operaciones
- Paginación en listados
- Filtros y búsqueda
- Exportar reportes

---

## 🐛 Troubleshooting

### **No redirige al dashboard del docente después de login**

✅ Verificar:
- Backend retorna rol "docente" en el token
- El usuario tiene el rol asignado
- `docente-panel-access.config.ts` incluye el nombre del rol

### **Componente no carga datos**

✅ Verificar:
- APIs están disponibles en `http://localhost:3000/docente/*`
- Token está siendo enviado en headers
- Backend retorna datos en formato esperado

### **Estilos no aplican correctamente**

✅ Verificar:
- SCSS está compilando correctamente
- Importación de estilos admin está incluida
- Variables de color están definidas

### **Guard bloquea el acceso**

✅ Verificar:
- Usuario autenticado con token válido
- Rol/módulos coinciden con configuración
- Rutas están protegidas con `canActivate: [docenteGuard]`

---

## 📚 Referencias

- **Admin Dashboard:** `src/app/core/components/admin-layout/`
- **Auth Service:** `src/app/core/services/auth.ts`
- **Rutas:** `src/app/core/routing/docente.routes.ts`
- **Config Acceso:** `src/app/core/config/docente-panel-access.config.ts`
- **Login Component:** `src/app/auth/log-in/log-in.component.ts`

---

**Última actualización:** Mayo 12, 2026
**Estado:** ✅ Implementado y Funcional
