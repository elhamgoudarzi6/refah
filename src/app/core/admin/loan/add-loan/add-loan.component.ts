import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from './../../../../auth/local-storage.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';
@Component({
  selector: 'app-add-loan',
  templateUrl: './add-loan.component.html',
  styleUrls: ['./add-loan.component.scss'],
  providers: [MessageService]

})

export class AddLoanComponent implements OnInit {
  form: FormGroup | any;
  errorMessages = {
    title: [{ type: 'required', message: 'عنوان تسهیلات را وارد کنید.' }],
    amount: [{ type: 'required', message: ' مبلغ تسهیلات را وارد کنید.' }],
    ceilingNum: [{ type: 'required', message: ' تعداد تسهیلات را وارد کنید.' }],
    condition: [{ type: 'required', message: 'شرط تسهیلات را وارد کنید' }],
    percent: [{ type: 'required', message: ' درصد سود	را وارد کنید.' }],
    number: [{ type: 'required', message: ' تعداد اقساط	را وارد کنید.' }],
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
      title: new FormControl(null, Validators.compose([Validators.required])),
      amount: new FormControl(null, Validators.compose([Validators.required])),
      ceilingNum: new FormControl(null, Validators.compose([Validators.required])),
      condition: new FormControl(null, Validators.compose([Validators.required])),
      percent: new FormControl(null, Validators.compose([Validators.required])),
      number: new FormControl(null, Validators.compose([Validators.required])),
    });
  }

  submitForm(): void {
    this.service
      .registerLoan(this.localStorage.userToken,this.form.value)
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
