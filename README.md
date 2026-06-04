# CodiPlayCo — Frontend (Angular)

Aplicación web para la plataforma educativa CodiPlayCo. Construida con Angular 21 + Angular Material + Signals.

---

## Requisitos previos

- Node.js ≥ 18
- Backend CodiPlayCo corriendo en `http://localhost:3000`  
  ⚠️ Asegúrate de haber ejecutado `npm run seed` en el backend antes de usar la app.

---

## Instalación y desarrollo

```bash
npm install
ng serve
```

La app estará disponible en `http://localhost:4200`.

---

## Paneles disponibles

| Panel | Ruta | Acceso |
|-------|------|--------|
| Landing / Cursos | `/` · `/cursos` | Público |
| Registro | `/auth/register` | Público |
| Login | `/auth/login` | Público |
| Panel Estudiante | `/estudiante/inicio` | Rol `estudiante` |
| Panel Docente | `/docente/dashboard` | Rol `docente` |
| Panel Admin | `/admin/dashboard` | Rol `admin` |

---

## Flujo de inscripción a un curso

1. El visitante va a `/cursos` y hace clic en **Inscribirme**
2. Si no tiene sesión → va a `/auth/register` con el banner del curso seleccionado
3. Completa el registro → redirige automáticamente a `/registro-pago/:id`
4. Si ya tiene sesión → va directamente a `/registro-pago/:id`
5. En la página de pago hace clic en **Registrar e Ir al Pago** → Stripe Checkout
6. Stripe redirige a `/pago-exitoso?transaccion=:id` para confirmar la inscripción

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Servidor de desarrollo |
| `ng build` | Build de producción en `dist/` |
| `ng test` | Tests unitarios |

---

## Variables de entorno del frontend

Todas las URLs del backend se configuran directamente en los servicios bajo `src/app/core/services/`.  
El valor por defecto es `http://localhost:3000`.

---

## Estructura del proyecto

```
src/app/
├── auth/                    Login y registro
├── core/
│   ├── services/            Auth, EstudianteApi, DocenteApi, PendingCourse
│   ├── guards/              authGuard, docenteGuard, adminGuard, estudiantePanelGuard
│   ├── interceptors/        authInterceptor (agrega Bearer token a todas las peticiones)
│   ├── components/          Layouts: admin, docente, estudiante
│   └── routing/             Rutas por rol
└── features/
    ├── cursos/              Catálogo público de cursos
    ├── registro-pago/       Confirmación previa al pago con Stripe
    ├── pago-exitoso/        Confirmación post-pago
    └── docente/             Componentes del panel docente
```
