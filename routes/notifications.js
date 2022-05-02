const express = require("express");
const router = express.Router();
const NotificationModel = require("../models/Notification");
const CustomerModel = require("../models/Customer");
const { SUCCESS, FAIL, secret } = require("../config");
const jwt = require("jsonwebtoken");
const pushNotification = require("../ExpoUtil");

router.get("/", async function (req, res) {
  const token = req.headers["x-access-token"];
  try {
    const id = jwt.verify(token, secret);

    const notifications = await NotificationModel.find({ customerId: id.id })
      .sort({ createdAt: "desc" })
      .populate({
        path: "bill",
      });

    res.json({
      type: SUCCESS,
      message: [],
      data: notifications,
    });
  } catch (error) {
    console.log(error);

    return res.status(401).send("Invalid Token");
  }
});

router.patch("/mark-as-read/:id", async function (req, res) {
  let id = req.params.id;
  const notification = await NotificationModel.findByIdAndUpdate(
    id,
    { unread: false },
    { new: true }
  );

  if (!notification) {
    res.json({
      type: FAIL,
      message: ["Notification not found"],
      data: {},
    });

    return;
  }

  res.json({
    type: SUCCESS,
  });
});

router.get("/push", async function (req, res) {
  // const token = req.headers["x-access-token"];
  const { title, body, customerId } = req.body;
  try {
    // const id = jwt.verify(token, secret);

    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      res.json({
        type: FAIL,
        message: ["Customer not found"],
        data: {},
      });

      return;
    }

    const notificationToken = customer.notificationToken;
    if (notificationToken && notificationToken != "") {
      await pushNotification([notificationToken], {
        title: title,
        body: body,
        data: {},
      });
    }else {
      res.json({
        type: FAIL,
        message: ["Customer has no token."],
        data: {},
      });
    }

    res.json({
      type: SUCCESS,
      message: ["Push notification Success"],
      data: {},
    });
  } catch (error) {
    console.log(error);

    return res.status(401).send("Invalid Token");
  }
});

module.exports = router;
