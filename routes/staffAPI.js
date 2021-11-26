var express = require('express')
var router = express.Router()
var Product=require('../models/Product')
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


module.exports = router