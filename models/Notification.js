const mongoose =require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    unread: Boolean,
    imageUrl: String,
    type: Number,
    customerId: String,
    bill: { type: Schema.Types.ObjectId, ref: "Bill" },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Notification", NotificationSchema);
module.exports = Customer;
