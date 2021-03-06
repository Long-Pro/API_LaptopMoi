var express = require("express");
var router = express.Router();
var md5 = require("md5");

var Customer = require("../models/Customer");
var Brand = require("../models/Brand");
var Cart = require("../models/Cart");
var Product = require("../models/Product");
var Bill = require("../models/Bill");
const NotificationModel = require("../models/Notification");

var { SUCCESS, FAIL } = require("../config");

const pushNotification = require("../ExpoUtil");

router.post("/", async function (req, res) {
  // console.log('-------------------')
  let { customer, data, address, phone } = req.body;
  // console.log({customer,data})
  // type:Number,//0-đã hủy    1-đang chờ xác nhận    2-đag giao    3-đã giao

  Bill.create(
    { customer, products: data, type: 1, staff: null, address, phone },
    async (err, docs) => {
      let x = await Cart.findOne({ customer });
      let products = x.products;
      // console.log('products',products)
      data.forEach((item, index) => {
        let y = products.findIndex(
          (product) => product.product == item.product._id
        );
        products.splice(y, 1);
      });
      // console.log('products',products)

      Cart.findOneAndUpdate({ customer }, { products }, { new: true })
        .populate({
          path: "products",
          populate: {
            path: "product",
          },
        })
        .populate({
          path: "products",
          populate: {
            path: "product",
            populate: {
              path: "brand",
            },
          },
        })
        .exec((err, docs) => {
          if (err)
            return res.json({
              type: FAIL,
              message: ["Đặt hàng thất bại"],
            });
          if (docs)
            docs.products.sort((a, b) =>
              a.product.brand.name.localeCompare(b.product.brand.name)
            );
          res.json({
            type: SUCCESS,
            message: ["Đặt hàng thành công"],
            data: docs,
          });
        });
    }
  );
});

router.delete("/onlyDelete", async (req, res) => {
  let { bill } = req.body;
  Bill.findByIdAndUpdate(bill, { type: 0 }, (err, docs) => {
    if (err)
      return res.json({
        type: FAIL,
        message: ["Hủy đơn hàng thất bại"],
      });
    // console.log(docs)
    //if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
    res.json({
      type: SUCCESS,
      message: ["Hủy đơn hàng đơn hàng thành công"],
    });
  });
});
router.delete("/", async (req, res) => {
  let { customer, bill, type } = req.body;
  console.log(req.body);
  await Bill.findByIdAndUpdate(bill, { type: 0 });
  Bill.find({ customer, type })
    .populate({
      path: "products",
      populate: {
        path: "product",
      },
    })
    .populate({
      path: "products",
      populate: {
        path: "product",
        populate: {
          path: "brand",
        },
      },
    })
    .exec((err, docs) => {
      if (err)
        return res.json({
          type: FAIL,
          message: ["Tải danh sách đơn hàng thất bại"],
        });
      console.log(docs);
      //if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type: SUCCESS,
        message: ["Tải danh sách đơn hàng thành công"],
        data: docs,
      });
    });
});
router.get("/customer/:id", (req, res) => {
  let { id } = req.params;
  Bill.find({ customer: id })
    .populate("staff")
    .exec((err, docs) => {
      if (err)
        return res.json({
          type: FAIL,
          message: ["Tải danh sách đơn hàng thất bại"],
        });
      console.log(docs);
      res.json({
        type: SUCCESS,
        message: ["Tải danh sách đơn hàng thành công"],
        data: docs,
      });
    });
});
router.get("/ids", function (req, res) {
  Bill.find({}, (err, docs) => {
    // console.log(docs)
    if (err)
      return res.json({
        type: FAIL,
        message: ["Lấy dữ liệu thất bại"],
      });
    if (docs) {
      let ids = [];
      docs.forEach((item) => {
        ids.push(item._id);
      });
      return res.json({
        type: SUCCESS,
        message: ["Lấy dữ liệu thành công"],
        data: {
          ids,
        },
      });
    }
  });
});
router.get("/ids/type/:type", function (req, res) {
  let { type } = req.params;
  Bill.find({ type }, (err, docs) => {
    // console.log(docs)
    if (err)
      return res.json({
        type: FAIL,
        message: ["Lấy dữ liệu thất bại"],
      });
    if (docs) {
      let ids = [];
      docs.forEach((item) => {
        ids.push(item._id);
      });
      return res.json({
        type: SUCCESS,
        message: ["Lấy dữ liệu thành công"],
        data: {
          ids,
        },
      });
    }
  });
});
router.get("/id/:id", function (req, res) {
  let { id } = req.params;
  Bill.findOne({ _id: id })
    .populate("staff")
    .populate("customer")
    .populate({
      path: "products",
      populate: {
        path: "product",
      },
    })
    .populate({
      path: "products",
      populate: {
        path: "product",
        populate: {
          path: "brand",
        },
      },
    })
    .exec((err, docs) => {
      if (err)
        return res.json({
          type: FAIL,
          message: ["Lấy dữ liệu thất bại"],
        });
      if (docs) {
        return res.json({
          type: SUCCESS,
          message: ["Lấy dữ liệu thành công"],
          data: docs,
        });
      }
    });
});
router.patch("/id", async function (req, res) {
  let { id, type } = req.body;

  console.log("type:", type);

  const bill = await Bill.findOneAndUpdate({ _id: id }, { type }, { new: true })
    .populate("customer")
    .populate({
      path: "products",
      populate: {
        path: "product",
      },
    });

  if (!bill) {
    res.json({
      type: FAIL,
      message: ["Chỉnh sửa thông tin thất bại"],
    });
    return;
  }

  const notification = new NotificationModel({
    unread: true,
    imageUrl: bill.products[0].product.image || "",
    type: type,
    customerId: bill.customer._id,
    bill: bill._id,
  });
  await notification.save();

  const notificationToken = bill.customer.notificationToken;

  console.log("token: ", notificationToken);
  if (notificationToken && notificationToken != "") {
    //0-đã hủy    1-đang xử lí    2-đang giao    3-đã giao
    switch (type.toString()) {
      case "0" :
        await pushNotification([notificationToken], {
          title: "Đơn hàng bị huỷ.",
          body: "Đơn hàng của bạn đã bị huỷ, Nhấn vào để xem chi tiết.",
          data: { id: notification._id, billId: notification.bill._id },
        });
        break;
      case "2":
        await pushNotification([notificationToken], {
          title: "Đơn hàng đang được giao.",
          body: "Đơn hàng của bạn đang được giao. Nhấn vào để xem chi tiết.",
          data: { id: notification._id, billId: notification.bill._id },
        });
        break;
      case "3":
        await pushNotification([notificationToken], {
          title: "Đơn hàng giao thành công.",
          body: "Đơn hàng của bạn đã được giao thành công. Nhấn vào để xem chi tiết.",
          data: { id: notification._id, billId: notification.bill._id },
        });
        break;
      default:
        break;
    }
  }

  res.json({
    type: SUCCESS,
  });
});
router.get("/:customer/:type", function (req, res) {
  let { type, customer } = req.params;
  // console.log(req.body)
  Bill.find({ customer, type })
    .populate({
      path: "products",
      populate: {
        path: "product",
      },
    })
    .populate({
      path: "products",
      populate: {
        path: "product",
        populate: {
          path: "brand",
        },
      },
    })
    .exec((err, docs) => {
      if (err)
        return res.json({
          type: FAIL,
          message: ["Tải danh sách đơn hàng thất bại"],
        });
      // console.log(docs)
      //if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type: SUCCESS,
        message: ["Tải danh sách đơn hàng thành công"],
        data: docs,
      });
    });
});

module.exports = router;
