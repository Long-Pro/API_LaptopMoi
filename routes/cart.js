var express = require('express')
var router = express.Router()
var md5 = require('md5');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Cart=require('../models/Cart')
var Product=require('../models/Product')
var Bill=require('../models/Bill')

var {SUCCESS,FAIL}=require('../config')

router.get('/:customer', function (req, res) {
  let customer=req.params.customer
  Cart.findOne({customer})
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
        message:['Tải giỏ hàng thất bại']
      })
      // console.log(docs)
      if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type:SUCCESS,
        message:['Tải giỏ hàng thành công'],
        data:docs??{products:[]}
      })
    })
})
router.patch('/:customer', async function (req, res) {
  let customer=req.params.customer
  let {product,quantity,type}=req.body
  quantity=parseInt(quantity)
  //type :C-create D-delete
  console.log(req.body)
  let x=await Cart.findOne({customer})
  if(x){// tìm thấy customer 
    let {products}=x
    let index=products.findIndex(item=>item.product==product)
    let objCart={}
    if(index!=-1){// tìm thấy product
      objCart=products[index]
      if(type=='C'){
        objCart.quantity+=quantity
        products[index]=objCart
      }
      if(type=='D'){
        if(objCart.quantity<=quantity)  objCart.quantity=0
        else objCart.quantity-=quantity
        if(objCart.quantity==0) products.splice(index,1)
      }
      
    }else{
      objCart.product=product
      if(type=='C'){
        objCart.quantity=quantity
      }
      products.push(objCart)
    }
    // console.log(products)
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
        message:['Cập nhật giỏ hàng thất bại']
      })
      if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
      res.json({
        type:SUCCESS,
        message:['Cập nhật giỏ hàng thành công'],
        data:docs
      })
    })
  }else{// k tìm thấy customer
    Cart.create({customer,products:[{product,quantity}]},(err,docs)=>{
      console.log(docs)
      Cart.findOne({customer})
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
            message:['Cập nhật giỏ hàng thất bại']
          })
          //console.log(docs)
          if(docs) docs.products.sort((a,b)=>a.product.brand.name.localeCompare(b.product.brand.name))
          res.json({
            type:SUCCESS,
            message:['Cập nhật giỏ hàng thành công'],
            data:docs
          })
        })
    })
  }
})

module.exports = router