import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenService } from './../../../auth/token.service';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { AdminService } from './../admin.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]
})
export class RequestComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;
  cols: any[] | any;
  exportCols: any[] | any;
  exportHeaders: any;
  requests: any[] = [];
  selectedRequests: any[] = [];
  spinnerSuccess: boolean = true;

  constructor(
    private messageService: MessageService,
    private service: AdminService,
    private token: TokenService,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getRequestEmployees();
    this.cols = [
      { field: 'personalCode', header: 'کد پرسنلی ' },
      { field: 'firstName', header: 'نام' },
      { field: 'lastName', header: 'نام خانوادگی' },
      { field: 'nationalCode', header: 'شماره ملی' },
      { field: 'titleLoan', header: 'عنوان تسهیلات' }
    ];
    this.exportCols = this.cols.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));
  }

  getRequestEmployees(): any {
    this.service.showAllRequestEmployee(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.requests = [];
        for (let item of response.data) {
          this.requests.push(item.employees)
        }
        this.spinnerSuccess = false;
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

  exportExcel() {
    let data = this.selectedRequests.length === 0 ? this.requests : this.selectedRequests;
    import("xlsx").then(xlsx => {
      const Heading = [['نام', 'نام خانوادگی', 'تلفن', 'کد ملی', 'تسهیلات', 'کد پرسنلی', 'شماره همراه']];
      const worksheet = xlsx.utils.book_new();
      xlsx.utils.sheet_add_json(worksheet, data, { origin: 'A2', skipHeader: true });
      xlsx.utils.sheet_add_aoa(worksheet, Heading, { origin: 'A1' });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "employee");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  exportPdf() {
    let data = this.selectedRequests.length === 0 ? this.requests : this.selectedRequests;
    const doc = new jsPDF('p', 'pt');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum)_Light.ttf', 'IRANSansWeb(FaNum)_Light', 'normal');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum).ttf', 'IRANSansWeb(FaNum)', 'normal');
    doc.setFont('IRANSansWeb(FaNum)');
    doc.text('گزارش درخواست تسهیلات', 300, 30, { align: 'center' });
    (doc as any).autoTable(this.exportCols, data,
      {
        headStyles: { fontSize: 9, font: 'IRANSansWeb(FaNum)', textColor: "#fff", cellWidth: 'wrap', halign: 'center' },
        styles: { fontSize: 8, font: 'IRANSansWeb(FaNum)_Light', textColor: "#666", cellWidth: 'wrap', halign: 'center' },
        margin: { top: 50, bottom: 10 },
        tableWidth: 'wrap',
        overflow: 'visible'
      },
    );
    doc.save("request.pdf");
  }
}