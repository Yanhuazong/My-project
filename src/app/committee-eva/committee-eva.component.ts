import { evaresult } from './../service/evaresult';
import { option } from './../service/option';
import { attribute } from './../service/attribute';
import { item } from './../service/item';
import { CommitteeService } from './../service/committee.service';
import { thesis } from './../service/thesis';
import { DataService } from './../service/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SortPipe } from '../service/sort.pipe';
import { evacomment } from '../service/evaComment';
import { rate } from '../service/rate';

interface avgRate{
  itemName:string,
  avgRate:number
};
@Component({
  selector: 'app-committee-eva',
  templateUrl: './committee-eva.component.html',
  styleUrls: ['./committee-eva.component.css'],
  providers: [CommitteeService]

})
export class CommitteeEvaComponent implements OnInit {

  comID=sessionStorage.getItem('userID');
  thesis$: Observable<thesis>;
  thesis:thesis;
  items:item[];
  thisItems;
  attributes:attribute[];
  options:option[];
  evaresults:evaresult[]=[];//initial;
  loadedEvaResults:evaresult[];
  loadedThisComEvaResults:evaresult[];
  loadedOtherComEvaResults:evaresult[];
  loadedEvaComments:evacomment[];
  loadedThisComEvaComments:evacomment[];
  loadedOtherComEvaComments:evacomment[];
  isReviewFinished:boolean=false;
  selectedOption;
  resultID;
  comments:evacomment[]=[];
  commentID;
  isOtherComReviewFinished: boolean;
  isSubmit:boolean=false;
  finalComment;
  finalRate:number=3;
  grade: any;
  rate:number=3;
  thisRate: rate;
  loadedFinalRate:rate[]=[];
  loadedThisComFinalRate=<rate>{};
  loadedOtherComFinalRate:rate[]=[];
  rateID: any;
  avgRates:avgRate[]=[];
  avgFinalRate:number;
  isReadyForFinalReview:boolean=false;
  noRefresh: boolean=false;

  constructor(private service: DataService,
              private committeeService:CommitteeService,
              private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getThesis(params.get('id')))
    ).subscribe(res=>{this.thesis=res;
      this.getEvaOptions();
      this.getEvaComments();
      this.getFinalRates();
    });
    this.getMaxEvaOptionId();
    this.getMaxEvaCommentId();
    this.getMaxRateId();
    this.committeeService.getThesisCom(this.comID);
    this.getItems();
    this.getAttributes();
    this.getOptions();
   }
  getItems(){
    this.service.getItems()
      .subscribe(items => this.items = items);
  }
  getAttributes(){
    this.service.getAttributes()
      .subscribe(attributes => {this.attributes = attributes;
      });
  }
  getOptions(){
    this.service.getOptions()
    .subscribe(options => this.options = options);
  }
  gotoLists() {
    this.router.navigate(['/committee']);
  }

  getEvaOptions(){
    this.service.getEvaOptions(this.thesis.thesisID)
    .subscribe(data=>{this.loadedEvaResults=data;
      this.loadedThisComEvaResults=data.filter(e => e.comID == +this.comID);
      this.loadedOtherComEvaResults=data.filter(e => e.comID != +this.comID);
      if(this.loadedThisComEvaResults.length>0){
        this.isReviewFinished=true;
      }
      if(this.loadedOtherComEvaResults.length>0){
        this.isOtherComReviewFinished=true;
      }

    });
  }
  getEvaComments(){
    this.service.getEvaComments(this.thesis.thesisID)
    .subscribe(data=>{this.loadedEvaComments=data;
      this.loadedThisComEvaComments=data.filter(e => e.comID == +this.comID);
      this.loadedOtherComEvaComments=data.filter(e => e.comID != +this.comID);
      console.log(this.loadedOtherComEvaComments); 
      let items=[];
      if(this.loadedEvaComments){
        this.loadedEvaComments.forEach(x=>{
          items.push(x.itemName);
        })
      }
      const distinct=(v, i, s)=>{
        return s.indexOf(v)===i;
      }
      this.thisItems=items.filter(distinct);
      let results:evacomment[]=[];
        this.thisItems.forEach(item=>{
          results=this.loadedOtherComEvaComments.filter(x=>x.itemName==item);
          let r;
          if(results.length>0){
            if(results[0]&&results[1]){
              r=Math.round((+results[0].rate + +results[1].rate)/2);
              this.noRefresh=true;
            }
            else if(!results[0]){
              r=results[1].rate;
            }
            else if(!results[1]){
              r=results[0].rate;
            }
          }          
          let avgRate={itemName:item,avgRate:r} as avgRate;
          this.avgRates.push(avgRate);
         })
    });
  }
  getFinalRates(){
    this.service.getFinalRates(this.thesis.thesisID)
    .subscribe(data=>{this.loadedFinalRate=data;
      this.loadedThisComFinalRate=data.find(e => e.comID == +this.comID);
      this.loadedOtherComFinalRate=data.filter(e => e.comID != +this.comID);
      if(this.loadedOtherComFinalRate.length>0){
        if(this.loadedOtherComFinalRate[0]&&this.loadedOtherComFinalRate[1]){
          this.avgFinalRate=Math.round((+this.loadedOtherComFinalRate[0].rate +  +this.loadedOtherComFinalRate[1].rate)/2);
        }
        else if(!this.loadedOtherComFinalRate[0]){
          this.avgFinalRate=this.loadedOtherComFinalRate[1].rate;
        }
        else if(!this.loadedOtherComFinalRate[1]){
          this.avgFinalRate=this.loadedOtherComFinalRate[0].rate;
        }
      }
      if(this.loadedFinalRate.length==3){
        this.isReadyForFinalReview=true;
      }
    });
  }
  onSelectionChange(option, attribute, item) {
    this.selectedOption = option;
    const newEva:evaresult={resultID: this.resultID, itemName: item.itemName,attributeName: attribute.attribute,thesisID: this.thesis.thesisID, comID: +this.comID,optionSelected:option.optionName} as evaresult;
    const ix = newEva ? this.evaresults.findIndex(h => h.attributeName === newEva.attributeName&&h.thesisID === newEva.thesisID&&h.comID === newEva.comID) : -1;
    if (ix > -1) { 
      this.evaresults[ix].optionSelected = newEva.optionSelected;
    }else{
    this.evaresults.push(newEva);
    this.resultID++;
    }
  }
  getRate(item,rate){
    this.rate=rate;
    const newComment:evacomment={commentID: this.commentID, itemName: item.itemName,thesisID: this.thesis.thesisID, comID: +this.comID,rate: this.rate,comment:''} as evacomment;
    const ix = newComment ? this.comments.findIndex(h => h.itemName === newComment.itemName&&h.thesisID === newComment.thesisID&&h.comID === newComment.comID) : -1;
    console.log(ix);
    if (ix > -1) { 
      this.comments[ix].rate = newComment.rate;
    }else{
    this.comments.push(newComment);
    this.commentID++;
    }
  }
  getComments(comments,item){
    comments=comments.value.trim();
    const newComment:evacomment={commentID: this.commentID, itemName: item.itemName,thesisID: this.thesis.thesisID, comID: +this.comID,rate: this.rate,comment:comments} as evacomment;
    const ix = newComment ? this.comments.findIndex(h => h.itemName === newComment.itemName&&h.thesisID === newComment.thesisID&&h.comID === newComment.comID) : -1;
    console.log(ix);
    if (ix > -1) { 
      this.comments[ix].comment = newComment.comment;
    }else{
    this.comments.push(newComment);
    this.commentID++;
    }
  }
  getMaxEvaOptionId(){
    this.service.getMaxEvaOptionId().subscribe(data=>this.resultID=data);
  }
  getMaxEvaCommentId(){
    this.service.getMaxEvaCommentId().subscribe(data=>this.commentID=data);
  }
  getMaxRateId(){
    this.service.getMaxRateId().subscribe(data=>this.rateID=data);
  }
  getFinalRate(rate){
    this.finalRate=rate;
  }
  onClick(){
    console.log(this.evaresults);
    this.thisRate={rateID:this.rateID,thesisID:this.thesis.thesisID,comID:+this.comID, rate:this.finalRate, defenseDate:this.thesis.defenseDate};
    this.service.createEvaOption(this.evaresults).subscribe(data=>{this.loadedThisComEvaResults=data;});
    this.service.createEvaComment(this.comments).subscribe(data=>this.loadedThisComEvaComments=data);
    this.service.createRate(this.thisRate).subscribe(data=>this.loadedThisComFinalRate=data);
    this.items.forEach(x=>this.thisItems.push(x.itemName));
    this.isReviewFinished=true;
    this.loadedThisComFinalRate=this.thisRate;
  }
  getFinalResult(final){
    this.finalComment=final.value.trim();
  }
  getGrade(grade){
    this.grade=grade.value;
  }
  onSubmit(){
    const updateThesis:thesis={thesisID: this.thesis.thesisID, stuID: this.thesis.stuID, thesisTitle: this.thesis.thesisTitle, comChairID: this.thesis.comChairID, comChairFirstName: this.thesis.comChairFirstName,comChairLastName:this.thesis.comChairLastName, comMember1ID: this.thesis.comMember1ID,comMember1FirstName: this.thesis.comMember1FirstName,comMember1LastName: this.thesis.comMember1LastName,comMember2ID: this.thesis.comMember2ID,comMember2FirstName: this.thesis.comMember2FirstName,comMember2LastName: this.thesis.comMember2LastName, defenseDate: this.thesis.defenseDate, grade:this.grade, evaComment: this.finalComment} as thesis;
    this.service.createFinalResult(updateThesis).subscribe(data=>{this.thesis=data;console.log(data);});
    this.isSubmit=true;
  }
}
