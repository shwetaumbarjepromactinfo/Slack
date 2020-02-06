import { Component, OnInit, ViewChildren, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormControlName, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../user/user';
import { Message } from '../chat/message';
import { MessageDetails } from '../chat/message-details';
import { GenericValidator } from '../shared/generic';
import { ChatMessage } from '../user/chat-message';
import { Tab } from '../user/tab.model';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../chat/message.service';
import { SignalRService } from '../user/signal-r.service';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators';
import { GroupService } from './group.service';
import { Group } from './group';

@Component({
  selector: 'app-view-group-chat',
  templateUrl: './view-group-chat.component.html',
  styleUrls: ['./view-group-chat.component.css']
})
export class ViewGroupChatComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  messageForm: FormGroup;
  editMessageForm: FormGroup;
  userId: number;
  userName: string;
  workspaceId: number;
  private sub: Subscription;
  groupId: number;
  user: User;
  group: Group;
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
  totalMember: number;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute, private messageService: MessageService, private signalrService: SignalRService, private _ngZone: NgZone, private groupService: GroupService) {
    this.subscribeToEvents();
    this.validationMessages = {
      MessageDescription: {
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
        this.groupId = +params.get('groupId');

        if (this.groupId != 0)
          this.getGroup(this.groupId);
        this.groupService.GetAllMessages(this.groupId).subscribe(
          messageDetails => {
            this.messageDetails = messageDetails;
            console.log(this.messageDetails);
          },
          error => this.errorMessage = error as any
        );
      });

   
  }

  getGroup(groupId: number): void {
    this.groupService.GetGroupByGroupId(groupId)
      .subscribe({
        next: (group: Group) => {
        this.group = group;
          this.totalMember = Object.keys(group['0']['users']).length;
        },
        error: err => this.errorMessage = err
      });
  }

  OnSubmit() {
    
    if (this.messageForm.valid) {
      const u = {
        ...this.message, ...this.messageForm.value
      };
      u.workspaceId = this.workspaceId;
      u.groupId = this.groupId;
      u.sentBy = this.userId;
      u.receivedBy = 0;
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
      this.messageService.GetMessageByMessageId(messageId).subscribe(
        data => {
          u.messageId = data['messageId'];
          u.groupId = data['groupId'];
          u.workspaceId = data['workspaceId'];
          u.sentBy = data['sentBy'];
          u.receivedBy = data['receivedBy'];
          u.createdAt = data['createdAt'];
          u.modifiedAt = new Date().toString();
          u.isActive = true;

          this.messageService.UpdaMessage(messageId, u).subscribe(
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
      this.chatMessage.groupId = this.groupId;
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

