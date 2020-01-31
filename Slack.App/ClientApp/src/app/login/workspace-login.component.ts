import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Workspace } from './workspace';
import { GenericValidator } from '../shared/generic';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { debounceTime } from 'rxjs/operators';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-workspace-login',
  templateUrl: './workspace-login.component.html',
  styleUrls: ['./workspace-login.component.css']
})
export class WorkspaceLoginComponent implements OnInit {
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

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private workspaceService: WorkspaceService) {
    this.validationMessages = {
      WorkspaceName: {
        required: 'Workspace name field is required',
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
      WorkspaceName: ['', [Validators.required]]
    });
  }

  OnSubmit() {
    if (this.userForm.valid) {
      let workspaceName = this.userForm.value.WorkspaceName;
      this.workspaceService.GetWorkspaceByName(workspaceName).subscribe(
        workspace => {
          console.log(workspace["workSpaceName"]);
          sessionStorage.setItem('workspaceId', workspace["workSpaceId"]);
          sessionStorage.setItem('workspaceName', workspace["workSpaceName"]);
          this.router.navigate(['/Sign-In', workspace["workSpaceId"]]);
        },
        error => this.errorMessage = error as any
      );

    }
  }

}
