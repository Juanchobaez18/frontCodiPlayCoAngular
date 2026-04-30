import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';


@Injectable({ providedIn: 'root' })
export class UserService {
    private api = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    getProfile(): Observable<UserInterface> {
        return this.http.get<UserInterface>(`${this.api}/users/profile`);
    }
}
