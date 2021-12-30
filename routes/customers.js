var express = require('express')
var router = express.Router()
var md5 = require('md5');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')

var {SUCCESS,FAIL}=require('../config')


router.post('/', async function (req, res) {
  const {name,address,birthday,phone,account,password}=req.body
  // console.log( {name,address,birthday,phone,account,password})
  const customer=new Customer({name,address,birthday,phone,account,password:md5(password)})
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
    let x=await customer.save()
    res.json({
      type:SUCCESS,
      message:['Đăng kí tài khoản thành công'],
      data:x
    })
  }
})
router.patch('/:id/password', async function (req, res) {
  let id=req.params.id
  const {password,newPassword}=req.body
  // console.log( {_id,password,newPassword})
  let x=await Customer.findOne({_id:id,password:md5(password)})
  if(!x){
    res.json({
      type:FAIL,
      message:['Mật khẩu không chính xác'],
    })  
    return
  }
  Customer.findOneAndUpdate({_id:id},{password:md5(newPassword)},{new:true},(err,docs)=>{
    if(err){
      res.json({
        type:FAIL,
        message:['Đổi mật khẩu thất bại'],
      })  
      return
    }
    res.json({
      type:SUCCESS,
      message:['Đổi mật khẩu thành công'],
      data:docs
    })
  })
})
router.patch('/:id', async function (req, res) {
  let id=req.params.id
  const {name,address,birthday,phone}=req.body
  // console.log( {name,address,birthday,phone,_id})
  let x=await Customer.find({_id:{$ne:id},phone});
  if(x.length>0){
    res.json({
      type:FAIL,
      message:['Số điện thoại đã tồn tại']
    })
    return
  }

  Customer.findOneAndUpdate({_id:id},{name,address,birthday,phone},{new:true},(err,docs)=>{
    if(err){
      res.json({
        type:FAIL,
        message:['Chỉnh sửa thông tin thất bại'],
      })  
      return
    }
    res.json({
      type:SUCCESS,
      message:['Chỉnh sửa thông tin thành công'],
      data:docs
    })
  })
})


module.exports = router