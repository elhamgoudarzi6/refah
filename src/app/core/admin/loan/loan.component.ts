import { Component, OnInit } from '@angular/core';
import { TokenService } from './../../../auth/token.service';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { AdminService } from './../admin.service';
import { AddLoanComponent } from './add-loan/add-loan.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]

})
export class LoanComponent implements OnInit {

  loans: any[] = [];
  cols: any[] | any;
  constructor(
    private messageService: MessageService,
    private service: AdminService,
    private token: TokenService,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getLoans();
    this.cols = [
      { field: 'title', header: 'عنوان تسهیلات' },
      { field: 'amount', header: 'مبلغ وام	' },
      { field: 'number', header: 'تعداد اقساط	' },
      { field: 'ceilingNum', header: 'تعداد تسهیلات' },
      { field: 'condition', header: 'شرط وام' },
      { field: 'percent', header: 'درصد سود	' },
    ];
  }

  getLoans(): any {
    this.service.showLoan(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.loans = response.data;
      } else {
        this.token.checkTokenExamination(response.data, 'admin');
        this.messageService.add({
          severity: 'error',
          summary: ' دریافت اطلاعات ',
          detail: response.data,
        });
      }
    });
  }
  showAddLoanDialog(): void {
    const ref = this.dialogService.open(AddLoanComponent, {
      header: 'ثبت  تسهیلات جدید',
      width: '90%',
    });
    ref.onClose.subscribe((res) => {
      if (res === true) {
        this.messageService.add({
          severity: 'success',
          summary: ' ثبت اطلاعات ',
          detail: 'اطلاعات با موفقیت ثبت شد.',
        });
        this.getLoans();
      }
    });
  }

  deleteLoan(id: any): void {
    this.confirmationService.confirm({
      message: 'آیا از حذف مطمئن هستید؟',
      header: '',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'خیر',
      acceptLabel: 'بله',
      defaultFocus: 'reject',
      accept: () => {
        this.service.deleteLoan(this.localStorage.userToken,id).subscribe((response: { success: boolean; data: any; }) => {
          if (response.success === true) {
            this.confirmationService.close();
            this.messageService.add({
              severity: 'success',
              summary: ' حذف اطلاعات ',
              detail: response.data,
            });
            this.getLoans();
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
