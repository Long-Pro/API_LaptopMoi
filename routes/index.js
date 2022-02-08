var express = require('express')
var router = express.Router()
var md5 = require('md5');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')
var Staff=require('../models/Staff')

var {SUCCESS,FAIL,secret}=require('../config')

router.post('/customer/login',  function (req, res) {
  const {account,password}=req.body
  // console.log( {account,password})
  Customer.findOne({account},(err,docs)=>{
    console.log({err,docs})
    if(err) return res.json({
      type:FAIL,
      message:['Đăng nhập thất bại']
    })
    if(docs&&bcrypt.compareSync(password, docs.password)  ){
      const i = jwt.sign({id:docs._id}, secret);
      return res.json({
        type:SUCCESS,
        message:['Đăng nhập thành công'],
        data:docs,
        token:i
      })
    } 
    return res.json({
      type:FAIL,
      message:['Tài khoản hoặc mật khẩu không đúng'],
      data:null
    })
  })
})
router.post('/customers', async function (req, res) {
  const {name,address,birthday,phone,account,password}=req.body
  // console.log( {name,address,birthday,phone,account,password})
  let hashPassword=bcrypt.hashSync(password, saltRounds);
  
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
    const customer=new Customer({name,address,birthday,phone,account,password:hashPassword})
    let x=await customer.save()
    res.json({
      type:SUCCESS,
      message:['Đăng kí tài khoản thành công'],
      data:x
    })
  }
})
router.post('/staff/login',  function (req, res) {
  // console.log(req.headers)
  // console.log(req.headers['authorization'])

  const {account,password}=req.body
  // console.log( {account,password})
  Staff.findOne({account},(err,docs)=>{
    console.log({err,docs})
    if(err) return res.json({
      type:FAIL,
      message:['Đăng nhập thất bại']
    })
    if(docs&&bcrypt.compareSync(password, docs.password)  ){
      const i = jwt.sign({id:docs._id}, secret,{expiresIn:60*60*12});
      return res.json({
        type:SUCCESS,
        message:['Đăng nhập thành công'],
        data:docs,
        token:i
      })
    } 
    return res.json({
      type:FAIL,
      message:['Tài khoản hoặc mật khẩu không đúng'],
      data:null
    })
  })
})

module.exports = router