var express = require('express')
var router = express.Router()
var md5 = require('md5');

var Customer=require('../models/Customer')
var Brand=require('../models/Brand')
var Product=require('../models/Product')
var Comment=require('../models/Comment')

var {SUCCESS,FAIL}=require('../config')

router.delete('/:id',async  function (req, res) {
  let {id}=req.params
  console.log(id)
  Comment.findById(id,(err,docs)=>{
    console.log(docs)
    let  now = new Date();
    console.log(now.getTime()-docs.createdAt.getTime())
    console.log(3*24*60*60*1000)
    if((now.getTime()-docs.createdAt.getTime())>=3*24*60*60*1000){
      return res.json({
        type:FAIL,
        message:['Đã quá hạn xóa comment']
      })
    }
    Comment.findByIdAndDelete({_id:id},(err,docs)=>{
      if(err) 
        return res.json({
          type:FAIL,
          message:['Xóa comment thất bại']
        })
      res.json({
        type:SUCCESS,
        message:['Xóa comment thành công']
      })
    })
  })
})
router.patch('/:id', function (req, res) {
  let {id}=req.params
  let {customer,content,images,star}=req.body
  if(!images) images=[]
  if(!content) content=''
  Comment.findById(id,(err,docs)=>{
    console.log(docs)
    let  now = new Date();
    console.log(now.getTime()-docs.createdAt.getTime())
    console.log(3*24*60*60*1000)
    if((now.getTime()-docs.createdAt.getTime())>=3*24*60*60*1000){
      return res.json({
        type:FAIL,
        message:['Đã quá hạn sửa comment']
      })
    }
    Comment.findOneAndUpdate({_id:id},{content,content,images,star},{new:true},(err,docs)=>{
      console.log(docs)
      if(err) 
        return res.json({
          type:FAIL,
          message:['Chỉnh sửa comment thất bại']
        })
      res.json({
        type:SUCCESS,
        message:['Chỉnh sửa comment thành công'],
        data:docs
      })
    })
  })



  return
  Brand.findOneAndUpdate({_id:id},{name,image},(err,docs)=>{
    if(err) 
      return res.json({
        type:FAIL,
        message:['Chỉnh sửa thương hiệu thất bại']
      })
    res.json({
      type:SUCCESS,
      message:['Chỉnh sửa thương hiệu thành công']
    })
  })
})
module.exports = router