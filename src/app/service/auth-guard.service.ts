import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate  {


  constructor(private service:DataService,
              private router: Router,) { }

  //with role
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

  const permission = route.data["permission"];
  
  let canActivate: boolean;
  if(this.service.isLoggedIn||sessionStorage.getItem('loggedIn')=="true") {
    const userType: string = sessionStorage.getItem('usertype');
    if (!permission) throw new Error('Permissions is not setup!');
    if (!permission.only.length) throw new Error('Roles are not setup!');

    canActivate = permission.only.includes(userType);

    if (!canActivate) {
      this.router.navigate([permission.redirectTo]);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userID');
      sessionStorage.removeItem('usertype');
      sessionStorage.removeItem('loggedIn');
    }
    return canActivate;
    }
    else{
      this.router.navigate(['login']);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userID');
      sessionStorage.removeItem('usertype');
      sessionStorage.removeItem('loggedIn');
      return false;
    }       
  }
}
