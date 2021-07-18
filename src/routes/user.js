const express=require('express')
const sharp=require('sharp')

const User=require('../models/user')
const auth =require('../middleware/auth')
const {sendWelcomeEmail,sendDeleteEmail}=require('../emails/account')
const { remove } = require('../models/user')

const router = new express.Router()

router.post('/users', async (request,response)=>{

    const user=new User(request.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        response.status(201).send({user,token})
    }catch(e){
        response.status(500).send(e)
        console.log(e)
    }
})

router.post('/users/login', async (request,response)=>{
    try{
        const user=await User.findByCredentials(request.body.email,request.body.password)
        const token =await user.generateAuthToken()
       
         response.send({user,token})

    }
    catch(e){
        response.status(400).send()
        console.log(e)
    }
})

router.post('/users/logout',auth, async (request,response)=>{
    try{
        request.user.tokens=request.user.tokens.filter((token)=>{
            return token.token!==request.token
        })
        await request.user.save()
        response.send("logout success")
    }catch(e){
        response.status(500).send()
        console.log(e)
    }
})

router.post('/users/logoutall',auth, async (request,response)=>{
   
    try{
        request.user.tokens=[]
        await request.user.save()
        response.send("all sessions closed!")
    }
    catch(e){
        response.status(500).send()
    }
})

router.get('/users/me',auth,async (request,response)=>{

    response.send(request.user)
})


router.patch('/users/me',auth, async (request,response)=>{
    const updates=Object.keys(request.body)
    const allowedUpdates=['name','email','age','password']
    const isValidOperation=updates.every((update)=> allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return response.status(400).send({error: 'Invalid Updates!'})
    }
    
    try{
       updates.forEach((update)=> {
           request.user[update]=request.body[update]
       })
        await request.user.save()
        
        response.send(request.user)
    }catch(e){
        response.status(500).send(e)
        console.log(e)
    }
})


router.delete('/users/me',auth,async (request,response)=>{
    try{
        await request.user.remove()
        sendDeleteEmail(request.user.email,request.user.name)
        response.send(request.user)

    }catch(e){
        console.log(e)
        response.status(500).send()
    }
})

//avatar upload route
const multer = require('multer')
const upload= multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(request,file,callback){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return callback(new Error('please upload an image with only JPG,JPEG or PNG format'))
        }
        callback(undefined,true)
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (request,response)=>{
    const buffer= await sharp(request.file.buffer).resize({width:250,height:250}).png().toBuffer()

    request.user.avatar=buffer
    await request.user.save()
    response.send()
},(error,request,response,next)=>{
    response.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth, async (request,response)=>{
    request.user.avatar=undefined
    await request.user.save()
    response.send()
},(error,request,response,next)=>{
    response.status(400).send({error:error.message})
})

router.get('/users/:id/avatar', async (request,response)=>{
    try{
        const user= await User.findById(request.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        response.set('Content-Type','image/jpg')
        response.send(user.avatar)

    }catch(e){
        console.log(e)
        response.status(404).send()
    }
})
module.exports=router