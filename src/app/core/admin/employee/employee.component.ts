import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TokenService } from './../../../auth/token.service';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { AdminService } from './../admin.service';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import "jspdf-autotable";
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]
})

export class EmployeeComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef | any;
  employees: any[] = [];
  selectedEmployees: any[] = [];
  cols: any[] | any;
  exportCols: any[] | any;
  spinnerSuccess:boolean=true;

  constructor(
    private messageService: MessageService,
    private service: AdminService,
    private token: TokenService,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getEmployees();
    this.cols = [
      { field: 'personalCode', header: 'کد پرسنلی' },
      { field: 'firstName', header: 'نام' },
      { field: 'lastName', header: 'نام خانوادگی' },
      { field: 'nationalCode', header: 'کد ملی' },
      { field: 'mobile', header: 'موبایل' },
    ];
    this.exportCols = this.cols.map((col: { header: any; field: any; }) => ({ title: col.header, dataKey: col.field }));

  }

  getEmployees(): any {
    this.service.showEmployees(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.employees = response.data;
        this.spinnerSuccess=false;
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
  showAddEmployeeDialog(): void {
    const ref = this.dialogService.open(AddEmployeeComponent, {
      header: 'ثبت پرسنل جدید',
      width: '90%',
    });
    ref.onClose.subscribe((res) => {
      if (res === true) {
        this.messageService.add({
          severity: 'success',
          summary: ' ثبت اطلاعات ',
          detail: 'اطلاعات با موفقیت ثبت شد.',
        });
        this.getEmployees();
      }
    });
  }

  exportExcel() {
    let data = this.selectedEmployees.length === 0 ? this.employees : this.selectedEmployees;
    import("xlsx").then(xlsx => {
      const Heading = [['شناسه', '', 'نام', 'نام خانوادگی', 'کد ملی', 'کد پرسنلی', 'شماره همراه']];
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
    let data = this.selectedEmployees.length === 0 ? this.employees : this.selectedEmployees;
    const doc = new jsPDF('p', 'pt');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum)_Light.ttf', 'IRANSansWeb(FaNum)_Light', 'normal');
    doc.addFont('./../../../../assets/fonts/iran-sans/IRANSansWeb(FaNum).ttf', 'IRANSansWeb(FaNum)', 'normal');
    doc.setFont('IRANSansWeb(FaNum)');
    doc.text('گزارش پرسنل آموزش و پرورش ناحیه یک', 300, 30, { align: 'center' });
    (doc as any).autoTable(this.exportCols, data,
      {
        headStyles: { fontSize: 9, font: 'IRANSansWeb(FaNum)', textColor: "#fff", cellWidth: 'wrap', halign: 'center' },
        styles: { fontSize: 8, font: 'IRANSansWeb(FaNum)_Light', textColor: "#666", cellWidth: 'wrap', halign: 'center' },
        margin: { top: 50, bottom: 10 },
        tableWidth: 'wrap',
        overflow: 'visible'
      },
    );
    doc.save("employees.pdf");
  }

}
