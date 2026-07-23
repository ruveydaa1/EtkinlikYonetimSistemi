import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Registration {

  private apiUrl = 'http://localhost:5000/api/registrations';


  constructor(
    private http: HttpClient
  ) { }


  getMyRegistrations(): Observable<any> {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      `${this.apiUrl}/my`,
      { headers }
    );

  }


  // Etkinliğe kayıt oluşturma
  createRegistration(eventId: number): Observable<any> {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    return this.http.post(
      this.apiUrl,
      {
        event_id: eventId
      },
      {
        headers
      }
    );

  }

  // Organizatörün etkinliklerindeki başvuruları getirir
  getOrganizerEvents(): Observable<any> {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    return this.http.get(
      `${this.apiUrl}/organizer/events`,
      {
        headers
      }
    );

  }

  // Kayıt durumunu güncelleme (Onay / Red)
  updateRegistration(
    id: number,
    durum: string
  ): Observable<any> {

    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });


    return this.http.put(

      `${this.apiUrl}/${id}`,

      {
        durum: durum
      },

      {
        headers
      }

    );

  }


}