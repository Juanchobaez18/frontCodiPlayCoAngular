# Diagramas de Arquitectura - Panel Docente

**Documento:** Visualización de la Arquitectura  
**Proyecto:** CodiPlayCo - Panel Docente  
**Fecha:** 21 de Mayo de 2026

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENTE WEB (NAVEGADOR)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  ANGULAR FRONTEND (SPA)                     │
│  ┌──────────────────────────────────────────────────────────┤
│  │ DocenteLayoutComponent (Standalone)                      │
│  │  ├─ Sidebar Navigation                                   │
│  │  ├─ Theme Toggle (Dark/Light)                            │
│  │  ├─ User Profile                                         │
│  │  └─ Main Router Outlet                                   │
│  └──────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ VIEWS ────────────────────────────────────────────────┐ │
│  │ Dashboard  │ Cursos  │ Tareas  │ Mensajes │ Foros    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ SERVICES ─────────────────────────────────────────────┐ │
│  │ ┌──────────────────────────────────────────────────┐  │ │
│  │ │ DocenteApiService (Inyectado)                   │  │ │
│  │ │ ├─ getCursos()                                   │  │ │
│  │ │ ├─ getTareas()                                   │  │ │
│  │ │ ├─ getMensajes()                                 │  │ │
│  │ │ ├─ getForos()                                    │  │ │
│  │ │ ├─ getEstudiantes()                              │  │ │
│  │ │ └─ uploadFotoPerfil()                            │  │ │
│  │ └──────────────────────────────────────────────────┘  │ │
│  │ ┌──────────────────────────────────────────────────┐  │ │
│  │ │ Auth Service                                     │  │ │
│  │ │ ├─ currentUser()                                 │  │ │
│  │ │ ├─ isAuthenticated()                             │  │ │
│  │ │ └─ logout()                                      │  │ │
│  │ └──────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ GUARDS ──────────────────────────────────────────────┐ │
│  │ docenteGuard (canActivate)                            │ │
│  │ ├─ isAuthenticated()                                  │ │
│  │ ├─ isDocente()                                        │ │
│  │ └─ isActive()                                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
                    (HttpClient Requests)
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            BACKEND API (NestJS - http://localhost:3000)    │
│  ┌──────────────────────────────────────────────────────────┤
│  │ Controllers & Routes                                     │
│  │  ├─ /docente/*                                           │
│  │  ├─ /foros/*                                             │
│  │  └─ /mensajes/*                                          │
│  └──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┤
│  │ Services & Business Logic                                │
│  │  ├─ DocenteService                                       │
│  │  ├─ CursoService                                         │
│  │  ├─ ForoService                                          │
│  │  ├─ MensajeService                                       │
│  │  ├─ TareaService                                         │
│  │  └─ AuthService                                          │
│  └──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┤
│  │ Guards & Middleware                                      │
│  │  ├─ JWT Auth Guard                                       │
│  │  ├─ Roles Guard (Docente)                                │
│  │  └─ IsActive Guard                                       │
│  └──────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                   │
│  ├─ Users (con roles)                                      │
│  ├─ Cursos                                                 │
│  ├─ Estudiantes                                            │
│  ├─ Tareas & Entregas                                      │
│  ├─ Mensajes                                               │
│  ├─ Foros & Respuestas                                     │
│  └─ Módulos & Lecciones                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Flujo de Navegación

```
LOGIN (/auth/login)
      │
      ↓
✓ Autenticado + Rol = Docente + Activo
      │
      ├─── NO ──→ /auth/login (docenteGuard falla)
      │
      ↓ SÍ
/docente (redirect a /docente/dashboard)
      │
      ├─→ /docente/dashboard ─→ DashboardComponent
      │   └─ Upload Foto de Perfil
      │   └─ Ver Datos Personales
      │
      ├─→ /docente/mis-cursos ─→ MisCursosComponent
      │   └─ Ver Cursos Asignados
      │   └─ Visualizar Progreso Estudiantes
      │   └─ Progreso por Módulo/Lección
      │
      ├─→ /docente/estudiantes ─→ EstudiantesComponent
      │   └─ Listar Todos los Estudiantes
      │   └─ Ver Progreso Individual
      │
      ├─→ /docente/tareas ─→ TareasComponent
      │   └─ Ver Entregas Pendientes
      │   └─ Calificar (APROBADO/NO_APROBADO)
      │
      ├─→ /docente/mensajes ─→ MensajesComponent
      │   ├─ Enviar Mensaje a Estudiante
      │   ├─ Ver Mensajes Enviados
      │   └─ Ver Mensajes Recibidos
      │
      ├─→ /docente/foros ─→ ForosComponent
      │   ├─ Crear Nuevo Foro
      │   ├─ Editar Foro (modal)
      │   ├─ Eliminar Foro
      │   └─ Ver Respuestas (→ /docente/foros/:id)
      │
      └─→ /docente/foros/:id ─→ ForoDetalleComponent
          ├─ Ver Foro Completo
          ├─ Ver Respuestas de Estudiantes
          └─ Botón Volver a Foros
```

---

## 🔄 Flujo de Datos: Mis Cursos

```
Usuario hace click en /docente/mis-cursos
            │
            ↓
MisCursosComponent se inicializa
    │
    ├─ loadCursos()
    │   │
    │   ├─ cursosLoading.set(true)
    │   │
    │   ├─ docenteApiService.getCursos()
    │   │   │
    │   │   ├─ HTTP GET /docente/cursos
    │   │   │   │
    │   │   │   ↓
    │   │   └─ Backend retorna DocenteCurso[]
    │   │
    │   ├─ cursos.set(data)
    │   │
    │   ├─ forEach curso → loadCursoDetalle(cursoId)
    │   │   │
    │   │   ├─ HTTP GET /docente/cursos/{cursoId}
    │   │   │   │
    │   │   │   ↓
    │   │   └─ Backend retorna CursoDetalle
    │   │       (estudiantes + módulos)
    │   │
    │   ├─ cursosDetalle.set(new Map(id → CursoDetalle))
    │   │
    │   └─ cursosLoading.set(false)
    │
    ↓
Template renderea con ngFor
    │
    ├─ Tabla 1: Progreso General
    │   ├─ Nombre | Progreso | Estado
    │   └─ Barras de progreso interactivas
    │
    └─ Tabla 2: Progreso Detallado
        ├─ Nombre | Módulo | Lección | Progreso
        └─ Estados visuales
```

---

## 🔄 Flujo de Datos: Crear Foro

```
Usuario en /docente/foros rellenar formulario
            │
            ├─ nuevoTitulo.set(value)
            ├─ nuevoCursoId.set(value)
            └─ nuevaDescripcion.set(value)
            │
            ↓
Usuario hace click en "Crear Foro"
            │
            ├─ Validar campos (no vacíos)
            │   ├─ SI → continuar
            │   └─ NO → errorMessage.set('...')
            │
            ↓
creando.set(true)
            │
            ├─ docenteApiService.createForo(dto)
            │   │
            │   ├─ HTTP POST /foros
            │   │   Body: { titulo, descripcion, cursoId }
            │   │   │
            │   │   ↓
            │   │   Backend valida y crea foro
            │   │   │
            │   │   ↓
            │   │   Retorna DocenteForo creado
            │   │
            │   ├─ successMessage.set('Foro creado exitosamente')
            │   ├─ Limpiar campos
            │   └─ creando.set(false)
            │
            ↓
loadData() (recargar foros)
            │
            ├─ getCursos() + getForos()
            │
            ↓
Template actualiza con new ForoData[]
            │
            └─ Foro aparece en el listado
```

---

## 🔄 Flujo de Datos: Calificar Tarea

```
Usuario en /docente/tareas visualiza entregas
            │
            ↓
Usuario hace click en "Aprobar" o "No Aprobar"
            │
            ├─ calificar(entregaId, resultado)
            │
            ├─ calificando.set(new Set([entregaId]))
            │
            ├─ docenteApiService.calificarTarea(entregaId, resultado)
            │   │
            │   ├─ HTTP POST /docente/tareas/calificar
            │   │   Body: { entregaId, calificacion, resultado }
            │   │   │
            │   │   ↓
            │   │   Backend actualiza entrega
            │   │   │
            │   │   ↓
            │   │   Retorna { success: true, entrega }
            │   │
            │   ├─ calificando.delete(entregaId)
            │   └─ loadTareas() (recargar)
            │
            ↓
Template actualiza tabla con nuevas calificaciones
```

---

## 🔄 Flujo de Datos: Enviar Mensaje

```
Usuario en /docente/mensajes (Tab: Enviar)
            │
            ├─ loadEstudiantes() en ngOnInit
            │   │
            │   ├─ HTTP GET /docente/estudiantes
            │   │   │
            │   │   ↓
            │   │   Backend retorna DocenteEstudiante[]
            │   │
            │   └─ estudiantes.set(data)
            │
            ↓
Template renderea select con opciones
            │
            ├─ Usuario selecciona destinatario
            ├─ Usuario escribe mensaje
            │
            ↓
Usuario hace click en "Enviar Mensaje"
            │
            ├─ Validar destinatarioId y contenido
            │   ├─ SI → continuar
            │   └─ NO → errorMessage.set('...')
            │
            ├─ mensajeSending.set(true)
            │
            ├─ docenteApiService.sendMensaje(dto)
            │   │
            │   ├─ HTTP POST /docente/mensajes
            │   │   Body: { destinatarioId, contenido }
            │   │   │
            │   │   ↓
            │   │   Backend crea mensaje
            │   │   │
            │   │   ↓
            │   │   Retorna { success: true, mensajeId }
            │   │
            │   ├─ successMessage.set('Mensaje enviado exitosamente')
            │   ├─ Limpiar campos
            │   ├─ mensajeSending.set(false)
            │   └─ loadMensajes() (actualizar historial)
            │
            ↓
Mensaje aparece en "Mensajes Enviados"
```

---

## 📊 Estructura de Componentes

```
DocenteLayoutComponent (Standalone)
    │
    ├─ Sidebar Navigation
    │   ├─ Link: Dashboard
    │   ├─ Link: Mis Cursos
    │   ├─ Link: Tareas
    │   ├─ Link: Foros
    │   ├─ Link: Mensajes
    │   ├─ Link: Estudiantes
    │   └─ Toggle: Dark Mode
    │
    ├─ User Profile Section
    │   ├─ Avatar (initial letter)
    │   ├─ Display Name
    │   ├─ Email
    │   └─ Role
    │
    ├─ Main Content Area (Router Outlet)
    │   │
    │   ├─ Route: /docente/dashboard
    │   │   └─ DashboardComponent
    │   │       ├─ User Welcome
    │   │       ├─ User Info Display
    │   │       └─ Photo Upload Form
    │   │
    │   ├─ Route: /docente/mis-cursos
    │   │   └─ MisCursosComponent
    │   │       ├─ Courses List
    │   │       ├─ Progress Table 1
    │   │       └─ Progress Table 2 (Modules)
    │   │
    │   ├─ Route: /docente/estudiantes
    │   │   └─ EstudiantesComponent
    │   │       ├─ Students Table
    │   │       ├─ Progress Bars
    │   │       └─ Stats
    │   │
    │   ├─ Route: /docente/tareas
    │   │   └─ TareasComponent
    │   │       ├─ Tasks List
    │   │       ├─ Deliveries Table
    │   │       └─ Grade Buttons
    │   │
    │   ├─ Route: /docente/mensajes
    │   │   └─ MensajesComponent
    │   │       ├─ Tab: Send
    │   │       │   ├─ Student Selector
    │   │       │   ├─ Message Textarea
    │   │       │   └─ Send Button
    │   │       ├─ Tab: Sent
    │   │       │   └─ Sent Messages List
    │   │       └─ Tab: Received
    │   │           └─ Received Messages List
    │   │
    │   ├─ Route: /docente/foros
    │   │   └─ ForosComponent
    │   │       ├─ Create Forum Form
    │   │       ├─ Forums List (grouped by course)
    │   │       └─ Edit Forum Modal
    │   │
    │   └─ Route: /docente/foros/:id
    │       └─ ForoDetalleComponent
    │           ├─ Forum Info
    │           └─ Responses List
    │
    └─ Logout Button
```

---

## 🔐 Flujo de Autenticación

```
Usuario intenta acceder a /docente/*
            │
            ↓
Angular Router ↓
            │
            ├─ canActivate: [docenteGuard]
            │
            ├─ Guard ejecuta:
            │   │
            │   ├─ authService.isAuthenticated()
            │   │   ├─ SÍ → continue
            │   │   └─ NO → checkAuthStatus()
            │   │
            │   ├─ user = authService.currentUser()
            │   │
            │   ├─ Verificar user.roles
            │   │   ├─ Contiene "docente" → SÍ → continue
            │   │   └─ NO → deny
            │   │
            │   ├─ Verificar user.isActive
            │   │   ├─ === true → SÍ → continue
            │   │   └─ NO → deny
            │   │
            │   └─ return true (permitir acceso)
            │
            ├─ Guard retorna false → router.navigateByUrl('/auth/login')
            │
            ↓
Componente se renderiza o redirige a login
```

---

## 📈 Flujo de Estados (Signals)

```
MisCursosComponent

Estado: Inicial
┌─────────────────────┐
│ cursos: []          │
│ loading: true       │
│ error: ""           │
└─────────────────────┘
        │
        ├─ loadCursos()
        │
        ↓
Estado: Cargando
┌─────────────────────┐
│ cursos: []          │
│ loading: true       │
│ error: ""           │
│ (HTTP en progreso)  │
└─────────────────────┘
        │
        ├─ HTTP respuesta exitosa
        │
        ↓
Estado: Éxito
┌─────────────────────┐
│ cursos: [...]       │ ← populado
│ loading: false      │ ← ready
│ error: ""           │
└─────────────────────┘
        │
        ├─ forEach: loadCursoDetalle(id)
        │
        ├─ detalleLoading.add(id)
        │
        ↓
Estado: Detalles cargando
┌─────────────────────────────────┐
│ cursos: [...]                   │
│ loading: false                  │
│ detalleLoading: {1, 2, 3}       │ ← hay IDs cargando
│ cursosDetalle: {} (parcial)     │ ← van llenándose
└─────────────────────────────────┘
        │
        ├─ Todos los detalles cargados
        │
        ↓
Estado: Completado
┌─────────────────────────────────┐
│ cursos: [...]                   │
│ loading: false                  │
│ detalleLoading: {} (vacío)      │
│ cursosDetalle: {...} (completo) │
└─────────────────────────────────┘
        │
        ↓
Template actualiza y renderiza tablas
```

---

## 🔌 Inyección de Dependencias

```
DocenteLayoutComponent
    │
    ├─ router = inject(Router)
    ├─ docenteApi = inject(DocenteApiService)
    └─ authService = inject(Auth)

MisCursosComponent
    │
    ├─ apiService = inject(DocenteApiService)
    │
    ├─ apiService.getCursos()
    │   └─ HttpClient = inject(HttpClient)
    │       └─ GET /docente/cursos

ForosComponent
    │
    ├─ apiService = inject(DocenteApiService)
    ├─ router = inject(Router)
    │
    ├─ apiService.createForo(dto)
    │   └─ HTTP POST /foros

MensajesComponent
    │
    ├─ apiService = inject(DocenteApiService)
    │
    ├─ apiService.getEstudiantes()
    │   └─ GET /docente/estudiantes
    │
    ├─ apiService.getMensajes()
    │   └─ GET /docente/mensajes
    │
    └─ apiService.sendMensaje(dto)
        └─ POST /docente/mensajes
```

---

## 🎨 Ciclo de Vida - Componente

```
DashboardComponent

1. INICIALIZACIÓN
   │
   ├─ Componente creado
   ├─ Signals inicializadas
   │   ├─ selectedFile: null
   │   ├─ filePreview: null
   │   ├─ uploading: false
   │   └─ selectedFileName: "Seleccionar archivo"
   │
   ├─ ngOnInit (si existe)
   │   └─ [No definido en este componente]
   │
   └─ Constructor
       └─ Dependencias inyectadas

2. RENDERIZADO INICIAL
   │
   ├─ Template renderiza:
   │   ├─ Foto de perfil (placeholder)
   │   ├─ Información del usuario
   │   └─ Formulario upload (botón deshabilitado)
   │
   └─ Componente listo para interacción

3. INTERACCIÓN DEL USUARIO
   │
   ├─ Usuario selecciona archivo
   ├─ onFileSelected($event)
   │   ├─ selectedFile.set(file)
   │   ├─ selectedFileName.set(file.name)
   │   ├─ FileReader lee archivo
   │   └─ filePreview.set(data URL)
   │
   ├─ Template detecta cambio en filePreview()
   │   └─ Re-renderiza imagen preview
   │
   ├─ Usuario hace click en "Subir"
   ├─ uploadPhoto()
   │   ├─ uploading.set(true)
   │   ├─ apiService.uploadFotoPerfil(file)
   │   │
   │   ├─ HTTP request enviada
   │   │   ├─ Subiendo (uploading: true)
   │   │   └─ Botón deshabilitado
   │   │
   │   └─ Response recibida
   │       ├─ Éxito: uploadMessage.set('Imagen subida...')
   │       ├─ Error: uploadError.set('Error al subir...')
   │       └─ uploading.set(false)
   │
   └─ Template muestra feedback

4. ACTUALIZACIÓN DINÁMICA
   │
   ├─ Signals cambian → Template se actualiza automáticamente
   ├─ Validaciones:
   │   ├─ Botón solo habilitado si hay archivo seleccionado
   │   └─ Spinner visible solo durante upload
   │
   └─ Componente mantiene estado reactivo
```

---

## 📊 Diagrama de Dependencias

```
DocenteApiService (Root)
    │
    ├─ HttpClient
    │   └─ HTTP Interceptors
    │
    ├─ DashboardComponent
    ├─ MisCursosComponent
    ├─ TareasComponent
    ├─ MensajesComponent
    ├─ ForosComponent
    ├─ ForoDetalleComponent
    └─ EstudiantesComponent

Auth Service (Root)
    │
    ├─ DocenteLayoutComponent
    ├─ DashboardComponent
    └─ All Protected Routes

Router
    │
    ├─ docenteGuard (canActivate)
    └─ DOCENTE_ROUTES

Lucide Icons
    └─ DocenteLayoutComponent
```

---

## 🔄 Ciclo de Requisición HTTP

```
1. PREPARACIÓN
   │
   ├─ Component llama: apiService.getCursos()
   ├─ Service inyecta: HttpClient
   └─ Service arma: GET request a http://localhost:3000/docente/cursos

2. HEADERS
   │
   ├─ Authorization: Bearer {jwt_token}
   ├─ Content-Type: application/json
   └─ [Otros headers de interceptor]

3. ENVÍO
   │
   ├─ HttpClient.get() enviado
   └─ Request en tránsito al backend

4. BACKEND
   │
   ├─ NestJS Router recibe request
   ├─ Guard verifica autenticación
   ├─ Guard verifica rol "docente"
   ├─ Controller extrae userId del token
   ├─ Service ejecuta lógica
   └─ Base de datos retorna datos

5. RESPUESTA
   │
   ├─ Backend retorna JSON
│   ├─ Status 200 OK (éxito)
   │   ├─ Status 400 (validación)
   │   ├─ Status 401 (no autenticado)
   │   ├─ Status 403 (no autorizado)
   │   └─ Status 404 (no encontrado)
   │
   └─ Response body incluye datos

6. FRONTEND MANEJO
   │
   ├─ HttpClient recibe respuesta
   ├─ RxJS Observable emite valor
   ├─ Componente suscripción:
   │   ├─ next: actualiza signal
   │   ├─ error: muestra error
   │   └─ complete: limpia recursos
   │
   └─ Template se actualiza (signal change detection)
```

---

_Documentosgenerados: 21 de Mayo de 2026_
