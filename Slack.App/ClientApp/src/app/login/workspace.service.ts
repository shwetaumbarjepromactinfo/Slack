import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Workspace } from './workspace';
import { tap } from 'rxjs/operators/tap';
import { _throw } from 'rxjs/observable/throw';
import { catchError } from 'rxjs/operators/catchError';
import { User } from '../user/user';

@Injectable()
export class WorkspaceService {

  private workspaceUrl = "https://localhost:44397/api/workspace";

  constructor(private http: HttpClient) { }

  GetAllUserByWorkspaceId(workspaceId: number): Observable<User> {
    const url = `${this.workspaceUrl}/${workspaceId}/all-user`;
    return this.http.get<Workspace>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetWorkspaceById(workspaceId: number): Observable<Workspace> {
    const url = `${this.workspaceUrl}/${workspaceId}`;
    return this.http.get<Workspace>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetWorkspaceByName(workspaceName: string): Observable<Workspace> {
    const url = `${this.workspaceUrl}/${workspaceName}/workspace-name`;
    return this.http.get<Workspace>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddWorkspace(workspace: Workspace): Observable<Workspace> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Workspace>(this.workspaceUrl, workspace, { headers })
      .pipe(
        tap(data => console.log('user:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  DeleteWorkspace(workspaceId: number): Observable<Workspace> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.workspaceUrl}/${workspaceId}`;

    return this.http.delete<Workspace>(url, { headers })
      .pipe(
        tap(data => console.log('delete User:' + workspaceId)),
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
