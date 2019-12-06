import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Okr, KeyResult } from './okr/okr';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OkrService {

  private okrsUrl = '/api/okr';

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  /**GET OKRs from the server */
  getOkrs(): Observable<Okr[]> {
    return this.http.get<Okr[]>(`${this.okrsUrl}/company/all`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    )
      .pipe(
        tap(),
        catchError(this.handleError<Okr[]>('getOkrs'))
      );
  }

  /**GET all OKRs at level 0 */
  getCompanyOkrs(): Observable<Okr[]> {
    return this.http.get<Okr[]>(`${this.okrsUrl}/company/level0`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }).pipe(
        tap(),
        catchError(this.handleError<Okr[]>('getCompanyOKRs'))
      );
  }

  /**GET Okr by id. Will return 404 when not found */
  getOkr(id: string): Observable<Okr> {
    const url = `${this.okrsUrl}/${id}`;
    return this.http.get<Okr>(url,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      tap(),
      catchError(this.handleError<Okr>(`getOkr id=${id}`))
    );
  }

  /**GET okrs whose objective contains search term */
  searchOkrs(term: string): Observable<Okr[]> {
    if (!term.trim()) {
      //if not search term, return empty OKR array
      return of([]);
    }
    return this.http.get<Okr[]>(`${this.okrsUrl}/objective/${term}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      tap(),
      catchError(this.handleError<Okr[]>('searchOkrs', []))
    );
  }

  /**GET the child OKRs of parent OKR */
  getChildren(id: string): Observable<{}> {
    return this.http.get<{}>(`${this.okrsUrl}/children/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      tap(),
      catchError(this.handleError<{}>('getChildren', {}))
    );
  }

  /**POST: add a new OKR to the server */
  createOkr(okr: Okr): Observable<Okr> {
    return this.http.post(this.okrsUrl, {'okr': okr},
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        }
      }).pipe(
        tap((okr: Okr) => {}),
        catchError(this.handleError<Okr>('createOkr'))
      );
  }

  /**DELETE: delete the OKR from the server */
  deleteOkr(okr: Okr | string): Observable<{}> {
    const id = typeof okr === 'string' ? okr : okr._id;
    const url = `${this.okrsUrl}/${id}`;

    return this.http.delete<{}>(url,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        }
      }).pipe(
        tap(),
        catchError(this.handleError<{}>('deleteOkr'))
      );
  }

  /**PUT: update the OKR on the server */
  updateOkr(okr: Okr): Observable<any> {
    const id = typeof okr === 'string' ? okr : okr._id;

    return this.http.put(this.okrsUrl, {okr}, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(),
      catchError(this.handleError<any>('updateOkr'))
    );
  }

  /**PUT: Add child OKR to parent OKR */
  addChild(parentId: string, childId: string): Observable<any> {
    return this.http.put(`${this.okrsUrl}/child`,
      { 'parentId': parentId, 'childId': childId },
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        }
      }).pipe(
        tap(),
        catchError(this.handleError('addChild'))
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
