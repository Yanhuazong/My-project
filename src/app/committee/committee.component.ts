import { CommitteeService } from './../service/committee.service';
import { thesis } from './../service/thesis';
import { DataService } from './../service/data.service';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css'],
  providers: [CommitteeService]
 })
export class CommitteeComponent implements OnInit {
  
  comID=sessionStorage.getItem('userID');

  constructor(public committeeService:CommitteeService) { }

  ngOnInit() {
    this.committeeService.getThesisCom(this.comID);
  }

}
