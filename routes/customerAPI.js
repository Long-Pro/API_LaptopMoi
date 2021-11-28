var express = require('express')
var router = express.Router()
var md5 = require('md5');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
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
router.post('/login',  function (req, res) {
  const {account,password}=req.body
  console.log( {account,password})
  Customer.findOne({account,password:md5(password)},(err,docs)=>{
    if(err) return res.json({
      type:FAIL,
      message:['Đăng nhập thất bại']
    })
    if(docs) return res.json({
      type:SUCCESS,
      message:['Đăng nhập thành công'],
      data:docs
    })
    return res.json({
      type:FAIL,
      message:['Tài khoản hoặc mật khẩu không đúng'],
      data:docs
    })
  })

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
    if(err) return res.json({
      type:FAIL,
      message:['Tải danh mục thất bại']
    })
    res.json({
      type:SUCCESS,
      message:['Tải danh mục thành công'],
      data:docs
    })
  })
})

// --------------------------------------------------------Product-----------------------------------------------------
router.get('/getListProduct', function (req, res) {
  Product.find({}).populate('brand').exec((err,docs)=>{
    if(err) return res.json({
      type:FAIL,
      message:['Tải danh sách sản phẩm thất bại']
    })
    res.json({
      type:SUCCESS,
      message:['Tải danh sách sản phẩm thành công'],
      data:docs
    })
  })
})
router.get('/getListProductByBrand', function (req, res) {
  let {brand}=req.query
  Product.find({brand:brand},(err,docs)=>{
    if(err) return res.json({
      type:FAIL,
      message:['Tải danh sách sản phẩm thất bại']
    })
    res.json({
      type:SUCCESS,
      message:['Tải danh sách sản phẩm thành công'],
      data:docs
    })
  })
})
router.get('/getProduct', function (req, res) {
  let {id}=req.query
  Product.findById(id,(err,docs)=>{
    if(err) return res.json({
      type:FAIL,
      message:['Tải thông tin sản phẩm thất bại']
    })
    res.json({
      type:SUCCESS,
      message:['Tải thông tin sản phẩm thành công'],
      data:docs
    })
  })
})

// --------------------------------------------------------Cart-----------------------------------------------------
router.post('/getCart', function (req, res) {
  let {customer}=req.body
  console.log(req.body)
  Cart.findOne({customer})
    .populate({
      path: "products",
      populate: {
          path: "product",
      },
    })
    .exec((err,docs)=>{
      if(err) return res.json({
        type:FAIL,
        message:['Tải giỏ hàng thất bại']
      })
      res.json({
        type:SUCCESS,
        message:['Tải giỏ hàng thành công'],
        data:docs
      })
    })
})
router.post('/updateCart', async function (req, res) {
  let {customer,product,quantity,type}=req.body
  quantity=parseInt(quantity)
  //type :C-create D-delete
  console.log(req.body)
  let x=await Cart.findOne({customer})
  if(x){// tìm thấy customer 
    let {products}=x
    let index=products.findIndex(item=>item.product==product)
    let objCart={}
    if(index!=-1){// tìm thấy product
      objCart=products[index]
      if(type=='C'){
        objCart.quantity+=quantity
      }
      if(type=='D'){
        if(objCart.quantity<=quantity)  objCart.quantity=0
        else objCart.quantity-=quantity
      }
      products[index]=objCart
    }else{
      objCart.product=product
      if(type=='C'){
        objCart.quantity=quantity
      }
      products.push(objCart)
    }
    console.log(products)
    Cart.findOneAndUpdate({customer},{products},{new:true},(err,docs)=>{
      if(err) return res.json({
        type:FAIL,
        message:['Cập nhật giỏ hàng thất bại']
      })
      res.json({
        type:SUCCESS,
        message:['Cập nhật giỏ hàng thành công'],
        data:docs
      })
    })
  }else{// k tìm thấy customer
    Cart.create({customer,products:[{product,quantity}]},(err,docs)=>{
      console.log(err,docs)
      if(err) return res.json({
        type:FAIL,
        message:['Cập nhật giỏ hàng thất bại']
      })
      res.json({
        type:SUCCESS,
        message:['Cập nhật giỏ hàng thành công'],
        data:docs
      })
    })

  }









})






module.exports = router