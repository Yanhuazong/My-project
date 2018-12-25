import { item } from './../service/item';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { thesis } from '../service/thesis';
import { user } from '../service/user';
import { rate } from '../service/rate';
import { evaresult } from '../service/evaresult';
import { evacomment } from '../service/evaComment';
import { attribute } from '../service/attribute';
import { option } from '../service/option';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {

  thisComTheses:thesis[]=[];
  faculties:user[]=[];
  selectedFaculty=<user>{};
  hasNoRating: boolean=false;
  selectedThesis=<thesis>{};
  thisComEvaOptions:evaresult[]=[];
  thisComEvaComments:evacomment[]=[];
  thisComRatesThisThesis=<rate>{};
  isChair: boolean=false;
  items:item[]=[];
  attributes:attribute[]=[];
  options:option[]=[];
  gradeForm: FormGroup;
  grades=[{id:"S", name:"S-Satisfactory"},{id:"U", name:"U-Unsatisfactory"},{id:"SI", name:"SI-Incomplete"},{id:"IU", name:"IU-Unremoved Incomplete - Unsatisfactory"},{id:"WU",name:"WU-Withdrew Unsatisfactory"}];
  selectedGrade:string;
  message: boolean=false;
  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getCommittee().subscribe(data=>this.faculties=data);
    this.getItems();
    this.getAttributes();
    this.message=false;
  }
  
  getSelectedFaculty(faculty){
    this.selectedFaculty=faculty.value;
    this.service.getThesisesCom(this.selectedFaculty.userID).subscribe(data=>this.thisComTheses=data);
  }
  getSelectedThesis(thesis){
    this.selectedThesis=thesis.value;
    this.message=false;
    console.log(this.selectedThesis);
    if(this.selectedThesis){
      if(this.selectedThesis.comChairID===this.selectedFaculty.userID){
          this.isChair=true;
      }
      if(this.selectedThesis.comMember1ID===this.selectedFaculty.userID||this.selectedThesis.comMember2ID===this.selectedFaculty.userID){
        this.isChair=false;
      }
      this.service.getThisComEvaOptions(this.selectedThesis.thesisID,this.selectedFaculty.userID)
      .subscribe(data=>{this.thisComEvaOptions=data;
      });
      this.service.getThisComEvaComments(this.selectedThesis.thesisID,this.selectedFaculty.userID)
      .subscribe(data=>{this.thisComEvaComments=data;
        console.log(this.thisComEvaComments);
      });
      this.service.getThisComEvaRate(this.selectedThesis.thesisID,this.selectedFaculty.userID)
      .subscribe(data=>this.thisComRatesThisThesis=data[0]);
    }
  }
  getItems(){
    this.service.getItems()
      .subscribe(items => this.items = items);
  }
  getAttributes(){
    this.service.getAttributes()
      .subscribe(attributes => {this.attributes = attributes;
        this.service.getOptions()
        .subscribe(options => {this.options = options;
          this.options.forEach(o=>{
            this.attributes.forEach(a=>{
              if(+o.attributeID==a.attributeID){
                  o.attributeID=a.attribute;
              }
            })
          });
        })}
      )
  }
  changeOption(option,result){
    let ix=this.thisComEvaOptions.findIndex(o=>o.resultID==result.resultID);
    this.thisComEvaOptions[ix].optionSelected=option.optionName;
  }
  changeRate(item,rate){
    let ix=this.thisComEvaComments.findIndex(c=>c.commentID==item.commentID);
    this.thisComEvaComments[ix].rate=rate;
  }
  changeComment(item,comment){
    let ix=this.thisComEvaComments.findIndex(c=>c.commentID==item.commentID);
    this.thisComEvaComments[ix].comment=comment;
  }
  changeFinalRate(thisfinalRate){
    this.thisComRatesThisThesis.rate=thisfinalRate;
  }
  changeFinalComment(finalcomment){
    this.selectedThesis.evaComment=finalcomment;
  }
  onClick(){
    this.service.updateMultiEvaOptions(this.thisComEvaOptions).subscribe(data=>this.thisComEvaOptions=data);
    this.service.updateMultiEvaComments(this.thisComEvaComments).subscribe(data=>this.thisComEvaComments=data);
    this.service.updateFinalRate(this.thisComRatesThisThesis).subscribe(data=>this.thisComRatesThisThesis=data);
    this.service.createFinalResult(this.selectedThesis).subscribe(data=>this.selectedThesis=data);
    this.message=true;
  }
}
