let mongoose = require("mongoose");
const { Schema } = mongoose;
const CustomerSchema = new Schema(
  {
    name: String,
    phone: {
      type: String,
      required: [true, "Vui long điền số điện thoại"],
      match: [/^\d{3,15}$/g, "Số điện thoại không hợp lệ"],
    },
    birthday: Date,
    address: String,
    account: {
      type: String,
      minLength: [6, "account >= 6 kí tự"],
      maxLength: [30, "account <= 30 kí tự"],
      match: [/^\w+$/g, "account chỉ chứa a-z, A-Z, 0-9 và _"],
    },
    password: String,
    notificationToken: String,
    avatar:{ type: String, default: 'https://file-store-1682.herokuapp.com/fileDB/1651240751527-user.png' },
  },
  { collection: "customer", timestamps: true }
);

CustomerSchema.statics.checkRepeatPhone = function (value) {
  return this.count({ phone: value });
};
CustomerSchema.statics.checkRepeatAccount = function (value) {
  return this.count({ account: value });
};
const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
