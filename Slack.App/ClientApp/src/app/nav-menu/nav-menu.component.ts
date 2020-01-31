import { Component, NgZone } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { ChatMessage } from '../user/chat-message';
import { Tab } from '../user/tab.model';
import { SignalRService } from '../user/signal-r.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  userId: number = 0;
  settings: number = 0;
  workspaceName: string;
  workspaceId: number;
  user: User;
  friends: User[] = [];
  errorMessage: string;
  showMsg: boolean = false;
  chatMessage: ChatMessage;
  canSendMessage: boolean;
  tabs: Tab[];
  count: number = 0;
  currentRoom: string;
  countShow: number = 0;


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(private userService: UserService, private signalrService: SignalRService, private _ngZone: NgZone) {
    this.userId = +sessionStorage.getItem('userId');
    this.workspaceName = sessionStorage.getItem('workspaceName');
    this.workspaceId = +sessionStorage.getItem('workspaceId');

    this.subscribeToEvents();
    this.chatMessage = new ChatMessage();
    this.tabs = [];
    this.tabs.push(new Tab('Group', 'Welcome to Group'));
    this.currentRoom = 'Group';  
  }

  ngOnInit() {
    this.userService.GetUserById(this.userId).subscribe(
      user => { this.user = user; },
      error => this.errorMessage = error as any
    );

    this.userService.GetUserRecentChatList(this.userId, this.workspaceId).subscribe(
      friend => {
        this.friends = friend;
      },
      error => this.errorMessage = error as any
    );
  }
  private subscribeToEvents(): void {
    this.signalrService.connectionEstablished.subscribe(() => {
      this.canSendMessage = true;
    });

    this.signalrService.messageReceived.subscribe((message: ChatMessage) => {
      this._ngZone.run(() => {
        this.chatMessage = new ChatMessage();
        let room = this.tabs.find(t => t.heading == message.room);
        if (this.userId != message.userId )
        room.messageHistory.push(new ChatMessage(message.userId, message.user, message.message, message.room));
        console.log(this.tabs[0]['messageHistory']);
        this.count = Object.keys(this.tabs[0]['messageHistory']).length;
      });
    });
  }  
}

