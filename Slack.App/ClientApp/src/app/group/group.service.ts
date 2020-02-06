import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GroupDetails } from './group-details';
import { tap, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { Group } from './group';
import { MessageDetails } from '../chat/message-details';

@Injectable()
export class GroupService {

  private groupUrl = "https://localhost:44397/api/group";

  constructor(private http: HttpClient) { }

  GetGroupByGroupId(groupId: number): Observable<GroupDetails> {
    const url = `${this.groupUrl}/${groupId}`;
    return this.http.get<GroupDetails>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetGroupByUserId(userId: number): Observable<Group[]> {
    const url = `${this.groupUrl}/${userId}/all-group`;
    return this.http.get<Group>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddGroup(group: Group): Observable<Group> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Group>(this.groupUrl, group, { headers })
      .pipe(
        tap(data => console.log('group:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetAllMessages(groupId: number): Observable<MessageDetails[]> {
    const url = `${this.groupUrl}/${groupId}/get-messages`;
    return this.http.get<MessageDetails[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
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
