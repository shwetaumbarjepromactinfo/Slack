import { Component, OnInit, ViewChild, ElementRef, NgZone, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { GenericValidator } from '../shared/generic';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { Message } from './message';
import { MessageService } from './message.service';
import { MessageDetails } from './message-details';
import { ChatMessage } from '../user/chat-message';
import { Tab } from '../user/tab.model';
import { SignalRService } from '../user/signal-r.service';

@Component({
  selector: 'app-view-chat',
  templateUrl: './view-chat.component.html',
  styleUrls: ['./view-chat.component.css']
})
export class ViewChatComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  messageForm: FormGroup;
  editMessageForm: FormGroup;
  userId: number;
  userName: string;
  workspaceId: number;
  private sub: Subscription;
  friendId: number;
  user: User;
  message: Message;
  messageDetails: MessageDetails[] = [];
  errorMessage: string;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  private genericValidator: GenericValidator;
  currentDate: Date;
  userSettings: number = 0;
  messageOption: number = 0;
  editMessage: number = 0;
  hide: number = 0;
  editMessageHide: number = 0;
  updatedDate: Date;
  chatMessage: ChatMessage;
  canSendMessage: boolean;
  tabs: Tab[];
  currentRoom: string;
  alertShow: boolean;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute, private messageService: MessageService, private signalrService: SignalRService, private _ngZone: NgZone  ) {
    this.subscribeToEvents();
    this.validationMessages = {
      MessageDescription : {
        required: 'Message field is required',
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
   
    this.chatMessage = new ChatMessage();
    this.tabs = [];
    this.tabs.push(new Tab('Group', 'Welcome to Group'));
    this.currentRoom = 'Group';
    
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.messageForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.messageForm);
    });

  }

  ngOnInit() {
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
    this.workspaceId = +sessionStorage.getItem('workspaceId');
    this.messageOption = this.editMessage = 0;
    this.currentDate = new Date();
    this.messageForm = this.fb.group({
      MessageDescription: ['', [Validators.required]]
    });

    this.editMessageForm = this.fb.group({
      MessageDescription: ['', [Validators.required]]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        this.friendId = +params.get('friendId');

        if (this.friendId != 0)
          this.getFriend(this.friendId);
        this.messageService.GetAllMessages(this.userId, this.friendId, this.workspaceId).subscribe(
          messageDetails => { this.messageDetails = messageDetails; },
          error => this.errorMessage = error as any
        );
      });

    if (Object.keys(this.tabs[0]['messageHistory']).length != 0) {
      console.log('in alert');
      this.alertShow = true;
      //wait 3 Seconds and hide
      setTimeout(function () {
        this.alertShow = false;
        console.log(this.edited);
      }.bind(this), 50000);
    }
  }

  getFriend(friendId: number): void {
    this.userService.GetUserById(friendId)
      .subscribe({
        next: (user: User) => { this.user = user },
        error: err => this.errorMessage = err
      });
  }

  OnSubmit() {
    console.log(this.messageForm.valid
      );
    if (this.messageForm.valid) {
      const u = {
        ...this.message, ...this.messageForm.value
      };
      u.workspaceId = this.workspaceId;
      u.sentBy = this.userId;
      u.receivedBy = this.friendId;
      u.createdAt = new Date().toString();
      u.modifiedAt = new Date().toString();
      u.isActive = true;

      this.messageService.AddMessage(u).subscribe(
        message => {
          this.sendMessage();
          this.ngOnInit();
        },
        error => this.errorMessage = error as any
      );

    }
    else {
      this.errorMessage = "Please enter message!";
    }
  }

  OnUpdate(messageId: number) {
    console.log(this.editMessageForm.valid
    );
    if (this.editMessageForm.valid) {
      const u = {
        ...this.message, ...this.editMessageForm.value
      };
      console.log(u);
      this.messageService.GetMessageByMessageId(messageId).subscribe(
        data =>
        {
          u.messageId = data['messageId'];
          u.workspaceId = data['workspaceId'];
          u.sentBy = data['sentBy'];
          u.receivedBy = data['receivedBy'];
          u.createdAt = data['createdAt'];
          u.modifiedAt = new Date().toString();
          u.isActive = true;

          this.messageService.UpdaMessage(messageId,u).subscribe(
            message => {
              this.ngOnInit();
            },
            error => this.errorMessage = error as any
          );
        },   
        error => this.errorMessage = error as any
      );
    }
    else
      this.errorMessage = "Please enter message!";
  }

  showUndoBtn(index) {
    if (this.messageOption == index) {
      this.hide = this.hide == 1 ? 0 : 1;
    }
    this.messageOption = index;
  }

  editMessageFunc(index) {
    if (this.editMessage == index) {
      this.editMessageHide = this.editMessageHide == 1 ? 0 : 1;
    }
    this.editMessage = index;
  }
  deleteMessageFunc(messageId: number) {
    this.messageService.DeleteMessage(messageId).subscribe(
      message => {
        this.ngOnInit();
      },
      error => this.errorMessage = error as any
    );
  }

  sendMessage() {
    if (this.canSendMessage) {
      this.chatMessage.userId = this.userId;
      this.chatMessage.user = this.userName;
      this.chatMessage.message = `Message from ${this.userName}`;
      this.chatMessage.room = this.currentRoom;
      this.signalrService.sendChatMessage(this.chatMessage);
    }
  }

  OnRoomChange(room) {
    this.currentRoom = room;
  }

  private subscribeToEvents(): void {
    this.signalrService.connectionEstablished.subscribe(() => {
      this.canSendMessage = true;
    });
    this.signalrService.messageReceived.subscribe((message: ChatMessage) => {
      this._ngZone.run(() => {
       
        
      });
    });
  }  
}
