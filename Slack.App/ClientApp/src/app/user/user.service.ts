import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class UserService {

  private userUrl = "https://localhost:44397/api/user";

  constructor(private http: HttpClient) { }

  AddUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(this.userUrl, user, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  UpdaUser(userId: number,user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.userUrl}/${userId}`;
    return this.http.put<User>(url, user, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetUserById(userId: number): Observable<User> {
    const url = `${this.userUrl}/${userId}`;
    return this.http.get<User>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetUserRecentChatList(userId: number, workspaceId: number): Observable<User[]> {
    const url = `${this.userUrl}/${userId}/workspace/${workspaceId}`;
    return this.http.get<User[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetUserLogin(userEmail: string, userPassword: string): Observable<User> {
    const url = `${this.userUrl}/${userEmail}/${userPassword}`;
    return this.http.get<User>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  DeleteUser(userId: number): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.userUrl}/${userId}`;

    return this.http.delete<User>(url, { headers })
      .pipe(
        tap(data => console.log('delete User:' + userId)),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `an error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `backend return code ${err.status} : ${err.body.error}`;
    }
    console.error(errorMessage);
    return _throw(errorMessage);
  }
}
