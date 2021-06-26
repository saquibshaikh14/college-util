const express = require('express');
const router =express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const File = require('../db/File');
const roles = require('../db/enum_role');
const mongoose = require('mongoose');


//1000-s 1001-invcred/unauth 1002-server 1003-invalidurl
router.get('/getfiles/:cell', async(req, res)=>{
    try{
        //check for authorization.
        const user = req.user;
        if(!user)
            return res.json({message: "Unauthorized access", response_status: 1001});
        
        const cell = req.params.cell.trim() || 'undefined';

        if(!Object.values(roles).includes(cell))
            return res.json({message: "Bad url paramter " +cell , response_status: 10002});
        
        if(!user.role.includes(cell))
            return res.json({message: "Unauthorized Access", response_status: 1001});
        
        
        const filesList = await File.find({uploadedUnder: cell}).populate('uploadedBy','email').sort({_id: -1});

        await delay(1500);

        return res.json({response_status: 1000, response_data: filesList})
    }
    catch(err){
        console.log(err);
        res.json({message: "Internal server error", response_status: 10002});
    }

});

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, './files');
      },
      filename(req, file, cb) {
        cb(null, `${new Date().getTime()}_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 10000000 // max file size 10MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
        return cb(
          new Error(
            'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
          )
        );
      }
      cb(undefined, true); // continue with upload
    }
  });

router.post('/uploadfile', upload.single('file'),async(req, res)=>{
    try{

        const user = req.user;
        if(!user)
            return res.json({message: "Unauthorized access", response_status: 1001});
        
        const {title, description, uploadedUnder} = req.body;
        const { path, mimetype} = req.file;

        if(!user.role.includes(uploadedUnder.trim()))
            return res.json({message: "Unauthorized Cell Access", response_status: 1001});

        const file = new File({
            title,
            description,
            file_path: path,
            file_mimetype: mimetype,
            uploadedUnder,
            uploadedBy: user._id
        });
        await file.save();

        await delay(1500);

        return res.json({response_status: 1000, response_data: {
            title,
            description,
            file_path: path,
            file_mimetype: mimetype,
            uploadedUnder,
            uploadedBy: {_id: user._id, email: user.email} 
        }});
    }catch(err){
        console.log(err.message);
        res.json({message: err.message, response_status: 1002});
    }
});

router.post('/deletefile', async (req, res)=>{
    try{
        const user = req.user;
        if(!user)
            return res.json({message: "Unauthorized access", response_status: 1001});
        
        const fileId = req.body.id || '';
        if(!mongoose.isValidObjectId(fileId))
            return res.json({response_status: 1002, message: "Invalid id"});

        const file = await File.findById({_id: fileId});
        
        if(!user.role.includes(file.uploadedUnder.trim()))
            return res.json({message: "Unauthorized Cell Access", response_status: 1001});

       await File.findByIdAndDelete({_id: fileId});

        await delay(1500);
        return res.json({response_status: 1000, message: 'Deleted'});
    }catch(err){
        console.log(err);
        res.json({message: "Internal server error", response_status: 1002});
    }
});


router.post('/downloadfile', async (req, res)=>{
    try{
        
       const user = req.user;
        
        if(!user)
            return res.json({message: "Unauthorized access", response_status: 1001});
        
        const fileId = req.body.id || '';
        if(!mongoose.isValidObjectId(fileId))
            return res.json({response_status: 1002, message: "Invalid id"});

        const file = await File.findById({_id: fileId});
        
        if(!user.role.includes(file.uploadedUnder.trim()))
            return res.json({message: "Unauthorized Cell Access", response_status: 1001});

        const fileExists = async path => !!(await fs.promises.stat(path).catch(e => false));

        if(await fileExists(path.join(__dirname, '..', file.file_path)))
            return res.download(path.join(__dirname, '..', file.file_path), 'download', (err)=>{console.log(err)});
        else
            return res.json({response_status: 1002, message: "file not found"});

    }catch(err){
        console.log(err);
        res.json({message: "Internal server error", response_status: 1002});
    }
})

module.exports = router;