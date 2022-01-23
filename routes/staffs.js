var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')
var Staff=require('../models/Staff')

var {SUCCESS,FAIL,saltRounds}=require('../config')

router.post('/', async function (req, res) {//1: nv - 2: admin
  const {name,address,birthday,phone,account,password,email,type,gender}=req.body
  console.log( {name,address,birthday,phone,account,password,email,type,gender})
  
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
    let hashPassword=bcrypt.hashSync(password, saltRounds);
    const staff=new Staff({name,address,birthday,email,phone,gender,account,password:hashPassword,isWork:true,type:parseInt(type)})
    await staff.save()
    res.json({
      type:SUCCESS,
      message:['Thêm nhân viên thành công']
    })
  }
})
router.patch('/:id', async function (req, res) {
  let {id}=req.params
  const {name,address,birthday,phone,email,type,gender,isWork}=req.body
  try {
    let staff=await Staff.findOne({_id:id})
    console.log('staff',staff)
    let message=[]
    let x=await Staff.checkRepeatPhone(phone);
    console.log('x',x)
    if(x&&phone!=staff.phone) message.push('Số điện thoại đã tồn tại')
    if(x&&email!=staff.email) message.push('Email đã tồn tại')
    if(message.length){
      res.json({
        type:FAIL,
        message
      })
    }else{
      Staff.findOneAndUpdate({_id:id},{name,address,birthday,phone,email,type,gender,isWork},{new:true},(err,docs)=>{
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
    }
  } catch (error) {
    res.json({
      type:FAIL,
      message:['Lỗi !!!!!!']
    })
  }


})

router.get('/identifications',  function (req, res) {
  Staff.find({},(err,docs)=>{
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
  Staff.findOne(obj,(err,docs)=>{
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
router.patch('/:account/password', async function (req, res) {
  let account=req.params.account
  const {password,newPassword}=req.body
  Staff.findOne({account},(err,docs)=>{
    console.log({err,docs})
    if(err) return res.json({
      type:FAIL,
      message:['Tài khoản không tồn tại']
    })
    if(docs&&bcrypt.compareSync(password, docs.password)){
      let hashPassword=bcrypt.hashSync(newPassword, saltRounds);
      Staff.findOneAndUpdate({account},{password:hashPassword},(err,docs)=>{
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
          data:{
            password:hashPassword
          }
        })
      })
    } 
    else res.json({
      type:FAIL,
      message:['Mật khẩu không chính xác'],
      data:null
    })
  })
})

module.exports = router