var express = require('express')
var router = express.Router()
var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Product=require('../models/Product')
var {SUCCESS,FAIL}=require('../config') 

// -------------------------------------------------------------Customer ---------------------------------------------------------
router.post('/createCustomer', async function (req, res) {
  const {name,address,birthday,phone,account,password}=req.body
  console.log( {name,address,birthday,phone,account,password})
  const customer=new Customer({name,address,birthday,phone,account,password})
  let message=[]
  let x=await Customer.checkRepeatPhone(phone);
  if(x) message.push('Số điện thoại đã tồn tại')
  x=await Customer.checkRepeatAccount(account);
  if(x) message.push('Tài khoản đã tồn tại')
  if(message.length){
    res.json({
      type:FAIL,
      message
    })
  }else{
    await customer.save()
    res.json({
      type:SUCCESS,
      message:['Đăng kí tài khoản thành công']
    })
  }
})
// define the about route
router.get('/getListCustomer', function (req, res) {
  Customer.find({},(err,docs)=>{
    if (err) return handleError(err);
    res.json(docs)
  })
})

// --------------------------------------------------------Brand-----------------------------------------------------
router.get('/getListBrand', function (req, res) {
  Brand.find({},(err,docs)=>{
    if (err) return handleError(err);
    res.json(docs)
  })
})
router.post('/createBrand', function (req, res) {
  const {name}=req.body
  console.log( {name})
  const brand=new Brand({name})
  brand.save((err,docs)=>{
    console.log(docs)
    if(err) 
      return res.json({
        type:FAIL,
        message:['Thêm mới thương hiệu thất bại']
      })
    res.json({
      type:SUCCESS,
      message:['Thêm mới thương hiệu thành công']
    })
  })
})
// --------------------------------------------------------Product-----------------------------------------------------
router.get('/getListProduct', function (req, res) {
  Product.find({},(err,docs)=>{
    if (err) return handleError(err);
    res.json(docs)
  })
})
router.get('/getListProductByBrand', function (req, res) {
  let {brand}=req.query
  Product.find({brand:brand},(err,docs)=>{
    if (err) return handleError(err);
    res.json(docs)
  })
})
router.get('/getProduct', function (req, res) {
  let {id}=req.query
  Product.findById(id,(err,docs)=>{
    if (err) return handleError(err);
    res.json(docs)
  })
})






module.exports = router