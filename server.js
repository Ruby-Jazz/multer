import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import mongoose from 'mongoose';
import { fields, uploadProfile } from './Multer/Multer.js';
import userRouter from './UserRouter.js';
import errorrouter from './Multer/MulterErrorRouter.js';


const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL).then(()=>console.log('connected to MongoDb')).catch((err)=>console.log(err.reason));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use('/api/user', userRouter)
app.use('/api/error',errorrouter)
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
    console.log('API KEY:', process.env.CLOUDINARY_API_KEY);
   
    

    console.log(`Server started at Port :${port}`)
})