import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class User {

    private apiUrl = 'http://localhost:5000/api/users';

    constructor(private http: HttpClient) { }

    register(user: any): Observable<any> {

        return this.http.post(this.apiUrl, user);

    }

    login(user: any): Observable<any> {

        return this.http.post(
            'http://localhost:5000/api/auth/login',
            user
        );

    }

    getUserById(id: number): Observable<any> {

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/${id}`, { headers });

    }

    updateUser(id: number, user: any): Observable<any> {

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.put(`${this.apiUrl}/${id}`, user, { headers });

    }

}