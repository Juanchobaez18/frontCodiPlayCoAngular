# Especificación de Endpoints - Panel Docente

**Documento:** Endpoints Esperados por el Frontend  
**Proyecto:** CodiPlayCo  
**Fecha:** 21 de Mayo de 2026  
**Estado:** Requerimiento para implementación en NestJS

---

## 📌 Convenciones

- **Base URL:** `http://localhost:3000`
- **Autenticación:** Token JWT (Bearer)
- **Content-Type:** `application/json`
- **Status codes:**
  - `200` OK
  - `201` Created
  - `400` Bad Request
  - `401` Unauthorized
  - `403` Forbidden
  - `404` Not Found
  - `500` Internal Server Error

---

## 🏠 Grupo: DASHBOARD

### GET `/docente/dashboard/stats`
**Descripción:** Obtener estadísticas del panel del docente

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "totalEstudiantes": 125,
  "totalCursosActivos": 4,
  "tasaCompletacion": 65.5
}
```

**Errores:**
- `401` - No autenticado
- `403` - No es docente

---

## 📚 Grupo: CURSOS

### GET `/docente/cursos`
**Descripción:** Listar todos los cursos del docente

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** (Opcional)
- `estado` (boolean) - Filtrar por estado
- `page` (number) - Paginación
- `limit` (number) - Límite de resultados

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Python Básico",
    "descripcion": "Curso introductorio de programación en Python",
    "estudiantes": 25,
    "progreso": 45,
    "estado": true
  },
  {
    "id": 2,
    "nombre": "Python Avanzado",
    "descripcion": "Conceptos avanzados de Python",
    "estudiantes": 18,
    "progreso": 72,
    "estado": true
  }
]
```

**Notas:**
- Campo `estudiantes`: número de inscritos
- Campo `progreso`: promedio de progreso (0-100)

---

### GET `/docente/cursos/:id`
**Descripción:** Obtener detalles completos de un curso con progreso de estudiantes

**Path Parameters:**
- `id` (number) - ID del curso

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Python Básico",
  "descripcion": "Curso introductorio de programación en Python",
  "estado": true,
  "estudiantes": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "progreso": 75,
      "estado": "en_progreso",
      "moduloActual": "Módulo 2: Estructuras de Datos",
      "leccionActual": "Lección 5: Diccionarios",
      "progresoModulo": 85
    },
    {
      "id": 2,
      "nombre": "María",
      "apellido": "García",
      "email": "maria@example.com",
      "progreso": 100,
      "estado": "completado",
      "moduloActual": null,
      "leccionActual": null,
      "progresoModulo": 100
    }
  ],
  "modulos": [
    {
      "id": 1,
      "nombre": "Módulo 1: Introducción",
      "orden": 1,
      "lecciones": [
        {
          "id": 1,
          "nombre": "Lección 1: ¿Qué es Python?",
          "orden": 1
        },
        {
          "id": 2,
          "nombre": "Lección 2: Instalación",
          "orden": 2
        }
      ]
    },
    {
      "id": 2,
      "nombre": "Módulo 2: Estructuras de Datos",
      "orden": 2,
      "lecciones": [
        {
          "id": 5,
          "nombre": "Lección 5: Diccionarios",
          "orden": 1
        },
        {
          "id": 6,
          "nombre": "Lección 6: Tuplas",
          "orden": 2
        }
      ]
    }
  ]
}
```

**Errores:**
- `401` - No autenticado
- `403` - No es docente
- `404` - Curso no encontrado

---

## 👥 Grupo: ESTUDIANTES

### GET `/docente/estudiantes`
**Descripción:** Listar todos los estudiantes del docente

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** (Opcional)
- `cursoId` (number) - Filtrar por curso
- `page` (number) - Paginación
- `limit` (number) - Límite

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "cursos": ["Python Básico", "Python Avanzado"],
    "progreso": 65
  },
  {
    "id": 2,
    "nombre": "María",
    "apellido": "García",
    "email": "maria@example.com",
    "cursos": ["Python Básico", "JavaScript Moderno"],
    "progreso": 82
  }
]
```

**Notas:**
- Campo `cursos`: nombres de los cursos inscritos
- Campo `progreso`: promedio de progreso en todos sus cursos

---

## ✅ Grupo: TAREAS

### GET `/docente/tareas`
**Descripción:** Listar todas las tareas del docente

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** (Opcional)
- `cursoId` (number) - Filtrar por curso
- `estado` (string) - Filtrar por estado (pendiente, calificada, etc)
- `page` (number) - Paginación
- `limit` (number) - Límite

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "Crear función factorial",
    "descripcion": "Implementar una función recursiva que calcule el factorial",
    "fechaVencimiento": "2026-05-25T23:59:59Z",
    "fechaCreacion": "2026-05-10T10:00:00Z",
    "estudiantes": 25,
    "estado": "pendiente",
    "modulo": "Módulo 3: Funciones",
    "leccion": "Lección 8: Recursión",
    "entregas": [
      {
        "id": 1,
        "estudianteNombre": "Juan",
        "estudianteApellido": "Pérez",
        "estado": "entregado",
        "calificacion": "8/10"
      },
      {
        "id": 2,
        "estudianteNombre": "María",
        "estudianteApellido": "García",
        "estado": "no_entregado",
        "calificacion": null
      }
    ]
  }
]
```

---

### POST `/docente/tareas/calificar`
**Descripción:** Calificar una entrega de tarea

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "entregaId": 1,
  "calificacion": "Aprobado",
  "resultado": "APROBADO"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Tarea calificada exitosamente",
  "entrega": {
    "id": 1,
    "estado": "calificado",
    "calificacion": "Aprobado"
  }
}
```

**Errores:**
- `400` - Datos inválidos
- `401` - No autenticado
- `404` - Entrega no encontrada

---

## 💬 Grupo: MENSAJES

### GET `/docente/mensajes`
**Descripción:** Obtener mensajes del docente (enviados y recibidos)

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** (Opcional)
- `tipo` (string) - Filtrar: 'enviado' | 'recibido' | 'todos' (default: 'todos')
- `page` (number) - Paginación
- `limit` (number) - Límite

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "remitente": "Dr. González",
    "destinatario": "Juan Pérez",
    "asunto": "Revisión de tarea",
    "contenido": "Tu tarea tiene errores de sintaxis en la línea 15",
    "fecha": "2026-05-21T14:30:00Z",
    "leido": true,
    "tipo": "enviado"
  },
  {
    "id": 2,
    "remitente": "María García",
    "destinatario": "Dr. González",
    "asunto": "Duda sobre bucles",
    "contenido": "¿Puedo usar un bucle while en lugar de for?",
    "fecha": "2026-05-21T10:15:00Z",
    "leido": false,
    "tipo": "recibido"
  }
]
```

---

### POST `/docente/mensajes`
**Descripción:** Enviar un nuevo mensaje a un estudiante

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "destinatarioId": 1,
  "contenido": "Juan, revisa tu código en la línea 42. Hay un error de indentación."
}
```

**Response (201 Created):**
```json
{
  "id": 15,
  "remitente": "Dr. González",
  "destinatario": "Juan Pérez",
  "contenido": "Juan, revisa tu código en la línea 42. Hay un error de indentación.",
  "fecha": "2026-05-21T15:00:00Z",
  "tipo": "enviado"
}
```

**Errores:**
- `400` - destinatarioId o contenido inválido
- `401` - No autenticado
- `404` - Estudiante no encontrado

---

## 💭 Grupo: FOROS

### GET `/docente/foros`
**Descripción:** Listar todos los foros creados por el docente

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** (Opcional)
- `cursoId` (number) - Filtrar por curso
- `page` (number) - Paginación
- `limit` (number) - Límite

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titulo": "¿Cómo usar bucles en Python?",
    "descripcion": "Discusión sobre tipos de bucles y cuándo usarlos",
    "cursoId": 1,
    "cursoNombre": "Python Básico",
    "fechaCreacion": "2026-05-15T09:00:00Z",
    "cantidadRespuestas": 7
  },
  {
    "id": 2,
    "titulo": "Entiendo mejor las listas",
    "descripcion": "Consejos y trucos sobre listas en Python",
    "cursoId": 1,
    "cursoNombre": "Python Básico",
    "fechaCreacion": "2026-05-18T14:30:00Z",
    "cantidadRespuestas": 3
  }
]
```

---

### GET `/foros/:id`
**Descripción:** Obtener detalles de un foro específico

**Path Parameters:**
- `id` (number) - ID del foro

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "titulo": "¿Cómo usar bucles en Python?",
  "descripcion": "Discusión sobre tipos de bucles y cuándo usarlos",
  "cursoId": 1,
  "cursoNombre": "Python Básico",
  "fechaCreacion": "2026-05-15T09:00:00Z",
  "cantidadRespuestas": 7
}
```

**Errores:**
- `401` - No autenticado
- `404` - Foro no encontrado

---

### POST `/foros`
**Descripción:** Crear un nuevo foro

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Funciones Lambda en Python",
  "descripcion": "¿Cuándo y cómo usar funciones lambda en Python?",
  "cursoId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "titulo": "Funciones Lambda en Python",
  "descripcion": "¿Cuándo y cómo usar funciones lambda en Python?",
  "cursoId": 1,
  "cursoNombre": "Python Básico",
  "fechaCreacion": "2026-05-21T15:30:00Z",
  "cantidadRespuestas": 0
}
```

**Errores:**
- `400` - Datos inválidos (titulo, descripcion o cursoId vacíos)
- `401` - No autenticado
- `404` - Curso no encontrado

---

### PUT `/foros/:id`
**Descripción:** Actualizar un foro existente

**Path Parameters:**
- `id` (number) - ID del foro

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** (Al menos uno de estos campos)
```json
{
  "titulo": "Funciones Lambda - Guía Completa",
  "descripcion": "Explicación detallada sobre el uso de funciones lambda"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "titulo": "Funciones Lambda - Guía Completa",
  "descripcion": "Explicación detallada sobre el uso de funciones lambda",
  "cursoId": 1,
  "cursoNombre": "Python Básico",
  "fechaCreacion": "2026-05-21T15:30:00Z",
  "cantidadRespuestas": 2
}
```

**Errores:**
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - No es el propietario del foro
- `404` - Foro no encontrado

---

### DELETE `/foros/:id`
**Descripción:** Eliminar un foro

**Path Parameters:**
- `id` (number) - ID del foro

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Foro eliminado exitosamente"
}
```

**Errores:**
- `401` - No autenticado
- `403` - No es el propietario del foro
- `404` - Foro no encontrado

---

### GET `/foros/:id/respuestas`
**Descripción:** Obtener todas las respuestas de un foro

**Path Parameters:**
- `id` (number) - ID del foro

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:** (Opcional)
- `page` (number) - Paginación
- `limit` (number) - Límite

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "mensaje": "Yo uso bucles for en la mayoría de casos",
    "estudianteNombre": "Juan",
    "estudianteApellido": "Pérez",
    "fechaCreacion": "2026-05-15T10:30:00Z"
  },
  {
    "id": 2,
    "mensaje": "El while es útil cuando no sabes cuántas iteraciones necesitas",
    "estudianteNombre": "María",
    "estudianteApellido": "García",
    "fechaCreacion": "2026-05-15T11:45:00Z"
  }
]
```

**Notas:**
- Las respuestas son de estudiantes
- Ordenadas por fecha de creación (más recientes primero)

**Errores:**
- `401` - No autenticado
- `404` - Foro no encontrado

---

## 👤 Grupo: PERFIL

### POST `/docente/subir-foto`
**Descripción:** Subir foto de perfil del docente

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**
```
Form field: 'foto' (file)
- Tipos aceptados: image/jpeg, image/png, image/webp
- Tamaño máximo: 5MB
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Imagen subida correctamente",
  "fotoPerfil": {
    "url": "/uploads/docentes/123-foto.jpg",
    "uploadedAt": "2026-05-21T15:45:00Z"
  }
}
```

**Errores:**
- `400` - Archivo inválido (tipo o tamaño)
- `401` - No autenticado
- `413` - Archivo demasiado grande

---

## 🔍 Filtros Comunes

### Paginación
```json
{
  "page": 1,
  "limit": 20,
  "total": 125,
  "pages": 7,
  "hasNext": true,
  "hasPrev": false
}
```

### Estados de Estudiante
```
- "completado" - Ha completado el curso
- "en_progreso" - Está en progreso
- "iniciando" - Acaba de empezar
```

### Estados de Tarea
```
- "pendiente" - Aún no calificada
- "calificada" - Ya está calificada
- "vencida" - Pasó la fecha de vencimiento
```

---

## 📋 Validaciones Esperadas

### Campos requeridos

**Crear Foro:**
- `titulo` (string, 1-200 caracteres)
- `descripcion` (string, 1-2000 caracteres)
- `cursoId` (number, positivo)

**Enviar Mensaje:**
- `destinatarioId` (number, positivo)
- `contenido` (string, 1-5000 caracteres)

**Calificar Tarea:**
- `entregaId` (number, positivo)
- `calificacion` (string, enum: "Aprobado", "No aprobado")
- `resultado` (string, enum: "APROBADO", "NO_APROBADO")

---

## 🔐 Seguridad

### Headers requeridos
```
Authorization: Bearer {JWT_TOKEN}
```

### Verificaciones por endpoint

**Todos los endpoints requieren:**
- ✅ Token JWT válido
- ✅ Usuario autenticado
- ✅ Rol incluya "docente"
- ✅ Usuario activo (isActive = true)

**Endpoints específicos:**
- `PUT /foros/:id` - Solo el creador puede editar
- `DELETE /foros/:id` - Solo el creador puede eliminar

---

## ⚠️ Manejo de Errores

### Estructura de error estándar
```json
{
  "statusCode": 400,
  "message": "Validación fallida",
  "error": "Bad Request",
  "details": {
    "titulo": "El título es requerido",
    "descripcion": "La descripción debe tener al menos 10 caracteres"
  }
}
```

### Códigos HTTP

| Código | Significado | Acción |
|--------|-------------|--------|
| `200` | OK | Éxito |
| `201` | Created | Recurso creado |
| `204` | No Content | Éxito sin respuesta |
| `400` | Bad Request | Validación fallida |
| `401` | Unauthorized | No autenticado |
| `403` | Forbidden | No tiene permiso |
| `404` | Not Found | Recurso no existe |
| `409` | Conflict | Conflicto de datos |
| `500` | Server Error | Error del servidor |

---

## 📝 Notas de Implementación

1. **Autenticación:**
   - Verificar token JWT en cada request
   - Extraer userId del token

2. **Autorización:**
   - Verificar que el usuario tenga rol "docente"
   - Verificar que el usuario esté activo
   - Verificar propiedad de recursos (foros, mensajes)

3. **Validaciones:**
   - Sanitizar todas las entradas
   - Validar tipos de datos
   - Validar rangos de valores

4. **Performance:**
   - Implementar paginación
   - Usar índices en la BD
   - Cache para estadísticas

5. **Auditoría:**
   - Log de acciones importantes
   - Registrar quién calificó y cuándo
   - Mantener historial de cambios

---

## 📞 Referencias

- **Documento Completo:** PANEL_DOCENTE_EXPLORACION.md
- **Resumen:** PANEL_DOCENTE_RESUMEN.md
- **Base de Datos:** Schema en el repositorio NestJS

---

_Especificación de endpoints generada: 21 de Mayo de 2026_
