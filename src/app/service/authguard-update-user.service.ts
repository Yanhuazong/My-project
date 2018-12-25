import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardUpdateUserService implements CanActivate {

  constructor(private service:DataService,
    private router: Router,) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      if(this.service.isLoggedIn||sessionStorage.getItem('loggedIn')=="true") {
          return true;
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
