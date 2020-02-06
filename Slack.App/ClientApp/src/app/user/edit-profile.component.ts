import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../shared/generic';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';
import {ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@aspnet/signalr';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @Input() multiple: boolean = false;
  @ViewChild('fileInput') inputEl: ElementRef;
  userId: number;
  userName: string;
  workspaceId: number;
  user: User;
  editForm: FormGroup;
  CurrentFile: File;
  ImageSource: string|any;
  errorMessage: string;
  fileToUpload: File = null;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string }
  };
  selectedFile: File = null;
  private sub: Subscription;

  private genericValidator: GenericValidator;
 

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.validationMessages = {
      FullName: {
        required: 'Full name field is required',
      },
      DisplayName: {
        required: 'Display name field is required',
      },
      UserStatus: {
        required: 'Status field is required',
      },
      Position: {
        required: 'Position field is required',
      },
      PhoneNumber: {
        required: 'Phone number field is required',
      },
      ImagePath: {
        required: 'Image field is required',
      },

    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.userId = +sessionStorage.getItem('userId');
    this.userName = sessionStorage.getItem('userName');
    this.workspaceId = +sessionStorage.getItem('workspaceId');

    this.editForm = this.fb.group({
      FullName: ['', [Validators.required]],
      DisplayName: ['', [Validators.required]],
      UserStatus: ['', [Validators.required]],
      Position: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      ImagePath: null
    });
       
    this.getUser(this.userId);
    
      
  }

  getUser(userId: number): void {
    this.userService.GetUserById(userId)
      .subscribe({
        next: (user: User) => {
          this.user = user,
          this.displayUser(user)
        },
        error: err => this.errorMessage = err
      });
  }

  displayUser(user: User): void {

    if (this.editForm) {
      this.editForm.reset();
    }

    this.user = user;
    // Update the data on the form
    this.editForm.patchValue({
      FullName: this.user['fullName'],
      DisplayName: this.user['displayName'],
      UserStatus: this.user['userStatus'],
      Position: this.user['position'],
      PhoneNumber: this.user['phoneNumber'],
     

    });

  }


  OnSubmit() {
    this.uploadFileToActivity();
    if (this.editForm.valid) {
      const u = {
        ...this.user, ...this.editForm.value
      };
      u.createdAt = this.user['createdAt'];
      u.modifiedAt = new Date().toString();
      u.isActive = true;
      u.ImagePath = this.fileToUpload.name;
      console.log(u);
      this.userService.UpdaUser(this.userId,u).subscribe(
        message => {
         
          this.ngOnInit();
        },
        error => this.errorMessage = error as any
      );

    }
    else {
      this.errorMessage = "Please enter message!";
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity() {
    console.log('in method');
    this.userService.postFile(this.fileToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }
  
}
