import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  baseURL: string = environment.baseURL;

  constructor(private http: HttpClient) { }


  saveUserId(id: string): any {
    localStorage.setItem('UserID', id);
  }

  getUserId(): any {
    return localStorage.getItem('UserID');
  }

  saveUserEmail(email: string): any {
    localStorage.setItem('UserEmail', email);
  }

  getUserEmail(): any {
    return localStorage.getItem('UserEmail');
  }

  saveUserToken(token: string): any {
    localStorage.setItem('token', token);
  }

  getUserToken(): any {
    return localStorage.getItem('token');
  }


  getApps(): Observable<string[]> {
    return this.http.get(`${this.baseURL}/apps`) as Observable<string[]>;
  }

  getLogs(app: string, environment: string, from?: number) {
    if (from)
      return this.http.get(`${this.baseURL}/logs?app=${app}&environment=${environment}&from=${from}`);

    return this.http.get(`${this.baseURL}/logs?app=${app}&environment=${environment}`);
  }







}
