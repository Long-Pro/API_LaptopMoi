const mongoose =require('mongoose');
const { Schema } = mongoose;
const CommentShema = new Schema({

  product:{ type: Schema.Types.ObjectId, ref: 'Product' },
  customer:{ type: Schema.Types.ObjectId, ref: 'Customer' },
  star:Number,
  content: String,
  images:[String]
},{collection:'comment',timestamps:true});
module.exports = mongoose.model('Comment', CommentShema);
