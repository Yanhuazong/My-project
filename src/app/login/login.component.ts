import { Router } from '@angular/router';
import { DataService } from './../service/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 
  constructor(public service:DataService, public router:Router) { }

  ngOnInit() {
  }
  login(formData){
    this.service.login(formData.value.email,formData.value.password);
  }
    
}
