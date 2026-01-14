import express from 'express'
import cors from 'cors'
import multer from 'multer';
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path';
import { maxHeaderSize } from 'http';
import errorrouter from './MulterErrorRouter.js';
import memoryRouter from './memoryMulter.js';
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use('/api/memory', memoryRouter)
app.use('/api',errorrouter)
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        const dir = 'uploads'
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
    }, filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = function(req,file,cb){
    if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
        cb(null,true)
    }
    else{
        req.uploadError = 'file type is not valid';
        cb(null,false)}
}
const upload = multer({storage,fileFilter})
app.post('/', upload.single('image'), (req,res)=> {
    console.log(req.file)
  if(req.uploadError){
        return res.status(422).json({message : req.uploadError})
    }
   return res.json({message: 'file uploaded'})
})
const uploadMany = multer({storage,fileFilter:  function(req,file,cb){
    if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
        cb(null,true)
    }
    else{
      !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname);
      cb(null,false)
}

}})
app.post('/multiple-files', uploadMany.array('images'), (req,res)=>{
     console.log(req.files)
  if(req.invalidFiles){
        return res.status(200).json({message :'Some Files Could not be uploaded due to wrong file type: ' + req.invalidFiles.join(','), warning : true})
    }
   return res.json({message: 'files uploaded', warning : false})
})
const uploadProfile = multer({
    storage : multer.diskStorage({
      destination :  function (req,file,cb) {
              const dir = 'profile'
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
        },
        filename: function(req,file,cb){
        cb(null, Date.now() + '_' + file.fieldname + path.extname(file.originalname))}
    }),
    fileFilter : function(req,file,cb){
        let acceptFile = false;
 if(file.fieldname == 'avatar' || file.fieldname == 'banner'){
     if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
       acceptFile = true
 }
}
 else if (file.fieldname == 'documents'){
    if(file.mimetype == 'application/pdf'){acceptFile = true}

}

else {
    if(!acceptFile){
        const message = `Field ${file.fieldname} wrong type (${file.mimetype})`;
         !req.invalidFiles ? req.invalidFiles = [message] : req.invalidFiles.push(message);
    }
   
}
        
     cb(null,acceptFile)
}})
const fields = [
    {name : 'avatar', maxCount : 1
    },
    {name : 'banner', maxCount : 1
    },
    {name : 'documents', maxCount : 1
    }
]
app.post('/multiple-fields', uploadProfile.fields(fields), (req,res)=>{
     console.log(req.files)
  if(req.invalidFiles){
        return res.status(200).json({message :'Some Files Could not be uploaded: ' + req.invalidFiles.join(','), warning : true})
    }
   return res.status(200).json({message: 'files uploaded', warning : false})
})
app.get('/',(req,res)=>{
  
    res.status(200).json({message : 'Testing This Router...'})
})
app.listen(port,()=>{
    console.log(`Server started at Port :${port}`)
})