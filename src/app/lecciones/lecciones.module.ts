import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LeccionesRoutingModule } from './lecciones-routing.module';

// Componentes de administrador
import { ListaLeccionesAdminComponent } from './componentes/admin/lista-lecciones-admin/lista-lecciones-admin.component';
import { FormularioLeccionComponent } from './componentes/admin/formulario-leccion/formulario-leccion.component';
import { DialogoEliminarLeccionComponent } from './componentes/admin/dialogo-eliminar-leccion/dialogo-eliminar-leccion.component';

// Componentes de estudiante
import { ListaLeccionesEstudianteComponent } from './componentes/estudiante/lista-lecciones-estudiante/lista-lecciones-estudiante.component';
import { DetalleLeccionComponent } from './componentes/estudiante/detalle-leccion/detalle-leccion.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LeccionesRoutingModule,
    // Componentes de administrador
    ListaLeccionesAdminComponent,
    FormularioLeccionComponent,
    DialogoEliminarLeccionComponent,
    
    // Componentes de estudiante
    ListaLeccionesEstudianteComponent,
    DetalleLeccionComponent
  ]
})
export class LeccionesModule {}
