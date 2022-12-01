import { UserService } from './user.service';
import { LocalStorageService } from './../../auth/local-storage.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  items: MenuItem[] | any;
  public date = moment(Date.now()).locale('fa').format('YYYY/M/D');
  public time: any;
  lastName: any;
  firstName: any;
  personalCode: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private localStorage: LocalStorageService,
    private router: Router,
    private service: UserService
  ) { }

  ngOnInit(): void {
    this.createMenu();

    setInterval(() => {
      this.time = moment(Date.now()).locale('fa').format('HH:mm');
    }, 1000);
    
    if (!this.localStorage.getCurrentUser() || this.localStorage.userType != 'user') {
      this.router.navigateByUrl('/');
    } else {
      this.service.getToken(this.localStorage.userID).subscribe((result: any) => {
        if (result.success === false) {
          this.localStorage.removeCurrentUser();
          this.router.navigateByUrl('/');
        }
      });
    }
    this.lastName = this.localStorage.userLastName;
    this.firstName = this.localStorage.userFirstName;
    this.personalCode = this.localStorage.userPersonalCode;
  }

  createMenu() {
    this.items = [
      {
        label: 'صفحه اصلی',
        icon: 'pi pi-home',
        routerLink: '/panel',
      },
      {
        label: 'درخواست و نتیجه',
        icon: 'pi pi-exclamation-circle',
        routerLink: '/request',
      },
    ];

  }

  logOut(): void {
    this.localStorage.removeCurrentUser();
    this.router.navigateByUrl('/');
  }
}
