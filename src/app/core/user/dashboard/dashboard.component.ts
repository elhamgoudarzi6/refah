import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from '../user.service';
import { TokenService } from 'src/app/auth/token.service';
import { LocalStorageService } from 'src/app/auth/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]

})
export class DashboardComponent implements OnInit {
  loans: any[] = [];
  cols: any[] | any;
  loanID: any;
  display: boolean = false;
  form: any;
  Notification: any[] = [];
  deadline: any;
  spinnerSuccess: boolean = true;
  errorMessages = {
    mobile: [
      { type: 'required', message: 'شماره موبایل را وارد کنید.' },
      { type: 'minlength', message: 'شماره موبایل باید 11 رقم باشد.' },
      { type: 'maxlength', message: 'شماره موبایل باید 11 رقم باشد.' },
    ],
    phoneNumber: [{ type: 'required', message: 'تلفن ثابت را وارد کنید.' }],
  };
  constructor(
    private messageService: MessageService,
    private service: UserService,
    private token: TokenService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.service.showNotification(this.localStorage.userToken).subscribe((response: any) => {
      if (response.success === true) {
        this.Notification = response.data;
      }
    })

    this.service.showDeadline(this.localStorage.userToken).subscribe((response: any) => {
      if (response.success === true) {
        this.deadline = response.data;
      }
    })

    this.form = new FormGroup({
      personalCode: new FormControl(this.localStorage.userPersonalCode,),
      firstName: new FormControl(this.localStorage.userLastName),
      lastName: new FormControl(this.localStorage.userFirstName),
      nationalCode: new FormControl(this.localStorage.userNationalCode),
      phoneNumber: new FormControl(null, Validators.compose([Validators.required])),
      mobile: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.form.controls['personalCode'].disable();
    this.form.controls['firstName'].disable();
    this.form.controls['lastName'].disable();
    this.form.controls['nationalCode'].disable();


    this.getLoans();
    this.cols = [
      { field: 'title', header: 'عنوان تسهیلات' },
      { field: 'amount', header: 'مبلغ وام	' },
      { field: 'number', header: 'تعداد اقساط	' },
      { field: 'ceilingNum', header: 'تعداد تسهیلات' },
      { field: 'condition', header: 'شرط وام' },
      { field: 'percent', header: 'درصد سود	' },
      { field: 'count', header: 'تعداد درخواست' },
    ];
  }

  showDialog(id: any) {
    this.loanID = id;
    this.display = true;
  }

  getcounts(id: any): any {
    this.service.countRequest(this.localStorage.userToken, id).subscribe((response: any) => {
      if (response.success === true) {
        return response.count
      }
    })
  }

  getLoans(): any {
    this.service.getAllLoans(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.loans = response.data;
        for (let i = 0; i < this.loans.length; i++) {
          this.service.countRequest(this.localStorage.userToken, this.loans[i]._id).subscribe((response: any) => {
            if (response.success === true) {
              this.loans[i].count = response.count;
            }
          })
        }
        this.spinnerSuccess = false;
      } else {
        this.token.checkTokenExamination(response.data, 'user');
        this.spinnerSuccess = false;
        this.messageService.add({
          severity: 'error',
          summary: ' دریافت اطلاعات ',
          detail: response.data,
        });
      }
    });
  }

  requestLoan() {
    this.service.updateEmployee(this.localStorage.userToken, this.localStorage.userID, this.form.value).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.display = !this.display;
      }
    });
    let data = {
      loanID: this.loanID,
      personalCode: this.localStorage.userPersonalCode,
      employee_id: this.localStorage.userID
    };
    this.service.requestLoan(this.localStorage.userToken, data).subscribe((response: any) => {
      if (response.success === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'پرسنل محترم',
          detail: response['data'],
          life: 50000
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'پرسنل محترم',
          detail: response['data'],
          life: 50000
        });
      }
    });
    this.getLoans();
  }



}
