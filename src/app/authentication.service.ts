import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

export interface UserDetails{
  _id: string;
  company: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  company: string;
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void{
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  public getToken(): string {
    if(!this.token){
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public logout(): void{
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      payload = JSON.parse(payload);
      payload.name = decodeURIComponent(payload.name);
      payload.email = decodeURIComponent(payload.email);
      payload.company = decodeURIComponent(payload.company);
      return payload;
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'get'|'post', type: 'login'|'register'|'company',
    user?: TokenPayload): Observable<any>{
      let base;

      if (method === 'post'){
        base = this.http.post(`/api/${type}`, user);
      } else {
        base = this.http.get(`/api/${type}`, {headers: {Authorization:
          `Bearer ${this.getToken()}`}});
      }

      const request = base.pipe(
        map((data: TokenResponse) => {
          if (data.token){
            this.saveToken(data.token);
          }
          return data;
        })
      );

      return request;
    }

    public register(user: TokenPayload): Observable<any>{
      return this.request('post', 'register', user);
    }

    public login(user: TokenPayload): Observable<any>{
      return this.request('post', 'login', user);
    }

    public company(): Observable<any> {
      return this.request('get', 'company');
    }
}
