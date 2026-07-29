import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${API_URL}/categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any> {

    return this.http.get(this.apiUrl);

  }

}