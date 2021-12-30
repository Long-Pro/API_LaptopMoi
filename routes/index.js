var express = require('express')
var router = express.Router()
var md5 = require('md5');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')

var {SUCCESS,FAIL}=require('../config')

router.post('/customer/login',  function (req, res) {
  const {account,password}=req.body
  // console.log( {account,password})
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

module.exports = router