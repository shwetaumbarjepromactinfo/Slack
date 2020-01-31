import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Workspace } from './workspace';
import { GenericValidator } from '../shared/generic';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from './workspace.service';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.css']
})
export class UserSignInComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  userId: number = 0;
  userForm: FormGroup;
  private sub: Subscription;
  workspace: Workspace;
  errorMessage: string;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private workspaceService: WorkspaceService, private userService: UserService) {
    this.validationMessages = {
      UserEmail: {
        required: 'Email address field is required',
      },
      UserPassword: {
        required: 'Password field is required',
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.userForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.userForm);
    });

  }

  ngOnInit() {
    this.userForm = this.fb.group({
      UserEmail: ['', [Validators.required]],
      UserPassword: ['', [Validators.required]]
    });
  }

  OnSubmit() {
    if (this.userForm.valid) {
      let userEmail = this.userForm.value.UserEmail;
      let userPassword = this.userForm.value.UserPassword;
      this.userService.GetUserLogin(userEmail, userPassword).subscribe(
        user => {
         // console.log(user['userId']);
          sessionStorage.setItem('userId', user["userId"]);
          sessionStorage.setItem('userName', user["fullName"]);
          this.router.navigate(['/view-chat',user["userId"]]);
        },
        error => this.errorMessage = error as any
      );

    }
  }
}
