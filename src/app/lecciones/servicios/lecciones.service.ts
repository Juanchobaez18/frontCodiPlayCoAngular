// src/app/lecciones/servicios/lecciones.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { Leccion, CrearLeccionDto, ActualizarLeccionDto, ProgresoLeccion } from '../modelos/leccion.model';

@Injectable({
  providedIn: 'root'
})
export class LeccionesService {
  private readonly API_URL = '/api/lecciones';

  constructor(private http: HttpClient) {}

  getLecciones(): Observable<Leccion[]> {
    return this.http.get<Leccion[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  getLeccionById(id: string): Observable<Leccion> {
    return this.http.get<Leccion>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getLeccionesPublicadas(): Observable<Leccion[]> {
    return this.http.get<Leccion[]>(`${this.API_URL}/publicadas`).pipe(
      catchError(this.handleError)
    );
  }

  createLeccion(leccion: CrearLeccionDto): Observable<Leccion> {
    return this.http.post<Leccion>(this.API_URL, leccion).pipe(
      catchError(this.handleError)
    );
  }

  updateLeccion(id: string, leccion: ActualizarLeccionDto): Observable<Leccion> {
    return this.http.patch<Leccion>(`${this.API_URL}/${id}`, leccion).pipe(
      catchError(this.handleError)
    );
  }

  deleteLeccion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  marcarComoCompletada(leccionId: string): Observable<ProgresoLeccion> {
    return this.http.post<ProgresoLeccion>(`${this.API_URL}/${leccionId}/progreso`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getProgresoLeccion(leccionId: string): Observable<ProgresoLeccion> {
    return this.http.get<ProgresoLeccion>(`${this.API_URL}/${leccionId}/progreso`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `Código de error ${error.status}, ` +
        `mensaje: ${error.error?.message || error.message}`
      );
    }
    
    // Retornar un observable con un mensaje de error amigable
    return throwError(() => new Error('Algo salió mal; por favor intenta nuevamente más tarde.'));
  }
}
