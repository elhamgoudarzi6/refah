import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './../../../auth/local-storage.service';
import { AdminService } from './../admin.service';
import { TokenService } from 'src/app/auth/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  requestCount: any;
  LoanCount: any;
  employeeCount: any;
  data: any;
  data2: any;
  chartOptions: any;
  spinnerSuccess: boolean = true;

  constructor(
    private service: AdminService,
    private localStorage: LocalStorageService,
    private token: TokenService) { }

  ngOnInit(): void {
    this.service.showAllRequestEmployee(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.requestCount = response.data.length;
        this.data = {
          labels: ['درخواست', 'تسهیلات'],
          datasets: [
            {
              data: [3, 5, this.requestCount],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }
          ]
        }
        this.spinnerSuccess = false;
      } else {
        this.token.checkTokenExamination(response.data, 'admin');
      }
    });

    this.service.showLoan(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.LoanCount = response.data.length;
        this.data2 = {
          labels: ['درخواست', 'تسهیلات'],
          datasets: [
            {
              data: [3, 5, this.LoanCount],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }
          ]
        }
      } else {
        this.token.checkTokenExamination(response.data, 'admin');
      }
    });


    this.service.showEmployees(this.localStorage.userToken).subscribe((response: { success: boolean; data: any; }) => {
      if (response.success === true) {
        this.employeeCount = response.data.length;
      } else {
        this.token.checkTokenExamination(response.data, 'admin');
      }
    });


  }
}
