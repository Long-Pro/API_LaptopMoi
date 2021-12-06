const mongoose =require('mongoose');
const { Schema } = mongoose;
const BillShema = new Schema({
  customer:{ type: Schema.Types.ObjectId, ref: 'Customer' },
  type:Number,//0-đã hủy    1-đang xử lí    2-đag giao    3-đã giao
  products:[{
    product:{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity:Number
  }],
  staff:{ type: Schema.Types.ObjectId, ref: 'Staff' },
},{collection:'bill',timestamps:true});
module.exports = mongoose.model('Bill', BillShema);
