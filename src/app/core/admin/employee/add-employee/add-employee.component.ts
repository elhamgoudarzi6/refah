import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from './../../../../auth/local-storage.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [MessageService]
})
export class AddEmployeeComponent implements OnInit {
  form: FormGroup | any;
  errorMessages = {
    mobile: [
      { type: 'required', message: 'شماره موبایل را وارد کنید.' },
      { type: 'minlength', message: 'شماره موبایل باید 11 رقم باشد.' },
      { type: 'maxlength', message: 'شماره موبایل باید 11 رقم باشد.' },
    ],
    personalCode: [{ type: 'required', message: 'کد پرسنلی را وارد کنید.' }],
    firstName: [{ type: 'required', message: ' نام را وارد کنید.' }],
    lastName: [{ type: 'required', message: ' نام خانوادگی را وارد کنید.' }],
    nationalCode: [{ type: 'required', message: 'کد ملی را وارد کنید.' }],
  };
  constructor(
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private service: AdminService,
    public ref: DynamicDialogRef
  ) {

  }
  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      personalCode: new FormControl(null, Validators.compose([Validators.required])),
      nationalCode: new FormControl(null, Validators.compose([Validators.required])),
      firstName: new FormControl(null, Validators.compose([Validators.required])),
      lastName: new FormControl(null, Validators.compose([Validators.required])),
      mobile: new FormControl(null),
      phoneNumber: new FormControl(null),
    });
  }

  submitForm(): void {
    this.service
      .register(this.localStorage.userToken,this.form.value)
      .subscribe((response: any) => {
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
