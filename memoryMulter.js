import express from 'express'
import multer from 'multer';
import fs from 'fs'
import path from 'path';
const memoryRouter = express.Router();
const upload = multer({
    storage : multer.memoryStorage()
})
memoryRouter.post('/',upload.single('file'), (req,res)=>{

    //validate file format
 if(req.file.mimetype !== 'application/pdf'){
    return res.json({message : 'file type must be .pdf'})
 }
    // check and create directory
const dir = 'memory'
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir)
}
    //build the file name
const filename = Date.now() + '_' + path.extname(req.file.originalname)

    //save the file to directory  

    fs.writeFileSync(dir + '/' + filename , req.file.buffer)

    res.send('success')
    }
)
export default memoryRouter;