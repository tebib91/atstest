import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'product';
  private urlGetAll = 'products';
  private category = 'categories';
  constructor(private http: HttpClient) { }

  getProducts(params: any = {}): Observable<any> {
    return this.http.get<any>(`${environment.base}/${this.urlGetAll}` , { params })
      .pipe(
        tap(_ => this.log('fetched Products')),
        catchError(this.handleError<any>('getProducts', []))
      );
  }

  getCategory(): Observable<any> {
    return this.http.get<any>(`${environment.base}/${this.category}`)
      .pipe(
        tap(_ => this.log('fetched Category')),
        catchError(this.handleError<any>('getCategory', []))
      );
  }

  searchCategory(term: string): Observable<any> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<any>(`${environment.base}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found category matching "${term}"`) :
         this.log(`no category matching "${term}"`)),
      catchError(this.handleError<any>('searchcategory', []))
    );
  }
  /** GET Product by id. Will 404 if id not found */
  getProduct(id: any): Observable<any> {
    const url = `${environment.base}/${this.url}/${id}`;
    return this.http.get<any>(url).pipe(
      tap(_ => this.log(`fetched Product id=${id}`)),
      catchError(this.handleError<any>(`getProduct id=${id}`))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(`Product: ${message}`);
  }
}
