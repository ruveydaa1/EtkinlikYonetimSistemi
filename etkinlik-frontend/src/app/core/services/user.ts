import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}