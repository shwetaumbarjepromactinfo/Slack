import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Reply } from './reply';
import { tap, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import { ReplyDetails } from './reply-details';

@Injectable()
export class ReplyService {

  private replyUrl = "https://localhost:44397/api/reply";

  constructor(private http: HttpClient) { }

  GetReplyByReplyId(replyId: number): Observable<Reply> {
    const url = `${this.replyUrl}/${replyId}`;
    return this.http.get<Reply>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  GetAllReplies(messageId: number): Observable<ReplyDetails[]> {
    const url = `${this.replyUrl}/message/${messageId}`;
    return this.http.get<ReplyDetails[]>(url)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  AddReply(reply: Reply): Observable<Reply> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Reply>(this.replyUrl, reply, { headers })
      .pipe(
        tap(data => console.log('reply:' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  DeleteReply(replyId: number): Observable<Reply> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.replyUrl}/${replyId}`;

    return this.http.delete<Reply>(url, { headers })
      .pipe(
        tap(data => console.log('delete Reply:' + replyId)),
        catchError(this.handleError)
      );
  }

  UpdaReply(replyId: number, reply: Reply): Observable<Reply> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.replyUrl}/${replyId}`;
    return this.http.put<Reply>(url, reply, { headers })
      .pipe(
        tap(data => console.log('update reply:' + JSON.stringify(data))),
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
