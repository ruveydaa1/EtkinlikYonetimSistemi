import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

@Injectable({
    providedIn: 'root'
})
export class User {

    private apiUrl = `${API_URL}/users`;

    constructor(private http: HttpClient) { }

    register(user: any): Observable<any> {

        return this.http.post(this.apiUrl, user);

    }

    login(user: any): Observable<any> {

        return this.http.post(
            `${API_URL}/auth/login`,
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

    changePassword(id: number, data: any): Observable<any> {

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.put(
            `${this.apiUrl}/${id}/change-password`,
            data,
            { headers }
        );

    }

    deleteUser(id: number): Observable<any> {

        const token = localStorage.getItem('token');

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.delete(`${this.apiUrl}/${id}`, { headers });

    }

}