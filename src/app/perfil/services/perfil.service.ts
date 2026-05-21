import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000';

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
