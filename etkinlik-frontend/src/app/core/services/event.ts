import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:5000/api/events';


  constructor(
    private http: HttpClient
  ) { }


  getAllEvents(): Observable<any> {

    return this.http.get<any>(this.apiUrl);

  }

  // ID'ye göre tek etkinliği çeken doğru metot
  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Kategorileri veritabanından çekmek için
  getCategories(): Observable<any> {
    return this.http.get('http://localhost:5000/api/categories');
  }

  // Mekanlar üzerinden benzersiz şehirleri çekmek için
  getCities(): Observable<any> {
    return this.http.get('http://localhost:5000/api/venues/cities');
  }

}