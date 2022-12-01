import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenService } from './../../../auth/token.service';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { AdminService } from './../admin.service';
import { MessageService } from 'primeng/api';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss'],
  providers: [MessageService]

})
export class LotteryComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;
  randomWin: any[] = []
  filteredLoans: any;
  loanID: any;
  number: number | any;
  loans: any;
  display: boolean = false;
  listWin: any[] = [];
  title: any;
  cols: any[] | any;

  constructor(
    private messageService: MessageService,
    private service: AdminService,
    private token: TokenService,
    private localStorage: LocalStorageService) { }

  ngOnInit(): void {
    this.getLoans();
    this.cols = [
      { field: 'firstName', header: 'نام' },
      { field: 'lastName', header: 'نام خانوادگی' },
      { field: 'personalCode', header: 'کد پرسنلی' },
      { field: 'nationalCode', header: 'کد ملی' },
      { field: 'mobile', header: 'شماره همراه' },
      { field: 'title', header: 'عنوان تسهیلات' },
      { field: 'amount', header: 'مبلغ تسهیلات' },
      { field: 'number', header: 'تعداد اقساط' },
    ];
  }

  onSelectLoan(event: any) {
    this.loanID = event._id;
  }

  onSelectListWin(event: any) {
    this.service.listWin(this.localStorage.userToken, event._id).subscribe((response: any) => {
      if (response.success === true) {
        this.listWin = response.data;
        this.title = event.title + ' ' + event.amount;
      }
    });
  }

  filterLoan(event: any) {
    this.filteredLoans = this.loans.filter((item: any) => item.title.includes(event.query));
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

  onRandomWin() {
    let data = {
      loanID: this.loanID,
      number: this.number
    }
    if (data.loanID === undefined || data.number === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'کاربر محترم', detail: 'لطفاعنوان تسهیلات و تعداد را وارد نمایید' });
    } else {
      this.randomWin = [];
      this.service.requestWin(this.localStorage.userToken, data).subscribe((response: any) => {
        if (response.success === true) {
          this.randomWin = response.data;
          this.display = true;
        }
      });
    }
  }

  onSetFinalWin() {
    this.display = false;
    this.service.setFinalWin(this.localStorage.userToken, this.randomWin).subscribe((response: any) => {
      this.messageService.add({ severity: 'success', summary: 'کاربر محترم', detail: response.data });
    })
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'listWin.xlsx');
  }

}
