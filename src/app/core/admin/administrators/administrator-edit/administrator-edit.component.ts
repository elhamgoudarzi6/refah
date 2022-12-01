import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from './../../admin.service';
import { LocalStorageService } from './../../../../auth/local-storage.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-administrator-edit',
  templateUrl: './administrator-edit.component.html',
  styleUrls: ['./administrator-edit.component.scss'],
  providers: [MessageService]
})
export class AdministratorEditComponent implements OnInit {
  admin: any;
  form: FormGroup | any;
  errorMessages = {
    lastName: [
      { type: 'required', message: 'نام و نام خانوادگی را وارد کنید.' },
    ],
    firstName: [
      { type: 'required', message: 'نام و نام خانوادگی را وارد کنید.' },
    ],
  };
  constructor(
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private service: AdminService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.admin = this.config.data.admin;
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      firstName: new FormControl(
        this.admin.firstName,
        Validators.compose([Validators.required])
      ),
      lastName: new FormControl(this.admin.lastName),
    });
  }

 

  submitForm(): void {
    this.service
      .updateAdmin(this.localStorage.userToken, this.admin._id, this.form.value)
      .subscribe((response: { success: boolean; data: any; }) => {
        if (response.success === true) {
          this.ref.close(true);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: ' ثبت اطلاعات ',
            detail: response.data,
          });
        }
      });
  }
}
