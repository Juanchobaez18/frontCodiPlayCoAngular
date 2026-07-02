import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const API_BASE = environment.apiUrl;

export interface DashboardStats {
  totalEstudiantes: number;
  totalEstudiantesActivos: number;
  totalCursosActivos: number;
  totalDocentesActivos: number;
  tasaExito: number;
}

export interface ManagedUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  docType?: string;
  docNumber?: string;
  roles: { id: number; name: string }[];
}

export interface AdminRoleOption {
  id: number;
  name: string;
}

export interface StudentEmailRow {
  id: number;
  email: string;
  name: string;
  lastName: string;
}

export interface CursoRow {
  id: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado: boolean;
  docente?: { id: number; user?: { name: string; lastName: string } };
}

export interface DocenteRow {
  id: number;
  ultimoAcceso: string;
  pagos: number;
  user: { id: number; name: string; lastName: string; email: string };
}

export interface RegisterDocentePayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
  docType: string;
  docNumber: string;
  avatar?: string;
}

export interface CursoPayload {
  nombre: string;
  descripcion: string;
  dificultad: string;
  precio: number;
  estado?: boolean;
  docenteId: number;
  estudiantesIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly adminUrl = `${API_BASE}/admin`;

  getDashboardStats() {
    return this.http.get<DashboardStats>(`${this.adminUrl}/dashboard/stats`);
  }

  getManagedUsers() {
    return this.http.get<ManagedUser[]>(`${this.adminUrl}/users/managed`);
  }

  deleteUser(id: number) {
    return this.http.delete<{ ok: boolean }>(`${this.adminUrl}/users/${id}`);
  }

  updateManagedUser(id: number, body: Record<string, unknown>) {
    return this.http.put<ManagedUser>(`${this.adminUrl}/users/${id}`, body);
  }

  toggleUserActive(id: number) {
    return this.http.patch<ManagedUser>(`${this.adminUrl}/users/${id}/toggle-active`, {});
  }

  getRolesForForms() {
    return this.http.get<AdminRoleOption[]>(`${this.adminUrl}/form/roles`);
  }

  getStudentEmails() {
    return this.http.get<StudentEmailRow[]>(`${this.adminUrl}/students/emails`);
  }

  sendBulkMail(emails: string[], message: string, subject?: string) {
    return this.http.post<{ ok: boolean; sent: number }>(`${this.adminUrl}/messages/bulk`, {
      emails,
      message,
      subject,
    });
  }

  registerDocente(payload: RegisterDocentePayload) {
    return this.http.post<{ ok: boolean }>(`${this.adminUrl}/docentes`, payload);
  }

  getDocentes() {
    return this.http.get<DocenteRow[]>(`${this.adminUrl}/docentes`);
  }

  getCursos() {
    return this.http.get<CursoRow[]>(`${this.adminUrl}/cursos`);
  }

  getCurso(id: number) {
    return this.http.get<
      CursoRow & { docente?: { id: number }; estudiantes?: { id: number }[] }
    >(`${this.adminUrl}/cursos/${id}`);
  }

  createCurso(payload: CursoPayload) {
    return this.http.post<CursoRow>(`${this.adminUrl}/cursos`, {
      ...payload,
      estudiantesIds: payload.estudiantesIds ?? [],
    });
  }

  updateCurso(id: number, payload: Partial<CursoPayload>) {
    return this.http.put<CursoRow>(`${this.adminUrl}/cursos/${id}`, payload);
  }

  deleteCurso(id: number) {
    return this.http.delete(`${this.adminUrl}/cursos/${id}`);
  }

  toggleCurso(id: number) {
    return this.http.patch<CursoRow>(`${this.adminUrl}/cursos/${id}/toggle-active`, {});
  }
}
