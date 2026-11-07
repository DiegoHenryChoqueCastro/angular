import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Short } from '../pages/short/short';

@Injectable({
  providedIn: 'root',
})
export class Data {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/datos';
  private baseUrl = 'http://localhost:3000/api';

  getDatos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }

  getShorts(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/shorts`);
  }

  // Obtener shorts por ID especifíco primero de MySQL (para la página short)
  getShortsOrderedFirst(id: string | number): Observable<Short[]> {
    return this.http.get<Short[]>(`${this.baseUrl}/shorts/${id}`);
  }
}