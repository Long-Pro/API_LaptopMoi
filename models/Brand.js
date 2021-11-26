let mongoose=require('mongoose');
const { Schema } = mongoose;
const BrandSchema = new Schema({
  name:String,
  image:String,
},{collection:'brand',timestamps:true});

const Brand = mongoose.model('Brand', BrandSchema);
module.exports=Brand