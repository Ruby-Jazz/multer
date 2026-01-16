import multer from "multer";
import fs from 'fs'
import path from 'path'

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
export const upload = multer({storage,fileFilter})

export const uploadMany = multer({storage,fileFilter:  function(req,file,cb){
    if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
        cb(null,true)
    }
    else{
      !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname);
      cb(null,false)
}

}})

export const uploadProfile = multer({
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
export const fields = [
    {name : 'avatar', maxCount : 1
    },
    {name : 'banner', maxCount : 1
    },
    {name : 'documents', maxCount : 1
    }
]
