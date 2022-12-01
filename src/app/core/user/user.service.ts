import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'https://api.refahkh.ir/api/v1/';

  constructor(private http: HttpClient) { }

  login(data: any): any {
    return this.http.post(this.baseUrl + 'login', data);
  }




  getAllLoans(token: string): any {
     const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'loan',{params});
  }

  showNotification(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'showNotification',{params});
  }
  showDeadline(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'showDeadline',{params});
  }
  countRequest(token: string,id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'countRequest/' + id,{params});
  }
  updateEmployee(token: string,id: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'updateEmployee/' + id, data,{params});
  }

  requestLoan(token: string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'request', data,{params});
  }

  showRequestLoan(token: string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'showRequest', data,{params});
  }
  showLock(token: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'showLock',{params});
  }

  showResult(token: string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'showResult', data,{params});
  }
  showResultAndDate(token: string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'showResultAndDate', data,{params});
  }

  deleteRequest(token: string,id: string): any {
   const params = new HttpParams().set('token', token);
    return this.http.delete(this.baseUrl + 'deleteRequest/' + id,{params});
  }

  getToken(id: string): any {
    let body = {
      SecretKey: 'sadas@!$@#%!^#!GSDGETWTELI@#OI%J@#%!*#)^U#)^U!@)U',
    };
    return this.http.post(this.baseUrl + 'getToken/' + id, body);
  }

}
function params(arg0: string, params: any): any {
  throw new Error('Function not implemented.');
}

