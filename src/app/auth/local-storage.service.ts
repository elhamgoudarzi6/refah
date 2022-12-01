import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public userData: any;
  public userJson: any;
  public userType: any;
  public userToken: any;
  public userID: any;
  public userFirstName: any;
  public userLastName: any;
  public userPersonalCode: any;
  public userNationalCode: any;

  constructor(private storageService: StorageService) { }

  saveCurrentUser(value: any) {
    this.storageService.secureStorage.setItem('current', value);
  }

  getCurrentUser(): boolean {
    this.userData = this.storageService.secureStorage.getItem('current');
    this.userJson = JSON.parse(this.userData);
    if (this.userData !== undefined && this.userData !== null) {
      this.userJson = JSON.parse(this.userData);
      this.userType = this.userJson['type'];
      this.userToken = this.userJson['token'];
      this.userID = this.userJson['_id'];
      this.userFirstName = this.userJson['firstName'];
      this.userLastName = this.userJson['lastName'];
      this.userPersonalCode = this.userJson['personalCode'];
      this.userNationalCode = this.userJson['nationalCode'];
      return true;
    } else {
      return false;
    }
  }

  removeCurrentUser() {
    return this.storageService.secureStorage.clear();
  }

}

