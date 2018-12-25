import { DataService } from './../../service/data.service';
import { user } from './../../service/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  providers:[DataService],
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  users:user[];
  maxUserID;

  constructor(private service:DataService) { }

  ngOnInit() {
    this.getUsers();
    this.getMaxUserID();
  }
  getUsers(): void {
    this.service.getUsers()
      .subscribe(users => this.users = users);

  }
  getMaxUserID(){
    this.service.getMaxUserId().subscribe(data=>this.maxUserID=data);
  }
  createUser(formData):void{
    const newuser:user={userID: this.maxUserID,firstName: formData.value.firstname, lastName: formData.value.lastname,gender: formData.value.gender,race: formData.value.race, email:formData.value.email,password:formData.value.password, userType: formData.value.usertype} as user;
    this.service.createUser(newuser)
    .subscribe(user=>this.users.push(user));
    console.log(newuser);
    this.maxUserID++;
    formData.resetForm();
  }
  delete(user: user): void {
    this.users = this.users.filter(h => h !== user);
    this.service.deleteUser(user.userID).subscribe(res=>console.log(res));
    console.log(user.userID);
  }
}
