import { AdminService } from './admin.service';
import { LocalStorageService } from './../../auth/local-storage.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  items: MenuItem[] | any;
  fullName: any;
  public date = moment(Date.now()).locale('fa').format('YYYY/M/D');
  public time: any;
  lastName: any;
  firstName: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private localStorage: LocalStorageService,
    private router: Router,
    private service: AdminService
  ) { }

  ngOnInit(): void {
    this.createMenu();

    setInterval(() => {
      this.time = moment(Date.now()).locale('fa').format('HH:mm');
    }, 1000);

    if (!this.localStorage.getCurrentUser() || this.localStorage.userType != 'admin') {
      this.router.navigateByUrl('/admin');
    } else {
      this.service.getToken(this.localStorage.userID).subscribe((result: { success: boolean; }) => {
        if (result.success === false) {
          this.localStorage.removeCurrentUser();
          this.router.navigateByUrl('/admin');
        }
      });
    }
    this.lastName = this.localStorage.userLastName;
    this.firstName = this.localStorage.userFirstName;
  }

  createMenu() {
    this.items = [
      {
        label: 'صفحه اصلی',
        icon: 'pi pi-home',
        routerLink: '/admin/panel',
      },
      {
        label: 'مدیریت پرسنل',
        icon: 'pi pi-users',
        routerLink: '/admin/employee',
      },
      {
        label: 'مدیریت تسهیلات',
        icon: 'pi pi-dollar',
        routerLink: '/admin/loan',
      },
      {
        label: 'مدیریت درخواست ها',
        icon: 'pi pi-inbox',
        routerLink: '/admin/request',
      },
      {
        label: 'مدیریت قرعه کشی',
        icon: 'pi pi-star',
        routerLink: '/admin/lottery',
      },
      {
        label: 'تنظیمات',
        icon: 'pi pi-cog',
        routerLink: '/admin/config',
      },

    ];

  }
  logOut(): void {
    this.localStorage.removeCurrentUser();
    this.router.navigateByUrl('/admin');
  }
}
