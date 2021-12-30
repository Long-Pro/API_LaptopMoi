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
router.post('/', function (req, res) {
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
router.get('/brand/:brand', function (req, res) {
  let brand=req.params.brand
  Product.find({brand}).populate('brand').exec((err,docs)=>{
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
router.get('/:id', function (req, res) {
  let id=req.params.id
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

module.exports = router