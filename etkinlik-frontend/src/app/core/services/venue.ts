import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
@Injectable({
  providedIn: 'root'
})
export class VenueService {

  private apiUrl = `${API_URL}/venues`;

  constructor(private http: HttpClient) { }

  getAllVenues(): Observable<any> {

    return this.http.get(this.apiUrl);

  }

}