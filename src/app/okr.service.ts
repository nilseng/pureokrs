import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { catchError, map, isEmpty, tap, shareReplay } from 'rxjs/operators';
import { hierarchy, HierarchyNode } from 'd3-hierarchy'

import { AuthenticationService } from './authentication.service';
import { Okr } from './okr/okr';
import { OkrNode } from './okr/okr-node';

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

  private deletedOkrSubject = new Subject<HierarchyNode<OkrNode>>()
  deletedOkr$ = this.deletedOkrSubject.asObservable()

  private savedOkrSubject = new Subject<OkrNode>()
  savedOkr$ = this.savedOkrSubject.asObservable()

  private okrTreeIsLoadingSubject = new BehaviorSubject<boolean>(true)
  okrTreeIsLoading$ = this.okrTreeIsLoadingSubject.asObservable()

  okrs$ = this.getOkrs()

  okrTree$ = this.okrs$.pipe(
    map((okrs: Okr[]) => {
      return hierarchy(this.createTreeStructure(okrs))
    }),
    tap(_ => this.okrTreeIsLoadingSubject.next(false)),
    shareReplay(1)
  )

  okrSaved(savedOkrNode: OkrNode) {
    this.savedOkrSubject.next(savedOkrNode)
  }

  okrTreeWithSave$ = combineLatest([this.okrTree$, this.savedOkr$])
    .pipe(
      map(([root, okrNode]) => {
        if (okrNode.okr.parent) {
          root.each((node) => {
            if (node.data.okr._id === okrNode.okr.parent) {
              if (!node.data.children) node.data.children = []
              if (node.data.children.map(child => child.okr._id).indexOf(okrNode.okr._id) === -1) {
                node.data.children.push(okrNode)
              }
            }
          })
        } else {
          if (root.data.children.map(child => child.okr._id).indexOf(okrNode.okr._id) === -1) {
            root.data.children.push(okrNode)
          }
        }
        return hierarchy(root.data)
      })
    )

  okrDeleted(deletedOkr: HierarchyNode<OkrNode>) {
    this.deletedOkrSubject.next(deletedOkr)
  }

  okrTreeWithDelete$ = combineLatest([this.okrTree$, this.deletedOkr$])
    .pipe(
      map(([root, deletedOkr]) => {
        if (deletedOkr.children && deletedOkr.children.length > 0) {
          root.data.children.push(...deletedOkr.data.children)
        }
        deletedOkr.parent.data.children.splice(deletedOkr.parent.data.children.indexOf(deletedOkr.data), 1)
        return hierarchy(root.data)
      }),
      catchError(this.handleError('okrTreeWithActions$'))
    )

  okrTreeWithActions$ = merge(this.okrTree$, this.okrTreeWithDelete$, this.okrTreeWithSave$).pipe(
    tap(okrTree => console.log(okrTree))
  )

  /** Recursive function for adding child OKRs to parent OKRs */
  private createTreeStructure(okrs: Okr[], okrNode?: OkrNode): OkrNode {
    if (!okrNode) {
      // Create the invisible root OKR node
      okrNode = new OkrNode(new Okr(''))
      // Creating an OKR Node for every OKR without a parent OKR and adding each to the root node children array
      okrNode.children = okrs.filter(okr => !okr.parent).map(okr => new OkrNode(okr))
    } else {
      // Creating an OKR Node for every child OKR and adding each to the parent OKR Node children array
      okrNode.children = okrs.filter(okr => okr.parent === okrNode.okr._id)
        .map(okr => new OkrNode(okr))
    }
    // Adding all OKR children recursively to their parents
    okrNode.children.map(node => this.createTreeStructure(okrs, node))
    return okrNode;
  }

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
        catchError(this.handleError<Okr[]>('getOkrs'))
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
      catchError(this.handleError<Okr[]>('searchOkrs', []))
    );
  }

  /**GET the child OKRs of parent OKR */
  getChildren(id: string): Observable<Okr[]> {
    return this.http.get<Okr[]>(`${this.okrsUrl}/children/${id}`,
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      }
    ).pipe(
      catchError(this.handleError<Okr[]>('getChildren', []))
    );
  }

  /**POST: add a new OKR to the server */
  createOkr(okr: Okr): Observable<Okr | Object> {
    return this.http.post(this.okrsUrl, { 'okr': okr },
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError(this.handleError<Okr>('createOkr'))
      )
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
        catchError(this.handleError<{}>('deleteOkr'))
      );
  }

  /**PUT: update the OKR on the server */
  updateOkr(okr: Okr): Observable<Okr> {
    return this.http.put<Okr>(this.okrsUrl, okr, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError<Okr>('updateOkr'))
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
        catchError(this.handleError('addChild'))
      );
  }

  /**PUT: Remove child OKR from parent OKR */
  removeChild(parentId: string, childId: string) {
    return this.http.put(`${this.okrsUrl}/removeChild`,
      { 'parentId': parentId, 'childId': childId },
      {
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          'Content-Type': 'application/json'
        }
      }).pipe(
        catchError(this.handleError('addChild'))
      )
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
