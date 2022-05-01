var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");

const { dbURL } = require("./config");

var indexRouter = require("./routes/index");
var customersRouter = require("./routes/customers");
var brandsRouter = require("./routes/brands");
var productsRouter = require("./routes/products");
var cartRouter = require("./routes/cart");
var billsRouter = require("./routes/bills");
var staffsRouter = require("./routes/staffs");
var commentsRouter = require("./routes/comments");
const notificationsRouter = require("./routes/notifications");

var verifyToken = require("./middleware/verifyToken");

var app = express();

//Set up mongoose connection
var mongoose = require("mongoose");
var mongoDB = dbURL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", indexRouter);
app.use("/customers", verifyToken, customersRouter);
app.use("/brands", verifyToken, brandsRouter);
app.use("/products", verifyToken, productsRouter);
app.use("/cart", verifyToken, cartRouter);
app.use("/bills", verifyToken, billsRouter);
app.use("/staffs", verifyToken, staffsRouter);
app.use("/comments", verifyToken, commentsRouter);
app.use("/notification", verifyToken, notificationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
