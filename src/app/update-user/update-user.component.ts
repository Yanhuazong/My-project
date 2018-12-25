import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { Router } from '@angular/router';
import { user } from '../service/user';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  userID=sessionStorage.getItem('userID');
  thisUser=<user>{};
  constructor(private service: DataService,
              private router:Router) { }

  ngOnInit() {
    this.getThisUser();
  }
  getThisUser(){
    this.service.getThisUser(this.userID).subscribe(data=>this.thisUser=data)
  }
  goback(){
    if(this.thisUser.userType=="admin"){
      this.router.navigate(["admin"]);
    }
    if(this.thisUser.userType=="student"){
      this.router.navigate(["student"]);
    }
    if(this.thisUser.userType=="faculty"){
      this.router.navigate(["committee"]);
    }
    if(this.thisUser.userType=="departmentHead"){
      this.router.navigate(["head"]);
    }
    if(this.thisUser.userType=="superAdmin"){
      this.router.navigate(["super-admin"]);
    }
  }
  updateUser(formData){
    this.service.updateUser(this.thisUser).subscribe(data=>this.thisUser=data);

  }
}
