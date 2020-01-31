import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { WorkspaceLoginComponent } from './login/workspace-login.component';
import { UserSignInComponent } from './login/user-sign-in.component';
import { WorkspaceService } from './login/workspace.service';
import { ViewChatComponent } from './chat/view-chat.component';
import { UserService } from './user/user.service';
import { MessageService } from './chat/message.service';
import { ReplyService } from './chat/reply.service';
import { SignalRService } from './user/signal-r.service';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    WorkspaceLoginComponent,
    UserSignInComponent,
    ViewChatComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: WorkspaceLoginComponent, pathMatch: 'full' },
      { path: 'Sign-In/:workspaceId', component: UserSignInComponent },
      { path: 'view-chat/:friendId', component: ViewChatComponent }
    ])
  ],
  providers: [WorkspaceService, UserService, MessageService, ReplyService, SignalRService],
  bootstrap: [AppComponent]
})
export class AppModule { }
