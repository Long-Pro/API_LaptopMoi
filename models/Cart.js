const mongoose =require('mongoose');
const { Schema } = mongoose;
const CartShema = new Schema({
  customer:{ type: Schema.Types.ObjectId, ref: 'Customer' },
  products:[{
    product:{
    type: Schema.Types.ObjectId,
    ref: 'Product'
    },
    quantity:Number
  }]
},{collection:'cart',timestamps:true});
module.exports = mongoose.model('Cart', CartShema);
