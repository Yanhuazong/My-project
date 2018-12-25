import { SortPipe } from './../../service/sort.pipe';
import { option } from './../../service/option';
import { attribute } from './../../service/attribute';
import { item } from './../../service/item';
import { DataService } from './../../service/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-rubric',
  templateUrl: './admin-rubric.component.html',
  providers:[DataService],
  styleUrls: ['./admin-rubric.component.css']
})
export class AdminRubricComponent implements OnInit {
 
  items:item[];
  editItem: item;
  attributes:attribute[];
  editattribute: attribute;
  options:option[];
  editoption: option;
  maxItemID;
  maxAttrID;
  maxOptionID;
  constructor(private service:DataService) { }

  ngOnInit() {
    this.getItems();
    this.getMaxItemID();
    this.getAttributes();
    this.getMaxID();
    this.getOptions();
    this.getMaxOptionID();
  }
  getItems(): void {
    this.service.getItems()
      .subscribe(items => this.items = items);
  }
  getMaxItemID(){
    this.service.getMaxItemId().subscribe(data=>this.maxItemID=data);
  }
  createItem(formData):void{
    this.editItem = undefined;
    const newitem:item={itemID: this.maxItemID, itemName: formData.value.itemname} as item;
    this.service.createItem(newitem)
    .subscribe(item=>this.items.push(item));
    this.maxItemID++;
    console.log(newitem);
    formData.resetForm();
  }
  delete(item: item): void {
    this.items = this.items.filter(h => h !== item);
    this.service.deleteItem(item.itemID).subscribe(res=>console.log(res));
  }
  edit(item) {
    this.editItem = item;
  }
  update() {
    if (this.editItem) {
      this.service.updateItem(this.editItem)
        .subscribe(item => {
          // replace the item in the items list with update from server
          const ix = item ? this.items.findIndex(h => h.itemID === item.itemID) : -1;
          if (ix > -1) { this.items[ix] = item; }
        });
      this.editItem = undefined;
    }
  }
  //attributes
  getAttributes(): void {
    this.service.getAttributes()
      .subscribe(attributes => this.attributes = attributes);
  }
  getMaxID(){
    this.service.getMaxId()
    .subscribe(data=>this.maxAttrID=data);
  }
  add(itemID,attributeName):void{
    this.editattribute = undefined;
    attributeName = attributeName.trim();
    const newAttr:attribute={attributeID:this.maxAttrID,itemID: itemID, attribute: attributeName} as attribute;
    this.service.createAttribute(newAttr)
    .subscribe(attribute=>this.attributes.push(attribute));
    this.maxAttrID++;
    console.log(this.maxAttrID);
   }
   deleteAttr(attribute: attribute): void {
    this.attributes = this.attributes.filter(h => h !== attribute);
    this.service.deleteAttribute(attribute.attributeID).subscribe(res=>console.log(res));
    console.log(attribute.attributeID);
  }
  editAttr(attribute) {
    this.editattribute = attribute;
  }
  updateAttr() {
    if (this.editattribute) {
      this.service.updateAttribute(this.editattribute)
        .subscribe(attribute => {
          // replace the item in the items list with update from server
          const ix = attribute ? this.attributes.findIndex(h => h.attributeID === attribute.attributeID) : -1;
          if (ix > -1) { this.attributes[ix] = attribute;}

        });
      this.editattribute = undefined;
    }
  }
  //OPtions
  getOptions(){
    this.service.getOptions()
    .subscribe(options => this.options = options);
  }
  getMaxOptionID(){
    this.service.getMaxOptionId()
    .subscribe(data=>this.maxOptionID=data);
    
  }
  createOption(attributeID,optionName,rank):void{
    this.editOption = undefined;
    optionName = optionName.trim();
    const newOption:option={optionID:this.maxOptionID,attributeID: attributeID, optionName: optionName,rank:rank} as option;
    this.service.createOption(newOption)
    .subscribe(option=>this.options.push(option));
    this.maxOptionID++;
   }
   deleteOption(option: option): void {
    this.options = this.options.filter(h => h !== option);
    this.service.deleteOption(option.optionID).subscribe(res=>console.log(res));
  }
  editOption(option) {
    this.editoption = option;
  }
  updateOption() {
    if (this.editoption) {
      this.service.updateOption(this.editoption)
        .subscribe(option => {
          // replace the item in the items list with update from server
          const ix = option ? this.options.findIndex(h => h.optionID === option.optionID) : -1;
          if (ix > -1) { this.options[ix] = option;}

        });
      this.editoption = undefined;
    }
  }
  updateRank() {
    if (this.editoption) {
      this.service.updateRank(this.editoption)
        .subscribe(option => {
          // replace the item in the items list with update from server
          const ix = option ? this.options.findIndex(h => h.optionID === option.optionID) : -1;
          if (ix > -1) { this.options[ix] = option;}

        });
      this.editoption = undefined;
    }
  }
}
