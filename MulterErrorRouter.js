import express from 'express';
import multer, { MulterError } from 'multer';
const errorrouter = express.Router();
const upload = multer({limits : {fieldSize : 5*1024*1024}}).array('files',3);
errorrouter.post('/', (req,res)=>{
upload(req,res, function(error){
    console.log(error)
    if(error instanceof multer.MulterError){
        res.send('MulterError: '+ error)
    }
    else if(error) {
        res.send('Error')
    }
    return res.send('success')
})
})

export default errorrouter;