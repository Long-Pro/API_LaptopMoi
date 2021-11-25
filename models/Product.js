const mongoose =require('mongoose');
const { Schema } = mongoose;
const ProductShema = new Schema({
  name:String,
  brand:{ type: Schema.Types.ObjectId, ref: 'Brand' },
  cpu:String,
  ram:String,
  battery:String,
  operatingSystem:String,
  hardDrive:String,
  screen:String,
  card:String,
  image:String,
  price:Number,
  description:String,
},{collection:'product',timestamps:true});
module.exports = mongoose.model('Product', ProductShema);
