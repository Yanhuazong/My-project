import { DataService } from './data.service';
import { thesis } from './thesis';
import { option } from './option';
import { attribute } from './attribute';
import { item } from './item';
import { Router } from '@angular/router';
import { user } from './user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { evaresult } from './evaresult';

@Injectable()

export class CommitteeService {

    isThesisExist:boolean=false;
    isThesisReviewed:boolean=false;
    isThesisToReview:boolean=false;
    comThesises:thesis[];
    comThesisesToReview:thesis[]=[];
    comThesisesReviewed:thesis[]=[];
    thisComEvaOption:evaresult[]=[];

    constructor(private service: DataService){}
    
        getThesisCom(comID){
            this.service.getThesisesCom(comID).subscribe(thesises=>{
            this.comThesises=thesises;
            if(this.comThesises.length>0){
                this.isThesisExist=true;
            }else{
                this.isThesisExist=false;
            }
           
            this.comThesises.forEach(thesis => {
                if(thesis.comChairID === comID){
                    if(!thesis.grade){
                        this.comThesisesToReview.push(thesis);
                        this.isThesisToReview=true;
                    }else{
                        this.comThesisesReviewed.push(thesis);
                        this.isThesisReviewed=true;
                    }
                }else{
                    this.service.getEvaOptions(thesis.thesisID).subscribe(result => {
                    this.thisComEvaOption = result.filter(e => e.comID == comID);
                    if(this.thisComEvaOption.length > 0){
                        this.comThesisesReviewed.push(thesis);
                        this.isThesisReviewed=true;
                    }else{
                        this.comThesisesToReview.push(thesis);
                        this.isThesisToReview=true;
                    }
                })
                }
               
            })
            if(this.comThesisesToReview.length>0){
                this.isThesisToReview=true;
            }else{
                this.isThesisToReview=false;
            }
            if(this.comThesisesReviewed.length>0){
                this.isThesisReviewed=true;
            }else{
                this.isThesisReviewed=false;
            }
            // console.log(this.comThesisesReviewed,this.comThesisesToReview);
            // console.log(this.isThesisReviewed,this.isThesisToReview);
            })
      }

}