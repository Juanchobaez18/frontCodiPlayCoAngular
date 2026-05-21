import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { estudianteGuard } from './guards/estudiante.guard';
import { ListaLeccionesAdminComponent } from './componentes/admin/lista-lecciones-admin/lista-lecciones-admin.component';
import { FormularioLeccionComponent } from './componentes/admin/formulario-leccion/formulario-leccion.component';
import { ListaLeccionesEstudianteComponent } from './componentes/estudiante/lista-lecciones-estudiante/lista-lecciones-estudiante.component';
import { DetalleLeccionComponent } from './componentes/estudiante/detalle-leccion/detalle-leccion.component';

const routes: Routes = [
  // Rutas para estudiantes
  {
    path: 'lecciones',
    component: ListaLeccionesEstudianteComponent,
    canActivate: [estudianteGuard]
  },
  {
    path: 'lecciones/:id',
    component: DetalleLeccionComponent,
    canActivate: [estudianteGuard]
  },
  
  // Rutas para administradores
  {
    path: 'admin/lecciones',
    component: ListaLeccionesAdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/lecciones/nueva',
    component: FormularioLeccionComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/lecciones/:id/editar',
    component: FormularioLeccionComponent,
    canActivate: [adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeccionesRoutingModule {}
