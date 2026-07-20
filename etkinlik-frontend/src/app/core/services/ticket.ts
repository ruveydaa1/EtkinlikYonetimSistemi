import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Ticket {

  private apiUrl = "http://localhost:5000/api/tickets";

  constructor(private http: HttpClient) {}

  getMyTickets(): Observable<any> {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      `${this.apiUrl}/my`,
      { headers }
    );

  }

}