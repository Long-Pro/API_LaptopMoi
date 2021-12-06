var express = require('express')
var router = express.Router()
var Product=require('../models/Product')
var Staff=require('../models/Staff')
var {SUCCESS,FAIL}=require('../config') 
var Brand=require('../models/Brand')

router.post('/createBrand', function (req, res) {
  const {name,image}=req.body
  console.log(req.body)
  const brand=new Brand({name,image})
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
router.post('/createProduct', function (req, res) {
  const {name,cpu,brand,ram,hardDrive,operatingSystem,image,description,price,battery,screen,card}=req.body
  console.log(  {name,cpu,brand,ram,hardDrive,operatingSystem,image,description,price,battery,screen,card})
  const product=new Product({name,cpu,brand,ram,hardDrive,operatingSystem,image,description,price,battery,screen,card})
  product.save((err,docs)=>{
    console.log(docs)
    if(err) 
      return res.json({
        type:FAIL,
        message:['Thêm mới sản phẩm thất bại']
      })
    res.json({
      type:SUCCESS,
      message:['Thêm mới sản phẩm thành công']
    })
  })
})

router.post('/createStaff', async function (req, res) {//1: nv - 2: admin
  const {name,address,birthday,phone,account,password,email,type}=req.body
  console.log( {name,address,birthday,phone,account,password,email,type})
  
  let message=[]
  let x=await Staff.checkRepeatPhone(phone);
  if(x) message.push('Số điện thoại đã tồn tại')
  x=await Staff.checkRepeatAccount(account);
  if(x) message.push('Tài khoản đã tồn tại')
  x=await Staff.checkRepeatEmail(email);
  if(x) message.push('Email đã tồn tại')
  if(message.length){
    res.json({
      type:FAIL,
      message
    })
  }else{
    const staff=new Staff({name,address,birthday,email,phone,account,password,isWork:true,type:parseInt(type)})
    await staff.save()
    res.json({
      type:SUCCESS,
      message:['Đăng kí tài khoản thành công']
    })
  }
})

module.exports = router