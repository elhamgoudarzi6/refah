import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from 'src/app/auth/local-storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  password: string | any;
  form: FormGroup | any;
  errorMessages = {
    personalCode: [{ type: 'required', message: 'شماره پرسنلی را وارد کنید.' }],
    password: [{ type: 'required', message: 'کد ملی را وارد کنید.' }],
  };

  constructor(
    private service: UserService,
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (
      this.localStorage.getCurrentUser() &&
      this.localStorage.userType == 'admin'
    ) {
      this.router.navigateByUrl('/admin');
    }

    this.form = new FormGroup({
      personalCode: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null, Validators.compose([Validators.required])),
    });

  }

  login(): void {
    this.service.login(this.form.value).subscribe((result: { success: boolean; data: any; }) => {
      if (result.success == true) {
        this.localStorage.removeCurrentUser();
        this.localStorage.saveCurrentUser(JSON.stringify(result.data));
        this.router.navigateByUrl('/panel');
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'کد پرسنلی یا کد ملی صحیح نمی باشد.',
        });
      }
    });
  }
}
