import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../user.service';
import { TokenService } from 'src/app/auth/token.service';
import { LocalStorageService } from 'src/app/auth/local-storage.service';
@Component({
  selector: 'app-request-result',
  templateUrl: './request-result.component.html',
  styleUrls: ['./request-result.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class RequestResultComponent implements OnInit {
  request: any=[];
  cols: any[] | any;
  Lock: boolean | any;
  spinnerSuccess: boolean = true;
  resultLottery: boolean = false;
  resultData: any;
  introduction: boolean | any;
  personalCode: any;
  requestID: any;
  deadline: any;
  lastName: any;
  firstName: any;
  constructor(
    private messageService: MessageService,
    private service: UserService,
    private token: TokenService,
    private localStorage: LocalStorageService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnInit(): void {
    this.getRequests();
    this.getResults();
    this.personalCode = this.localStorage.userPersonalCode;
    this.firstName = this.localStorage.userFirstName;
    this.lastName = this.localStorage.userLastName;

    this.service.showLock(this.localStorage.userToken).subscribe((response: any) => {
      if (response.success === true) {
        this.Lock = response.data;
        this.introduction = response.introduction;
      }
    })
    this.service.showDeadline(this.localStorage.userToken).subscribe((response: any) => {
      if (response['success'] === true) {
        this.deadline = response.data;
      }
    })
    this.cols = [
      { field: 'title', header: 'عنوان تسهیلات' },
      { field: 'amount', header: 'مبلغ وام	' },
      { field: 'number', header: 'تعداد اقساط	' },
      { field: 'ceilingNum', header: 'تعداد تسهیلات' },
      { field: 'condition', header: 'شرط وام' },
      { field: 'percent', header: 'درصد سود	' },
    ];
  }


  getRequests(): any {
    let data = { personalCode: this.localStorage.userPersonalCode };
    this.service.showRequestLoan(this.localStorage.userToken, data).subscribe((response: any) => {
      if (response.success === true) {
        this.request = response.data;
        this.requestID = response.requestID;
        this.spinnerSuccess = false;
      } else {
        console.log(this.request)
        this.token.checkTokenExamination(response.data, 'user');
        this.spinnerSuccess = false;
      }
    });
  }

  getResults(): any {
    let data = { personalCode: this.localStorage.userPersonalCode };
    this.service.showResult(this.localStorage.userToken, data).subscribe((response: any) => {
      if (response.success === true) {
        this.resultData = response.data;
        this.resultLottery = this.resultData.result;
      } else {
        this.resultLottery = false;
      }
    });
  }

  deleteRequest(): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف درخواست مطمئن هستید؟',
      header: '',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        this.service.deleteRequest(this.localStorage.userToken, this.requestID).subscribe((response: { success: boolean; data: any; }) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({
              severity: 'success',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
            this.request = [];
            this.getRequests();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
          }
        });
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

}
