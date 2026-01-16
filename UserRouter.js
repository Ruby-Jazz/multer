import cloudinary from "./util.js";
import expressAsyncHandler from "express-async-handler";
import express from 'express'
import { upload } from "./Multer/Multer.js";
import User from "./Models/UserModel.js";
import multer from "multer";
import fs from 'fs'
import { uploadStorage } from "./Multer/memoryMulter.js";
import { url } from "inspector";
const userRouter = express.Router();
console.log("Current Cloudinary Config:", cloudinary.config().api_key);
userRouter.post('/', upload.single('image'),
expressAsyncHandler(
    async(req,res)=>{
        const result = await cloudinary.uploader.upload(req.file.path);
        const user = new User({
            name : req.body.name,
            avatar : result.secure_url,
            cloudinary_id : result.public_id,
        })
        await user.save();
        res.json(user)
    }
))
userRouter.get('/', expressAsyncHandler(async(req,res)=>{
    const user = await User.find({});
    if(user.length === 0) {
        return res.status(404).json({message: 'users not Found'})
    }
    return res.status(200).json(user)
}))
userRouter.post('/memory', uploadStorage.single('image'), expressAsyncHandler(async(req,res)=>{

    if(!req.file){ return res.status(404).json('no files uploaded')}
    const base64 = req.file.buffer.toString('base64');
    const dataURL = `data:${req.file.mimetype};base64,${base64}`;
    const result = await cloudinary.uploader.upload(dataURL);
      const user = new User({
            name : req.body.name,
            avatar : result.secure_url,
            cloudinary_id : result.public_id,
        })
        await user.save();
    res.send(user)
}))
userRouter.delete('/:id', expressAsyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({message: 'user not found'})
    }
    await cloudinary.uploader.destroy(user.cloudinary_id);
    await user.deleteOne();
    return res.status(200).json({message : 'user deleted successfully' , user})
}))
userRouter.put('/:id', upload.single('image'), expressAsyncHandler(
    async(req,res)=>{
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }
        let avatar = user.avatar;
        let cloudinary_id = user.cloudinary_id;
        if(req.file){
              const result = await cloudinary.uploader.upload(req.file.path);
            if(cloudinary_id){
                await cloudinary.uploader.destroy(cloudinary_id)
            }
          fs.unlinkSync(req.file.path)

            avatar = result.secure_url;
            cloudinary_id = result.public_id;
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name : req.body.name || user.name,
            avatar,
            cloudinary_id
        },{new : true})
       return res.status(200).json(updatedUser)
    }
))
export default userRouter;