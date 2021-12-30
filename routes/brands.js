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

router.get('/', function (req, res) {
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
router.post('/', function (req, res) {
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

module.exports = router