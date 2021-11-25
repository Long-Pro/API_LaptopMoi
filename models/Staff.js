let mongoose=require('mongoose');
const { Schema } = mongoose;
const StaffSchema = new Schema({
  name:String,
  phone:String,
  birthday:Date,
  address:String,
  email:String,
  account:String,
  password:String,
  type:Number,//1: nv - 2: admin
  isWork:Boolean, 
},{collection:'staff',timestamps:true});

StaffSchema.statics.checkRepeatPhone = function(value) {
  return  this.count({ phone:value});
};
StaffSchema.statics.checkRepeatAccount = function(value) {
  return  this.count({ account:value});
};
StaffSchema.statics.checkRepeatEmail = function(value) {
  return  this.count({ email:value});
};
const Customer = mongoose.model('Customer', CustomerSchema);
module.exports=Customer