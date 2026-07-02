import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);
  private readonly API = environment.apiUrl;

  updateBasicInfo(userId: number, data: { name: string; lastName: string }): Observable<any> {
    return this.http.put(`${this.API}/users/${userId}`, data);
  }

  updatePassword(userId: number, password: string): Observable<any> {
    return this.http.put(`${this.API}/users/${userId}`, { password });
  }

  uploadAvatar(userId: number, file: File): Observable<any> {
    const body = new FormData();
    body.append('avatar', file);
    return this.http.patch(`${this.API}/users/${userId}/avatar`, body);
  }
}

