var express = require('express')
var router = express.Router()
var md5 = require('md5');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')
var Staff=require('../models/Staff')

var {SUCCESS,FAIL}=require('../config')

router.post('/', async function (req, res) {//1: nv - 2: admin
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