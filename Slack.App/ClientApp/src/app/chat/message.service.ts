import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Message } from './message';
import { tap } from 'rxjs/operators/tap';
import { catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { MessageDetails } from './message-details';

@Injectable()
export class MessageService {

  private messageUrl = "https://localhost:44397/api/message";

  constructor(private http: HttpClient) { }

  GetMessageByMessageId(messageId: number): Observable<Message> {
    const url = `${this.messageUrl}/${messageId}`;
    return this.http.get<Message>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  GetAllMessages(userId: number, friendId: number, workspaceId: number): Observable<MessageDetails[]> {
    const url = `${this.messageUrl}/${userId}/friend/${friendId}/workspace/${workspaceId}`;
    return this.http.get<MessageDetails[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddMessage(message: Message): Observable<Message> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Message>(this.messageUrl, message, { headers })
      .pipe(
        tap(data => console.log('message:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  DeleteMessage(messageId: number): Observable<Message> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.messageUrl}/${messageId}`;

    return this.http.delete<Message>(url, { headers })
      .pipe(
        tap(data => console.log('delete Message:' + messageId)),
        catchError(this.handleError)
      );
  }

  UpdaMessage(messageId: number, message: Message): Observable<Message> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.messageUrl}/${messageId}`;
    return this.http.put<Message>(url, message, { headers })
      .pipe(
        tap(data => console.log('message:' + JSON.stringify(data))),
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
