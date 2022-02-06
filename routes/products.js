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
router.delete('/:id',async function (req, res) {
  let {id}=req.params
  try {
    let x=await Bill.find({})
    x.forEach(itemX=>{
      let t=itemX.products.find(item=>item.product==id)
      if(t) return res.json({
        type:FAIL,
        message:['Sản phẩm đã tồn tại trong hóa đơn hoặc giỏ hàng, không thể xóa']
      })
    })
    x=await Cart.find({})
    x.forEach(itemX=>{
      let t=itemX.products.find(item=>item.product==id)
      if(t) return res.json({
        type:FAIL,
        message:['Sản phẩm đã tồn tại trong hóa đơn hoặc giỏ hàng, không thể xóa']
      })
    })
    
    Product.findByIdAndDelete({_id:id},(err,docs)=>{
      if(err) 
        return res.json({
          type:FAIL,
          message:['Xóa sản phẩm thất bại']
        })
      res.json({
        type:SUCCESS,
        message:['Xóa sản phẩm thành công']
      })
    })
  } catch (error) {
    
  }
})
router.patch('/:id', function (req, res) {

  let {id}=req.params
  // let {name,image}=req.body
  Product.findOneAndUpdate({_id:id},req.body,(err,docs)=>{
    if(err) 
      return res.json({
        type:FAIL,
        message:['Chỉnh sửa sản phẩm thất bại']
      })
    res.json({
      type:SUCCESS,
      message:['Chỉnh sửa sản phẩm thành công']
    })
  })

})

module.exports = router