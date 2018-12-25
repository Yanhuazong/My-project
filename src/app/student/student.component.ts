import { user } from './../service/user';
import { thesis } from './../service/thesis';
import { DataService } from './../service/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  isThesisUploaded;
  thisThesis:thesis[];
  userType=sessionStorage.getItem('usertype');
  stuID=sessionStorage.getItem('userID');
  thesises:thesis[];
  faculties:user[];
  facultiesForMem1:user[];
  facultiesForMem2:user[];
  comChair:user;
  comMember1:user;
  editThesis:boolean=false;
  editThisThesis:thesis;
  thisComChair:user;
  thisComMember1:user;
  thisComMember2:user;
  maxThesisId;
  constructor(private service:DataService) { }

  ngOnInit() {
  //  this.getThesises();
    this.getThesisStu(this.stuID);
    this.getFaculties();
    this.getMaxID();
  }
  createThesis(formData):void{
    this.editThisThesis = undefined;
    const newThesis:thesis={thesisID: this.maxThesisId, stuID: +this.stuID, thesisTitle: formData.value.thesisTitle, comChairID: formData.value.comChair.userID, comChairFirstName: formData.value.comChair.firstName,comChairLastName: formData.value.comChair.lastName, comMember1ID: formData.value.comMember1.userID,comMember1FirstName: formData.value.comMember1.firstName,comMember1LastName: formData.value.comMember1.lastName,comMember2ID: formData.value.comMember2.userID,comMember2FirstName: formData.value.comMember2.firstName,comMember2LastName: formData.value.comMember2.lastName, defenseDate:formData.value.defenseDate, grade:'',evaComment:''} as thesis;
    this.service.createThesis(newThesis)
    .subscribe(thesis=>this.thisThesis.push(thesis));
    this.isThesisUploaded=true;
    console.log(this.thisThesis);
    formData.resetForm();
   
  }
  getMaxID(){
    this.service.getMaxThesisId()
    .subscribe(data=>this.maxThesisId=data);
  }

  getThesisStu(stuID){
 //   this.service.getThesises().subscribe(thesises=>{this.thisThesis=thesises.find(thesis=>thesis.stuID===stuID);
 //   this.thisThesis=this.thesises.find(thesis=>thesis.stuID===this.stuID);
    this.service.getThisThesis(stuID)
    .subscribe(thesis=>{this.thisThesis=thesis;console.log("test",this.thisThesis);if(this.thisThesis.length>0){
      this.isThesisUploaded=true;
    }else{
      this.isThesisUploaded=false;
    }});
      
  }
  getFaculties(){
    this.service.getCommittee()
    .subscribe(faculties => this.faculties = faculties);
  }
  getComChair(comChair){
    this.comChair=comChair;
    this.facultiesForMem1 = this.faculties.filter(h => h !== comChair);
  }
  getComMember1(comMember1){
    this.comMember1=comMember1;
    this.facultiesForMem2=this.facultiesForMem1.filter(h => h !== comMember1);
  }
  getComChairId(comChairID){
    this.comChair.userID=comChairID;
    this.facultiesForMem1 = this.faculties.filter(h => h.userID !== comChairID);
  }
  getComMember1Id(comMember1ID){
    this.comMember1.userID=comMember1ID;
    this.facultiesForMem2=this.facultiesForMem1.filter(h => h.userID !== comMember1ID);
  }
  onClick(thesis){
    this.editThisThesis=thesis;
    this.editThesis=true;
  }
  update(){
    if (this.editThisThesis) {
      this.service.updateThesis(this.editThisThesis)
        .subscribe(thesis => {
          // replace the item in the items list with update from server
          const ix = thesis ? this.thisThesis.findIndex(h => h.thesisID === thesis.thesisID) : -1;
          if (ix > -1) { this.thisThesis[ix] = thesis; }
        });
      this.editThisThesis = undefined;
      this.editThesis=false;
    }
  }
}
