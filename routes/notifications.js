const express = require("express");
const router = express.Router();
const NotificationModel = require("../models/Notification");
const { SUCCESS, FAIL, secret } = require("../config");
const jwt = require("jsonwebtoken");

router.get("/", async function (req, res) {
  const token = req.headers["x-access-token"];
  try {
    const id = jwt.verify(token, secret);

    const notifications = await NotificationModel.find({ customerId: id.id })
      .sort({ createdAt: "desc" })
      .populate({
        path: "bill"
      });

    if (notifications.length == 0) {
      await NotificationModel.insertMany([
        {
          unread: true,
          imageUrl: "https://reactjs.org/logo-og.png",
          type: 0,
          customerId: "619f269ee50eb7c579fb9643",
          bill: "61b8598d9cb601a3f21de943",
        },
        {
          unread: true,
          imageUrl: "https://reactjs.org/logo-og.png",
          type: 0,
          customerId: "619f269ee50eb7c579fb9643",
          bill: "61b8598d9cb601a3f21de943",
        },
        {
          unread: true,
          imageUrl: "https://reactjs.org/logo-og.png",
          type: 0,
          customerId: "619f269ee50eb7c579fb9643",
          bill: "61b8598d9cb601a3f21de943",
        },
        {
          unread: true,
          imageUrl: "https://reactjs.org/logo-og.png",
          type: 0,
          customerId: "619f269ee50eb7c579fb9643",
          bill: "61b8598d9cb601a3f21de943",
        },
        {
          unread: true,
          imageUrl: "https://reactjs.org/logo-og.png",
          type: 0,
          customerId: "619f269ee50eb7c579fb9643",
          bill: "61b8598d9cb601a3f21de943",
        },
      ]);
    }
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

module.exports = router;
