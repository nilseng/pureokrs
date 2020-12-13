import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { UserDetails, AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = '/api/user';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  /**GET Okr by id. Will return 404 when not found */
  getUser(id: string): Observable<UserDetails> {
    const url = `${this.userUrl}/${id}`;
    return this.http.get<UserDetails>(url,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }).pipe(
        catchError(this.handleError<UserDetails>(`getUser id=${id}`))
      );
  }

  /**GET users by company. Will return 404 when not found */
  getUsers(): Observable<{ User }> {
    const url = `${this.userUrl}/company/users`;
    return this.http.get<{ User }>(url,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }).pipe(
        catchError(this.handleError<{ User }>(`getUsers`))
      );
  }

  searchUsers(term: string): Observable<UserDetails[]> {
    if (!term.trim()) {
      //if not search term, return empty user array
      return of([]);
    }
    return this.http.get<UserDetails[]>(`${this.userUrl}/search/${term}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      catchError(this.handleError<UserDetails[]>('searchUsers', []))
    );
  }

  deleteUser(user: UserDetails): Observable<{}> {
    return this.http.delete<{}>(`${this.userUrl}/delete/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      catchError(this.handleError<{}>('deleteUser', {}))
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
