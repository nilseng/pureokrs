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
        tap(_ => console.log(`fetched User w id=${id}`)),
        catchError(this.handleError<UserDetails>(`getUser id=${id}`))
      );
  }

  /**GET users by company. Will return 404 when not found */
  getUsers(company: string): Observable<{User}> {
    const url = `${this.userUrl}/company/users`;
    return this.http.get<{User}>(url,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }).pipe(
        tap((users: {User}) => console.log(`fetched users for company ${company}`)),
        catchError(this.handleError<{User}>(`getUsers company=${company}`))
      );
  }

  searchUsers(term: string): Observable<{}> {
    console.log('User service searching for', term);
    if (!term.trim()) {
      //if not search term, return empty user array
      return of([]);
    }
    return this.http.get<{}>(`${this.userUrl}/search/${term}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      tap(_ => console.log(`Search complete for term "${term}"`)),
      catchError(this.handleError<{}>('searchUsers', {}))
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
