var express = require('express')
var router = express.Router()
var md5 = require('md5');
var jwt = require('jsonwebtoken');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')

var {SUCCESS,FAIL,secret}=require('../config')



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

router.get('/identifications',  function (req, res) {
  Customer.find({},(err,docs)=>{
    // console.log(docs)
    if(err) return res.json({
      type:FAIL,
      message:['Lấy dữ liệu thất bại']
    })
    if(docs) {
      let phones=[],ids=[],accounts=[]
      docs.forEach(item=>{
        phones.push(item.phone)
        ids.push(item._id)
        accounts.push(item.account)
      })
      return res.json({
        type:SUCCESS,
        message:['Lấy dữ liệu thành công'],
        data:{
          phones,
          ids,
          accounts
        }
      })
    }
  })
})
router.get('/information',  function (req, res) {
  let {id,phone,account}=req.query
  let obj={_id:id}
  if(account) obj={account}
  if(phone) obj={phone}
  console.log(obj)
  Customer.findOne(obj,(err,docs)=>{
    // console.log(docs)
    if(err) return res.json({
      type:FAIL,
      message:['Lấy dữ liệu thất bại']
    })
    console.log(docs)
    if(docs) {
      return res.json({
        type:SUCCESS,
        message:['Lấy dữ liệu thành công'],
        data:docs
        
      })
    }
  })
})

module.exports = router