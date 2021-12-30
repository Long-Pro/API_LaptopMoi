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
  // console.log('-------------------')
  let {customer,data,address,phone}=req.body
  // console.log({customer,data})
  // type:Number,//0-đã hủy    1-đang xử lí    2-đag giao    3-đã giao

  Bill.create({customer,products:data,type:1,staff:null,address,phone},async (err,docs)=>{
    let x=await Cart.findOne({customer})
    let products=x.products
    // console.log('products',products)
    data.forEach((item,index)=>{
      let y=products.findIndex(product=>product.product==item.product._id)
      products.splice(y,1)
    })
    // console.log('products',products)

    Cart.findOneAndUpdate({customer},{products},{new:true})
    .populate({
      path: "products",
      populate: {
          path: "product",
      },
    })
    .populate({
      path: "products",
      populate: {
          path: "product",
          populate: {
            path: "brand",
        },
      },
    })
    .exec((err,docs)=>{
      if(err) return res.json({
        type:FAIL,
        message:['Đặt hàng thất bại']
      })
      if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type:SUCCESS,
        message:['Đặt hàng thành công'],
        data:docs
      })
    })
  })
})

router.delete('/onlyDelete',async (req,res)=>{
  let {bill}=req.body
  Bill.findByIdAndUpdate(bill,{type:0},(err,docs)=>{
    if(err) return res.json({
      type:FAIL,
      message:['Hủy đơn hàng thất bại']
    })
    // console.log(docs)
    //if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
    res.json({
      type:SUCCESS,
      message:['Hủy đơn hàng đơn hàng thành công'],
    })
  })
})
router.delete('/',async (req,res)=>{
  let {customer,bill,type}=req.body
  console.log(req.body)
  await Bill.findByIdAndUpdate(bill,{type:0})
  Bill.find({customer,type})
    .populate({
      path: "products",
      populate: {
          path: "product",
      },
    })
    .populate({
      path: "products",
      populate: {
          path: "product",
          populate: {
            path: "brand",
        },
      },
    })
    .exec((err,docs)=>{
      if(err) return res.json({
        type:FAIL,
        message:['Tải danh sách đơn hàng thất bại']
      })
      console.log(docs)
      //if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type:SUCCESS,
        message:['Tải danh sách đơn hàng thành công'],
        data:docs
      })
    })
})
router.get('/:customer/:type', function (req, res) {
  let {type,customer}=req.params
  // console.log(req.body)
  Bill.find({customer,type})
    .populate({
      path: "products",
      populate: {
          path: "product",
      },
    })
    .populate({
      path: "products",
      populate: {
          path: "product",
          populate: {
            path: "brand",
        },
      },
    })
    .exec((err,docs)=>{
      if(err) return res.json({
        type:FAIL,
        message:['Tải danh sách đơn hàng thất bại']
      })
      // console.log(docs)
      //if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type:SUCCESS,
        message:['Tải danh sách đơn hàng thành công'],
        data:docs
      })
    })
})

module.exports = router