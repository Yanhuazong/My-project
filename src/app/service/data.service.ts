import { evacomment } from './evacomment';
import { evaresult } from './evaresult';
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
import { rate } from './rate';

interface loginStatus {
  status: boolean
}

interface logoutStatus {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private handleError: HandleError;
  private isloggedin;
  isWrong:boolean=false;
  loginUser:any;
  loginUserFirstName:any;
  loginUserName=sessionStorage.getItem('user');
  loginUserID=sessionStorage.getItem('userID');
  loginUserType=sessionStorage.getItem('usertype');

  constructor(public http:HttpClient,
              private router:Router,
              httpErrorHandler: HttpErrorHandler) {
                this.handleError = httpErrorHandler.createHandleError('DataService');
               }
//Log in
  setLoggedIn(value: boolean){
    this.isloggedin=value;
    sessionStorage.setItem('loggedIn', 'true');
  }
  get isLoggedIn(){
    this.isloggedin=sessionStorage.getItem('loggedIn');
    if(this.isloggedin==null) {
      this.isloggedin=false;
    }else{
      this.isloggedin=true;
    }
    return this.isloggedin;
  }
  login(email,password){
     return this.http.post("http://localhost/myproject/src/app/api/login.php",{
       email,
       password
     })
     .subscribe(retrievedData=>{
       if(retrievedData==""){
          this.isloggedin=false;
          this.isWrong=true;
       }else{
          this.setLoggedIn(true)
          this.loginUser=retrievedData;
          this.loginUserFirstName=this.loginUser[1];
          sessionStorage.setItem('user', this.loginUserFirstName);
          sessionStorage.setItem('userID', this.loginUser[0]);
          sessionStorage.setItem('usertype', this.loginUser[7]);
          this.loginUserName=sessionStorage.getItem('user');
          if(this.loginUser[7]=="admin"){
            this.router.navigate(["admin"]);
          }
          if(this.loginUser[7]=="student"){
            this.router.navigate(["student"]);
          }
          if(this.loginUser[7]=="faculty"){
            this.router.navigate(["committee"]);
          }
          if(this.loginUser[7]=="departmentHead"){
            this.router.navigate(["head"]);
          }
          if(this.loginUser[7]=="superAdmin"){
            this.router.navigate(["super-admin"]);
          }
      }
     })
    }

  loginStatus(): Observable<loginStatus> {
    return this.http.get<loginStatus>('http://localhost/myproject/src/app/api/isloggedin.php');
  }

  logout() {
    return this.http.get<logoutStatus>('http://localhost/myproject/src/app/api/logout.php').subscribe(data=>{
      if(data.success){
        this.router.navigate(['']);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('usertype');
        sessionStorage.removeItem('loggedIn');
      }
    })
  }
  //Managing users
  getUsers(): Observable<user[]>{
    return this.http.get<user[]>('http://localhost/myproject/src/app/api/getUser.php')
    .pipe(catchError(this.handleError('getUsers', [])));
  }
  //find max user ID
  getMaxUserId(){
    return this.http.get('http://localhost/myproject/src/app/api/findMaxUserId.php')
    .pipe(catchError(this.handleError('getMaxUserId', [])));
  }
  createUser(user:user):Observable<user>{
    return this.http.post<user>("http://localhost/myproject/src/app/api/createUser.php", user)
    .pipe(
      catchError(this.handleError('createUser', user))
    );
  }
  deleteUser (userID){
    
    return this.http.post("http://localhost/myproject/src/app/api/deleteUser.php",userID)
      .pipe(
        catchError(this.handleError('deleteUser', []))
      );
  }
  //Managing items
  getMaxItemId(){
    return this.http.get('http://localhost/myproject/src/app/api/findMaxItemId.php')
    .pipe(catchError(this.handleError('getMaxItemId', [])));
  }
  //
  createItem(item:item):Observable<item>{
    return this.http.post<item>("http://localhost/myproject/src/app/api/createItem.php", item)
    .pipe(
      catchError(this.handleError('createItem', item))
    );
  }
  getItems(): Observable<item[]>{
    return this.http.get<item[]>('http://localhost/myproject/src/app/api/getItem.php')
    .pipe(catchError(this.handleError('getItems', [])));
  }
  deleteItem (itemID){
    
    return this.http.post("http://localhost/myproject/src/app/api/deleteItem.php",itemID)
      .pipe(
        catchError(this.handleError('deleteItem', []))
      );
  }
  updateItem (item: item): Observable<item> {
    return this.http.post<item>("http://localhost/myproject/src/app/api/updateItem.php", item)
      .pipe(
        catchError(this.handleError('updateItem', item))
      );
  }
    //Managing attributes
    createAttribute(attribute:attribute):Observable<attribute>{
      return this.http.post<attribute>("http://localhost/myproject/src/app/api/createAttribute.php", attribute)
      .pipe(
        catchError(this.handleError('createAttribute', attribute))
      );
    }
    getAttributes(): Observable<attribute[]>{
      return this.http.get<attribute[]>('http://localhost/myproject/src/app/api/getAttribute.php')
      .pipe(catchError(this.handleError('getAttribute', [])));
    }
    deleteAttribute (attributeID){
      
      return this.http.post("http://localhost/myproject/src/app/api/deleteAttribute.php",attributeID)
        .pipe(
          catchError(this.handleError('deleteAttribute', []))
        );
    }
    updateAttribute (attribute: attribute): Observable<attribute> {
      return this.http.post<attribute>("http://localhost/myproject/src/app/api/updateAttribute.php", attribute)
        .pipe(
          catchError(this.handleError('updateAttribute', attribute))
        );
    }
    getMaxId(){
      return this.http.get('http://localhost/myproject/src/app/api/findMaxId.php')
      .pipe(catchError(this.handleError('getMaxId', [])));
    }
    //Managing options
    createOption(option:option):Observable<option>{
      return this.http.post<option>("http://localhost/myproject/src/app/api/createOption.php", option)
      .pipe(
        catchError(this.handleError('createOption', option))
      );
    }
    getOptions(): Observable<option[]>{
      return this.http.get<option[]>('http://localhost/myproject/src/app/api/getOption.php')
      .pipe(catchError(this.handleError('getOptions', [])));
    }
    deleteOption (optionID){
      
      return this.http.post("http://localhost/myproject/src/app/api/deleteOption.php",optionID)
        .pipe(
          catchError(this.handleError('deleteOption', []))
        );
    }
    updateOption (option: option): Observable<option> {
      return this.http.post<option>("http://localhost/myproject/src/app/api/updateOption.php", option)
        .pipe(
          catchError(this.handleError('updateOption', option))
        );
    }
    updateRank (option: option): Observable<option> {
      return this.http.post<option>("http://localhost/myproject/src/app/api/updateRank.php", option)
        .pipe(
          catchError(this.handleError('updateRank', option))
        );
    }
    getMaxOptionId(){
      return this.http.get('http://localhost/myproject/src/app/api/findMaxOptionId.php')
      .pipe(catchError(this.handleError('getMaxOptionId', [])));
    }

    //student thesis upload
    createThesis(thesis:thesis):Observable<thesis>{
      return this.http.post<thesis>("http://localhost/myproject/src/app/api/createThesis.php", thesis)
      .pipe(
        catchError(this.handleError('createThesis', thesis))
      );
    }
    getMaxThesisId(){
      return this.http.get('http://localhost/myproject/src/app/api/findMaxThesisId.php')
      .pipe(catchError(this.handleError('getMaxThesisId', [])));
    }
    //Get all thesises
    getThesises():Observable<thesis[]>{
      return this.http.get<thesis[]>("http://localhost/myproject/src/app/api/getThesis.php")
          .pipe(
            catchError(this.handleError('getThesises', []))
          );
    }
    //Get this student's thesises
    getThisThesis(stuID):Observable<thesis[]>{
      return this.http.post<thesis[]>("http://localhost/myproject/src/app/api/getThisThesis.php",stuID)
          .pipe(
            catchError(this.handleError('getThisThesis', stuID))
          );
    }
    //Get Thesises of this committee
    getThesisesCom(comID):Observable<thesis[]>{
      return this.http.post<thesis[]>("http://localhost/myproject/src/app/api/getThesisCom.php",comID)
          .pipe(
            catchError(this.handleError('getThesisesCom', comID))
          );
    }
    //Get a single thesis
    getThesis(thesisID):Observable<thesis>{
      return this.http.post<thesis>("http://localhost/myproject/src/app/api/getThesisSingle.php",thesisID)
          .pipe(
            catchError(this.handleError('getThesis', thesisID))
          );
    }
    //update thesis's title, defense date, and committee
    updateThesis(thesis:thesis):Observable<thesis>{
      return this.http.post<thesis>("http://localhost/myproject/src/app/api/updateThesis.php", thesis)
      .pipe(
        catchError(this.handleError('updateThesis', thesis))
      );

    }
    //Get all faculties
    getCommittee():Observable<user[]>{
      return this.http.get<user[]>("http://localhost/myproject/src/app/api/getCommittee.php")
          .pipe(
            catchError(this.handleError('getCommittee', []))
          );
    }
    //create single row of evaluation records
    createEvaOptions(evaresult:evaresult):Observable<evaresult>{
      return this.http.post<evaresult>("http://localhost/myproject/src/app/api/createSingleEvaResult.php", evaresult)
      .pipe(
        catchError(this.handleError('createEvaOptions', evaresult))
      );
    }
    //update single row of evaluation option records
    updateEvaOptions(evaresult:evaresult):Observable<evaresult>{
      return this.http.post<evaresult>("http://localhost/myproject/src/app/api/updateSingleEvaResult.php", evaresult)
      .pipe(
        catchError(this.handleError('updateEvaOptions', evaresult))
      );
    }
    //create multi-row of evaluation option records
    createEvaOption(evaresults:evaresult[]):Observable<evaresult[]>{
      return this.http.post<evaresult[]>("http://localhost/myproject/src/app/api/createEvaOption.php", evaresults)
      .pipe(
        catchError(this.handleError('createEvaOption', []))
      );
    }
    //load evaluation options
    getEvaOptions(thesisID):Observable<evaresult[]>{
      return this.http.post<evaresult[]>("http://localhost/myproject/src/app/api/getEvaOptions.php",thesisID)
      .pipe(
        catchError(this.handleError('getEvaOPtions', thesisID))
      );
    }
    //Get max evaluation option result ID
    getMaxEvaOptionId(){
      return this.http.get('http://localhost/myproject/src/app/api/findMaxEvaOption.php')
      .pipe(catchError(this.handleError('getMaxEvaOptionId', [])));
    }
    //Load evaluation comments
    getEvaComments(thesisID):Observable<evacomment[]>{
      return this.http.post<evacomment[]>("http://localhost/myproject/src/app/api/getEvaComments.php",thesisID)
      .pipe(
        catchError(this.handleError('getEvaComments', thesisID))
      );
    }
    //Get max evaluation comment result ID
    getMaxEvaCommentId(){
      return this.http.get('http://localhost/myproject/src/app/api/findMaxEvaComment.php')
      .pipe(catchError(this.handleError('getMaxEvaCommentId', [])));
    }
    //create final rating from each committee
    createRate(rate:rate):Observable<rate>{
      return this.http.post<rate>('http://localhost/myproject/src/app/api/insertRate.php',rate)
      .pipe(
        catchError(this.handleError('insertRate', rate))
      );
    }
    //get Final ratings of this thesis
    getFinalRates(thesisID):Observable<rate[]>{
      return this.http.post<rate[]>("http://localhost/myproject/src/app/api/getFinalRate.php",thesisID)
      .pipe(
        catchError(this.handleError('getFinalRates', thesisID))
      );
    }
    //FInd max rating ID
    getMaxRateId(){
      return this.http.get('http://localhost/myproject/src/app/api/findMaxRateID.php')
      .pipe(catchError(this.handleError('getMaxRateId', [])));
    }
    //create eva comments
    createEvaComment(evacomments:evacomment[]):Observable<evacomment[]>{
      return this.http.post<evacomment[]>("http://localhost/myproject/src/app/api/createEvaComment.php", evacomments)
      .pipe(
        catchError(this.handleError('createEvaComment', []))
      );
    }
    //create final eva result/update this thesis
    createFinalResult(thesis:thesis):Observable<thesis>{
      return this.http.post<thesis>("http://localhost/myproject/src/app/api/updateThesisFinal.php", thesis)
      .pipe(
        catchError(this.handleError('createFinalResult', thesis))
      );
    }
    //get one student race
    getRace(stuID){
      return this.http.post("http://localhost/myproject/src/app/api/getRace.php", stuID)
      .pipe(
        catchError(this.handleError('getRace', []))
      );
    }
    //get all students
    getAllRace():Observable<user[]>{
      return this.http.get<user[]>("http://localhost/myproject/src/app/api/getAllRace.php")
      .pipe(
        catchError(this.handleError('getAllRace', []))
      );
    }
    //get ALl Final ratings from this professor
    getThisComFinalRates(comID):Observable<rate[]>{
      return this.http.post<rate[]>("http://localhost/myproject/src/app/api/getThisComFinalRates.php",comID)
      .pipe(
        catchError(this.handleError('getThisComFinalRates', comID))
      );
    }
    //get evaluation option results of a thesis from a committee
    getThisComEvaOptions(thesisID,comID):Observable<evaresult[]>{
      var data={thesisID:thesisID,comID:comID};
      return this.http.post<evaresult[]>("http://localhost/myproject/src/app/api/getThisComEvaOptions.php",data)
      .pipe(
        catchError(this.handleError('getThisComEvaOptions', []))
      );
    }
    //get evaluation comment results of a thesis from a committee
    getThisComEvaComments(thesisID,comID):Observable<evacomment[]>{
      var data={thesisID:thesisID,comID:comID};
      return this.http.post<evacomment[]>("http://localhost/myproject/src/app/api/getThisComEvaComments.php",data)
      .pipe(
        catchError(this.handleError('getThisComEvaComments', []))
      );
    }
    //get evaluation rinal rating results of a thesis from a committee
    getThisComEvaRate(thesisID,comID):Observable<rate[]>{
      var data={thesisID:thesisID,comID:comID};
      return this.http.post<rate[]>("http://localhost/myproject/src/app/api/getThisComEvaRate.php",data)
      .pipe(
        catchError(this.handleError('getThisComEvaRate', []))
      );
    }
    //update multi row of evaoptions
    updateMultiEvaOptions(evaresults:evaresult[]):Observable<evaresult[]>{
      return this.http.post<evaresult[]>("http://localhost/myproject/src/app/api/updateEvaOptions.php", evaresults)
      .pipe(
        catchError(this.handleError('updateMultiEvaOptions', []))
      );
    }
    //update the comments and rates for each category from a committee member
    updateMultiEvaComments(evacomments:evacomment[]):Observable<evacomment[]>{
      return this.http.post<evacomment[]>("http://localhost/myproject/src/app/api/updateEvaComments.php", evacomments)
      .pipe(
        catchError(this.handleError('updateMultiEvaComments', []))
      );
    }
    //update the final rate of a thesis from a committee member
    updateFinalRate(rate:rate):Observable<rate>{
      return this.http.post<rate>('http://localhost/myproject/src/app/api/updateRate.php',rate)
      .pipe(
        catchError(this.handleError('insertRate', rate))
      );
    }
    //get the current login user
    getThisUser(userID):Observable<user>{
      return this.http.post<user>('http://localhost/myproject/src/app/api/getThisUser.php',userID)
      .pipe(
        catchError(this.handleError('getThisUser', userID))
      );
    }
    //update the current login user
    updateUser(user:user):Observable<user>{
      return this.http.post<user>('http://localhost/myproject/src/app/api/updateThisUser.php',user)
      .pipe(
        catchError(this.handleError('getThisUser', user))
      );
    }
}
