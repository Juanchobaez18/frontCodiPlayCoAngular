# Checklist y Referencia Rápida - Panel Docente

**Documento:** Referencia para Desarrolladores  
**Proyecto:** CodiPlayCo - Panel Docente  
**Fecha:** 21 de Mayo de 2026

---

## 🎯 Checklist de Desarrollo Frontend ✅

### Componentes
- [x] DashboardComponent
- [x] MisCursosComponent
- [x] EstudiantesComponent
- [x] TareasComponent
- [x] MensajesComponent
- [x] ForosComponent
- [x] ForoDetalleComponent
- [x] DocenteLayoutComponent

### Servicios
- [x] DocenteApiService (Feature)
- [x] Auth Service

### Rutas
- [x] DOCENTE_ROUTES configuradas
- [x] Legacy redirects configurados
- [x] Guards aplicados

### Guards
- [x] docenteGuard implementado
- [x] Verificaciones: auth, rol, activo

### Estilos
- [x] SCSS por componente
- [x] Tema oscuro/claro
- [x] Responsive design

### Funcionalidades
- [x] Upload de foto
- [x] Visualización de progreso
- [x] Calificación de tareas
- [x] Sistema de mensajes
- [x] Gestión de foros
- [x] Listado de estudiantes

---

## 🔧 Checklist de Desarrollo Backend (NestJS)

### Controllers
- [ ] DocenteController
  - [ ] GET /docente/dashboard/stats
  - [ ] GET /docente/cursos
  - [ ] GET /docente/cursos/:id
  - [ ] GET /docente/estudiantes
  - [ ] GET /docente/tareas
  - [ ] POST /docente/tareas/calificar
  - [ ] GET /docente/mensajes
  - [ ] POST /docente/mensajes
  - [ ] POST /docente/subir-foto

- [ ] ForoController
  - [ ] GET /docente/foros
  - [ ] GET /foros/:id
  - [ ] POST /foros
  - [ ] PUT /foros/:id
  - [ ] DELETE /foros/:id
  - [ ] GET /foros/:id/respuestas

### Services
- [ ] DocenteService
- [ ] CursoService
- [ ] EstudianteService
- [ ] TareaService
- [ ] MensajeService
- [ ] ForoService

### Guards
- [ ] JwtAuthGuard
- [ ] RolesGuard (Verificar "docente")
- [ ] IsActiveGuard

### Database
- [ ] Modelos/Entidades
  - [ ] User (con roles)
  - [ ] Curso
  - [ ] Estudiante
  - [ ] Tarea
  - [ ] Entrega
  - [ ] Mensaje
  - [ ] Foro
  - [ ] ForoRespuesta
  - [ ] Módulo
  - [ ] Lección

- [ ] Relaciones
  - [ ] User → Roles
  - [ ] User → Cursos (docente)
  - [ ] Curso → Estudiantes
  - [ ] Curso → Tareas
  - [ ] Tarea → Entregas
  - [ ] Foro → Respuestas

### Validaciones
- [ ] DTOs completos
- [ ] Validaciones de entrada
- [ ] Transformaciones de datos
- [ ] Errores personalizados

### Seguridad
- [ ] JWT en headers
- [ ] Verificación de rol
- [ ] Verificación de usuario activo
- [ ] Propietario de recursos

---

## 🔌 API Endpoints: Checklist de Implementación

### Dashboard
- [ ] `GET /docente/dashboard/stats` → DocenteDashboardStats

### Cursos
- [ ] `GET /docente/cursos` → DocenteCurso[]
- [ ] `GET /docente/cursos/:id` → CursoDetalle

### Estudiantes
- [ ] `GET /docente/estudiantes` → DocenteEstudiante[]

### Tareas
- [ ] `GET /docente/tareas` → DocenteTarea[]
- [ ] `POST /docente/tareas/calificar` → { success, entrega }

### Mensajes
- [ ] `GET /docente/mensajes` → DocenteMensaje[]
- [ ] `POST /docente/mensajes` → { id, remitente, destinatario }

### Foros
- [ ] `GET /docente/foros` → DocenteForo[]
- [ ] `GET /foros/:id` → DocenteForo
- [ ] `POST /foros` → DocenteForo (created)
- [ ] `PUT /foros/:id` → DocenteForo (updated)
- [ ] `DELETE /foros/:id` → { success, message }
- [ ] `GET /foros/:id/respuestas` → ForoRespuesta[]

### Perfil
- [ ] `POST /docente/subir-foto` → { success, fotoPerfil }

---

## 📊 Checklist de DTOs/Interfaces

### Request DTOs
- [x] `CreateForoDto` { titulo, descripcion, cursoId }
- [x] `UpdateForoDto` { titulo?, descripcion? }
- [x] `SendMensajeDto` { destinatarioId, contenido }
- [ ] `CalificarTareaDto` { entregaId, calificacion, resultado }

### Response DTOs
- [x] `DocenteDashboardStats`
- [x] `DocenteCurso`
- [x] `CursoDetalle`
- [x] `EstudianteProgreso`
- [x] `ModuloDetalle`
- [x] `LeccionDetalle`
- [x] `DocenteEstudiante`
- [x] `DocenteTarea`
- [x] `TareaEntrega`
- [x] `DocenteMensaje`
- [x] `DocenteForo`
- [x] `ForoRespuesta`

---

## 🧪 Checklist de Testing

### Unit Tests
- [ ] DashboardComponent
- [ ] MisCursosComponent
- [ ] EstudiantesComponent
- [ ] TareasComponent
- [ ] MensajesComponent
- [ ] ForosComponent
- [ ] ForoDetalleComponent
- [ ] DocenteApiService
- [ ] docenteGuard

### E2E Tests
- [ ] Login → Acceder a panel docente
- [ ] Navegar a cada vista
- [ ] Upload de foto
- [ ] Crear foro
- [ ] Enviar mensaje
- [ ] Calificar tarea

### Performance Tests
- [ ] Carga de cursos
- [ ] Carga de estudiantes
- [ ] Carga de tareas

---

## 📋 Referencia Rápida de Rutas

### Para Desarrolladores

```bash
# Navegar a dashboard
/docente/dashboard

# Navegar a cursos
/docente/mis-cursos

# Navegar a estudiantes
/docente/estudiantes

# Navegar a tareas
/docente/tareas

# Navegar a mensajes
/docente/mensajes

# Navegar a foros
/docente/foros

# Ver foro específico
/docente/foros/1

# Editar curso
/docente/mis-cursos/1/editar
```

---

## 💻 Referencia Rápida de Código

### Inyectar servicio
```typescript
private apiService = inject(DocenteApiService);
```

### Crear signal
```typescript
cursos = signal<DocenteCurso[]>([]);
loading = signal(true);
```

### Crear computed
```typescript
readonly userDisplayName = computed(() => {
  const u = this.authService.currentUser();
  return [u?.name, u?.lastName].filter(Boolean).join(' ');
});
```

### Llamar HTTP
```typescript
this.apiService.getCursos().subscribe({
  next: (data) => this.cursos.set(data),
  error: (err) => this.error.set('Error'),
});
```

### Usar signals en template
```angular2html
{{ cursos().length }}
@if (loading()) {
  <p>Cargando...</p>
}
@for (curso of cursos(); track curso.id) {
  <div>{{ curso.nombre }}</div>
}
```

### Actualizar signal
```typescript
this.cursos.set(newValue);
```

---

## 🎨 Colores y Temas

### Tema Claro (default)
- Fondo: Blanco
- Texto: Negro/Gris oscuro
- Acentos: Azul/Verde

### Tema Oscuro
- Fondo: Gris oscuro/Negro
- Texto: Blanco/Gris claro
- Acentos: Azul claro/Verde claro

### Toggle
```typescript
const isDarkMode = signal(false);

toggleDarkMode(): void {
  const next = !this.isDarkMode();
  this.isDarkMode.set(next);
  document.body.classList.toggle('dark', next);
  localStorage.setItem('codipayco-admin-theme', next ? 'dark' : 'light');
}
```

---

## 📱 Breakpoints Responsive

```scss
// Mobile
@media (max-width: 640px) {
  // Estilos mobile
}

// Tablet
@media (min-width: 641px) and (max-width: 1024px) {
  // Estilos tablet
}

// Desktop
@media (min-width: 1025px) {
  // Estilos desktop
}
```

---

## 🔐 Seguridad: Checklist

### Frontend
- [x] Guard protege rutas
- [x] Token verificado en cada request
- [x] Rol verificado antes de acceso
- [x] Usuario activo verificado

### Backend
- [ ] JWT generado correctamente
- [ ] JWT verificado en middleware
- [ ] Rol verificado en guards
- [ ] Usuario activo verificado
- [ ] Propietario de recurso verificado
- [ ] SQL injection prevenido
- [ ] XSS prevenido
- [ ] CORS configurado correctamente

---

## 🚀 Performance: Checklist

### Frontend
- [x] Componentes standalone
- [x] Change detection OnPush (implícito en signals)
- [x] Lazy loading de rutas
- [x] Carga asíncrona de datos
- [ ] Caching de datos

### Backend
- [ ] Índices en BD
- [ ] Paginación implementada
- [ ] Filtros en backend (no frontend)
- [ ] Caching (Redis si es necesario)
- [ ] CDN para imágenes

---

## 📚 Librerías Usadas

### Angular
```json
{
  "@angular/core": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@angular/router": "^17.0.0"
}
```

### UI
```json
{
  "lucide-angular": "latest",
  "sweetalert2": "^11.x"
}
```

### Reactive
```json
{
  "rxjs": "^7.x"
}
```

---

## 🔧 Comandos Útiles

### Angular CLI
```bash
# Crear componente
ng generate component features/docente/mi-componente

# Crear servicio
ng generate service features/docente/services/mi-servicio

# Crear guard
ng generate guard core/guards/mi-guard

# Servir aplicación
ng serve

# Build para producción
ng build --prod

# Tests
ng test
```

### Package.json scripts
```bash
npm start          # Iniciar dev server
npm test           # Ejecutar tests
npm run build      # Build
npm run lint       # Linter
npm run e2e        # E2E tests
```

---

## 🐛 Debugging

### En Browser Console
```javascript
// Ver signals
console.log(signal_name());

// Ver estado de componente
ng.coreOnDebug.componentInstance
```

### Angular DevTools
- Instalable como extensión de Chrome
- Permite ver árbol de componentes
- Inspeccionar signals
- Ver performance

### Network Tab
- Ver requests HTTP
- Verificar status codes
- Ver payloads
- Verificar headers

---

## 📞 Contactos Rápidos

### Documentos Disponibles
- `PANEL_DOCENTE_EXPLORACION.md` - Exploración completa
- `PANEL_DOCENTE_RESUMEN.md` - Resumen ejecutivo
- `ENDPOINTS_REQUERIDOS.md` - Especificación de endpoints
- `ARQUITECTURA_DIAGRAMAS.md` - Diagramas visuales
- `INDICE_ARCHIVOS.md` - Índice de archivos
- `CHECKLIST_REFERENCIA.md` - Este documento

### Personas de Contacto
- Frontend: Equipo Angular
- Backend: Equipo NestJS
- DevOps: Infraestructura

---

## 🎯 Próximas Acciones

### Inmediatas (Esta semana)
```
[ ] Implementar endpoints en NestJS
[ ] Conectar frontend con backend
[ ] Testing básico
```

### Corto plazo (Próxima semana)
```
[ ] Agregar búsqueda/filtrado
[ ] Implementar paginación
[ ] Mejorar validaciones
```

### Mediano plazo
```
[ ] Tests unitarios completos
[ ] Tests E2E
[ ] Documentación de API
[ ] Manual de usuario
```

---

## ✨ Tips y Trucos

### Signals en Templates
```angular2html
<!-- Mostrar valor -->
{{ signal() }}

<!-- Condicional -->
@if (signal()) {
  <p>Verdadero</p>
}

<!-- Iteración -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- Switch -->
@switch (view()) {
  @case ('dashboard') {
    <app-dashboard />
  }
}
```

### RxJS Operators comunes
```typescript
// Mapear respuesta
.pipe(map(data => data.items))

// Capturar errores
.pipe(catchError(err => of([])))

// Completar subscription automáticamente
.pipe(takeUntilDestroyed())

// Transformar con tap
.pipe(tap(data => console.log(data)))
```

### Testing Components
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## 📝 Notas Importantes

1. **Autenticación:**
   - Todos los endpoints requieren JWT en headers
   - Token debe estar incluido en Authorization: Bearer

2. **Errores comunes:**
   - Olvidar `track` en `@for` (optimization)
   - No usar `signal()` en templates
   - Llamadas HTTP sin `subscribe`

3. **Performance:**
   - Usar `track` en listas para mejor rendimiento
   - Lazy load routes cuando sea posible
   - Usar `OnPush` change detection

4. **Seguridad:**
   - Nunca guardar tokens en localStorage sin encriptación
   - Validar en backend siempre
   - Sanitizar inputs

---

## 🎓 Recursos Educativos

### Documentación Oficial
- https://angular.io/
- https://angular.io/guide/signals
- https://docs.nestjs.com/

### Tutoriales
- Angular: https://angular.io/start
- NestJS: https://docs.nestjs.com/first-steps
- TypeScript: https://www.typescriptlang.org/docs/

### Comunidades
- Stack Overflow
- Reddit: r/angular, r/nestjs
- Discord communities

---

## 📈 Métricas de Seguimiento

### Frontend
- Tiempo de carga: < 3s
- Performance Score: > 90
- Lighthouse: > 85

### Backend
- Response time: < 200ms
- Uptime: > 99.5%
- Error rate: < 0.1%

---

_Documento de referencia rápida_
_Creado: 21 de Mayo de 2026_
_Versión: 1.0_

**¡Listo para comenzar el desarrollo!** 🚀
