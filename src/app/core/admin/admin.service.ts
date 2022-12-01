import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  baseUrl = 'https://api.refahkh.ir/api/v1/admin/';

  constructor(private http: HttpClient) { }

  update(token:string,data: any, id: string): any {
   const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'employee/' + id, data,{params});
  }

  register(token:string,data: any): any {
     const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'employee', data,{params});
  }

  showEmployees(token:string): any {
     const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'employee',{params});
  }
  showLoan(token:string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'loan',{params});
  }

  registerLoan(token:string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'loan', data,{params});
  }

  deleteLoan(token:string,id: any): any {
   const params = new HttpParams().set('token', token);
    return this.http.delete(this.baseUrl + 'loan/' + id,{params});
  }
  updateLoan(token:string,data: any, id: string): any {
     const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'loan/' + id, data,{params});
  }
  showAllRequestEmployee(token:string): any {
   const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'allRequestEmployee',{params});
  }
  indexLoan(token:string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'indexLoan',{params});
  }

  countRequestLoan(token:string,id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'countRequest/' + id,{params});
  }

  requestWin(token:string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'requestWin', data,{params});
  }

  setFinalWin(token:string,data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'setFinalWin', data,{params});
  }

  listWin(token:string,id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'listWin/' + id,{params});
  }

  loginAdmin(data: any): any {
    return this.http.post(this.baseUrl + 'login', data);
  }

  getToken(id: string): any {
    let body = {
      SecretKey: 'sadas@!$@#%!^#!GSDGETWTELI@#OI%J@#%!*#)^U#)^U!@)U',
    };
    return this.http.post(this.baseUrl + 'getToken/' + id, body);
  }


  getTokenSms(): any {
    let data = {
      UserApiKey: 'f2a1c337366e0cd3ddffc337',
      SecretKey: 'it66)%#teBC!@*&',
    };
    return this.http.post('https://RestfulSms.com/api/Token', data);
  }

  sendSms(data: any, token: any): any {
    const headers = {
      'content-type': 'application/json',
      'x-sms-ir-secure-token': token,
    };
    return this.http.post('https://RestfulSms.com/api/UltraFastSend', data, { 'headers': headers });
  }

  //#region Admins
  getAllAdmins(token:string): any {
     const params = new HttpParams().set('token', token);
    return this.http.get(this.baseUrl + 'allAdmin',{params});
  }
  getAdmin(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    // const params = new HttpParams({ fromObject: { token: token, id: id } })
    return this.http.get(this.baseUrl + 'getAdmin/' + id, { params });
  }
  addAdmin(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.post(this.baseUrl + 'registerAdmin', data, { params });
  }
  updateAdmin(token: string, id: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'updateAdmin/' + id, data, { params });
  }
  deleteAdmin(token: string, id: string): any {
    const params = new HttpParams().set('token', token);
    return this.http.delete(this.baseUrl + 'deleteAdmin/' + id, { params });
  }
  changePassword(token: string, id: any, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'changePassword/' + id, data, { params });
  }
  changeUsername(token: string, id: any, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + 'changeUsername/' + id, data, { params });
  }
  resetPassword(token: string, data: any): any {
    const params = new HttpParams().set('token', token);
    return this.http.put(this.baseUrl + '/resetPassword', data, { params });
  }
  //#endregion



}
function params(arg0: string, params: any): any {
  throw new Error('Function not implemented.');
}

