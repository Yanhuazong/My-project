import { evacomment } from './../service/evacomment';
import { Component, OnInit } from '@angular/core';
import { DataService } from './../service/data.service';
import { thesis } from '../service/thesis';
import * as d3 from 'd3';
import { Subject } from 'rxjs';
import { user } from '../service/user';
import { rate } from '../service/rate';
import { evaresult } from '../service/evaresult';

interface gradeVSdate{
  stuID:number,
  defenseDate: string,
  grade:number
}
interface gradeVSrace{
  stuID:number,
  race:string,
  grade:number
}
interface gradeVSgender{
  stuID:number,
  gender:string,
  grade:number
}
interface rateVSgender{
  stuID:number,
  gender:string,
  rate:number
}
interface rateVSdate{
  stuID:number,
  defenseDate: string,
  rate:number
}
interface rateVSisChair{
  stuID:number,
  isChair: boolean,
  rate:number
}
interface rateVSrace{
  stuID:number,
  race: string,
  rate:number
}
@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  theses:thesis[]=[];
  thisComTheses:thesis[]=[];
  students:user[]=[];
  users:user[]=[];
  faculties:user[]=[];
  gradeVSdates:gradeVSdate[]=[];
  gradeVSraces:gradeVSrace[]=[];
  gradeVSgenders:gradeVSgender[]=[];
  rateVSgenders:rateVSgender[]=[];
  rateVSisChairs:rateVSisChair[]=[];
  rateVSraces:rateVSrace[]=[];
  selectedFaculty=<user>{};
  thisComRates:rate[]=[];
  hasNoRating: boolean=false;
  selectedThesis=<thesis>{};
  isChair:boolean=false;
  thisComEvaOptions:evaresult[]=[];
  thisComEvaComments:evacomment[]=[];
  thisComRatesThisThesis:rate[]=[];

  constructor(private service: DataService) {
  }

  ngOnInit() {
    this.getAllScoresAndRaces();
  }
  async getAllScoresAndRaces(){
    const promise1=this.service.getThesises().toPromise();
    const promise2=this.service.getUsers().toPromise();
    let res=await Promise.all([promise1,promise2]);
    this.theses=res[0];
    this.users=res[1];
    this.theses=this.theses.filter(t=>t.grade!=="");
    this.faculties=this.users.filter(u=>u.userType=="faculty")
    this.theses.forEach(thesis=>{
        let grade;
        if(thesis.grade==="S"){
          grade=5;
        }
        else if(thesis.grade==="SI"){
          grade=4;
        }
        else if(thesis.grade==="IU"){
          grade=2;
        }
        else if(thesis.grade==="U"){
          grade=3;
        }
        else if(thesis.grade==="WU"){
          grade=1;
        }
        const gradeVSdate={stuID: +thesis.stuID, defenseDate:thesis.defenseDate,grade:grade};
        this.gradeVSdates.push(gradeVSdate);
    });
  this.gradeVSdates.forEach(gradeVSdate=>{
  const student=this.users.find(u=>+u.userID==gradeVSdate.stuID);
  const gradeVSrace={stuID:gradeVSdate.stuID,race:student.race,grade:gradeVSdate.grade};
  const gradeVSgender={stuID:gradeVSdate.stuID,gender:student.gender,grade:gradeVSdate.grade};
  this.gradeVSraces.push(gradeVSrace);
  this.gradeVSgenders.push(gradeVSgender);
  })
  this.drawGrade(this.gradeVSdates);
  this.drawRace(this.gradeVSraces);
  this.drawGender(this.gradeVSgenders);
  }

  getSelectedFaculty(faculty){

    d3.select('#rateTrend').selectAll('*').remove();
    d3.select('#thisRaceTrend').selectAll('*').remove();
    d3.select('#thisGenderTrend').selectAll('*').remove();
    d3.select('#isChairTrend').selectAll('*').remove();

    this.selectedFaculty=faculty.value;
    this.thisComTheses=this.theses.filter(t=>t.comChairID==this.selectedFaculty.userID||t.comMember1ID==this.selectedFaculty.userID||t.comMember2ID==this.selectedFaculty.userID);
    console.log(this.selectedFaculty);
    this.service.getThisComFinalRates(this.selectedFaculty.userID)
    .subscribe(data=>{
      if(data.length>0){
      this.thisComRates=data;
      this.thisComRates.forEach(rate=>{
        const thesis=this.theses.find(t=>t.thesisID==rate.thesisID);
        const student=this.users.find(u=>u.userID==thesis.stuID);
        console.log(thesis);
        const rateVSrace={stuID:student.userID,race:student.race,rate:rate.rate};
        const rateVSgender={stuID:student.userID,gender:student.gender,rate:rate.rate};
        var isChair:boolean=false;
        if(rate.comID==thesis.comChairID){
          isChair=true;
        }
        const rateVSisChair={stuID:+student.userID,isChair:isChair,rate:rate.rate};
        this.rateVSraces.push(rateVSrace);
        this.rateVSgenders.push(rateVSgender);
        this.rateVSisChairs.push(rateVSisChair);
      })
      this.drawRate(this.thisComRates);
      this.drawRateRace(this.rateVSraces);
      this.drawRateGender(this.rateVSgenders);
      this.drawIsChair(this.rateVSisChairs);
    }else{
      this.hasNoRating=true;
    }
    });
  }
  getSelectedThesis(thesis){
    this.selectedThesis=thesis.value;
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
    });
    this.thisComRatesThisThesis=this.thisComRates.filter(r=>r.thesisID==this.selectedThesis.thesisID);
  }
  drawGrade(theses) {

    theses.sort((a, b)=>{ return d3.ascending(a.defenseDate, b.defenseDate); });

    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var parseDate = d3.timeParse("%Y-%m-%d");

    var svg = d3.select('#gradeTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    var g = svg.append("g")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var tickLabels = ['','WU','IU','U','IS','S',''];

    x.domain(d3.extent(theses, (d)=>{ return parseDate(d['defenseDate']) }));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
          .ticks(6)
          .tickFormat(d3.timeFormat("%Y-%m")))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "0em")
          .attr("dy", "0.55em")
          .attr("transform", "rotate(-30)" );

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5)
          .tickFormat((d,i)=>{return tickLabels[i]}))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Grade");

    g.selectAll("circle")
    .data(theses)
    .enter()
    .append("circle")
    .attr("cx", (d)=>{
        return x(parseDate(d['defenseDate']));
    })
    .attr("cy", (d)=>{
        return y(d['grade']);
    })
    .attr("r", 2);

    var line = d3.line()
    .x((d)=>{return x(parseDate(d['defenseDate']));})
    .y(function(d) { return y(d['grade']); });

    g.append('path')
    .datum(theses)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Thesis grade VS time")
    .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");
   
  }
  drawRace(theses) {
    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 60, right: 60, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('#raceTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    var g = svg.append("g")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    var x = d3.scaleBand().range([0, width]).padding(0.75);
    var y = d3.scaleLinear().range([height, 0]);
    var tickYLabels = ['','WU','IU','U','SI','S',''];

    x.domain(theses.map((d)=>{return d['race']}));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "0em")
    .attr("dy", "0.55em")
    .attr("transform", "rotate(-15)" );

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5)
          .tickFormat((d,i)=>{return tickYLabels[i]}))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Grade");

    g.selectAll("bar")
    .data(theses)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d['race']); })
    .attr("width", 20)
    .attr("y", function(d) { return y(d['grade']); })
    .attr("height", function(d) { return height - y(d['grade']); });
    
    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Thesis grade VS students' race")
    .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");
  }

  drawGender(theses) {
    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 60, right: 60, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('#genderTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    var g = svg.append("g")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    var x = d3.scaleBand().range([0, width]).padding(0.75);
    var y = d3.scaleLinear().range([height, 0]);
    var tickYLabels = ['','WU','IU','U','SI','S',''];

    x.domain(theses.map((d)=>{return d['gender']}));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "0em")
    .attr("dy", "0.55em")
    .attr("transform", "rotate(-15)" );

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5)
          .tickFormat((d,i)=>{return tickYLabels[i]}))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Grade");

    g.selectAll("bar")
    .data(theses)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d['gender']); })
    .attr("width", 20)
    .attr("y", function(d) { return y(d['grade']); })
    .attr("height", function(d) { return height - y(d['grade']); });
    
    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Thesis grade VS students' gender")
    .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");
  }

  drawRate(rating) {

    rating.sort((a, b)=>{ return d3.ascending(a.defenseDate, b.defenseDate); });

    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 50, right: 50, bottom: 50, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var parseDate = d3.timeParse("%Y-%m-%d");
    
    var svg = d3.select('#rateTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    var g = svg.append("g")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    g.empty();
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(rating, (d)=>{ return parseDate(d['defenseDate']) }));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
          .ticks(6)
          .tickFormat(d3.timeFormat("%Y-%m")))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "0em")
          .attr("dy", "0.55em")
          .attr("transform", "rotate(-30)" );

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Rating");

    g.selectAll("circle")
    .data(rating)
    .enter()
    .append("circle")
    .attr("cx", (d)=>{
        return x(parseDate(d['defenseDate']));
    })
    .attr("cy", (d)=>{
        return y(d['rate']);
    })
    .attr("r", 2);

    var line = d3.line()
    .x((d)=>{return x(parseDate(d['defenseDate']));})
    .y(function(d) { return y(d['rate']); });

    g.append('path')
    .datum(rating)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Rating VS time")
    .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");
   
  }
  drawRateRace(theses) {
    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 60, right: 60, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('#thisRaceTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    var g = svg.append("g")
    .attr("id","thisRace")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    var x = d3.scaleBand().range([0, width]).padding(0.75);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(theses.map((d)=>{return d['race']}));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        )
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "0em")
    .attr("dy", "0.55em")
    .attr("transform", "rotate(-15)" );

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Grade");

    g.selectAll("bar")
    .data(theses)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d['race']); })
    .attr("width", 20)
    .attr("y", function(d) { return y(d['rate']); })
    .attr("height", function(d) { return height - y(d['rate']); });
    
    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Rating VS students' race")
    .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");
  }

  drawRateGender(theses) {
    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 60, right: 60, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('#thisGenderTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    var g = svg.append("g")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    var x = d3.scaleBand().range([0, width]).padding(0.75);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(theses.map((d)=>{return d['gender']}));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Grade");

    g.selectAll("bar")
    .data(theses)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d['gender']); })
    .attr("width", 20)
    .attr("y", function(d) { return y(d['rate']); })
    .attr("height", function(d) { return height - y(d['rate']); });
    
    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Rating VS students' gender")
    .attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")");
  }
  
  drawIsChair(theses) {
    var svgWidth = 400, svgHeight = 300;
    var margin = { top: 60, right: 60, bottom: 60, left: 60 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('#isChairTrend')
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    var g = svg.append("g")
       .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
    );
    var x = d3.scaleBand().range([0, width]).padding(0.75);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(theses.map((d)=>{return d['isChair']}));
    y.domain([0,6]);
    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    g.append("g")
    .call(d3.axisLeft(y)
          .ticks(5))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Grade");

    g.selectAll("bar")
    .data(theses)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d['isChair']); })
    .attr("width", 20)
    .attr("y", function(d) { return y(d['rate']); })
    .attr("height", function(d) { return height - y(d['rate']); });
    
    svg.append('svg:text')
    .attr('x',20)
    .attr('x',20)
    .text("Rating VS If this professor was committee chair")
    .attr("transform", "translate(0," + margin.top/2 + ")");
  }
}

