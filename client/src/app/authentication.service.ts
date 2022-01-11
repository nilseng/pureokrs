import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { map, catchError, tap, last } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserDetails {
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

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): Observable<UserDetails> {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      payload = JSON.parse(payload);
      payload.name = decodeURIComponent(payload.name);
      payload.email = decodeURIComponent(payload.email);
      payload.company = decodeURIComponent(payload.company);
      return of(payload);
    } else {
      return EMPTY;
    }
  }

  public getUserDetailsSync(): UserDetails {
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

  public isLoggedIn() {
    const user = this.getUserDetailsSync()
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'get' | 'post', type: 'login' | 'register' | 'company',
    user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    } else {
      base = this.http.get(`/api/${type}`, {
        headers: {
          Authorization:
            `Bearer ${this.getToken()}`
        }
      });
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public company(): Observable<any> {
    return this.request('get', 'company');
  }

  public addUser(user: TokenPayload): Observable<{}> {
    return this.http.post('/api/adduser', user,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        }
      }).pipe(
        tap(),
        catchError(this.handleError('addUser'))
      );
  }

  public sendResetEmail(email: string): Observable<any> {
    return this.http.post('/api/sendresetemail', { 'email': email },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .pipe(
        tap()
      );
  }

  public newPassword(email: string, token: string, password: string): Observable<any> {
    return this.http.post('/api/newpassword',
      { 'email': email, 'token': token, 'password': password },
      {
        headers: { 'Content-Type': 'application/json' }
      })
      .pipe(
        map((data: TokenResponse) => {
          if (data.token) {
            this.saveToken(data.token);
          }
          return data;
        })
      );
  }

  /**
   * Handle Http operation that failed
   * Let the app continue
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //TODO: Send the error to remote logging infrastructure
      console.error(error);

      //TODO: Better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
