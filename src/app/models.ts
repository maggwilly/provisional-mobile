export class User {
 constructor(public id:any,public nom:string=null,public phone:string=null){}
 public getId(){
     return this.id;
 }
}