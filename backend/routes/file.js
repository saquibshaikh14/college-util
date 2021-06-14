const path = require('path');
const express = require('express');
const multer = require('multer');
const File = require('../db/file');
const User = require ('../db/User')
const Router = express.Router();
const fs =require('fs');


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
      fileSize: 1000000 // max file size 1MB = 1000000 bytes
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
  
  Router.post(
    '/upload',
    upload.single('file'),
    async (req, res) => {
      try {
        //console.log(req.body);
        const { title, description ,uploadedUnder} = req.body;
        const { path, mimetype } = req.file;
        const file = new File({
          title,
          description,
          file_path: path,
          file_mimetype: mimetype,
          uploadedUnder: uploadedUnder,
          uploadedBy: req.user,
        });
        await file.save();
        res.send('file uploaded successfully.');
        console.log('file uploaded');
               
      } catch (error) {
        res.status(400).send('Error while uploading file. Try again later.');
      }
    },
    (error, req, res, next) => {
      if (error) {
        res.status(500).send(error.message);
      }
    }
  );

Router.get('/getAllFiles', async (req, res) => {
  try {
    //console.log(req.user);
    const files = await File.find({uploadedUnder:req.user.role});
    const sortedByCreationDate = files.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.send(sortedByCreationDate);
  } catch (error) {
    res.status(400).send('Error while getting list of files. Try again later.');
  }
});

Router.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    res.set({
      'Content-Type': file.file_mimetype
    });
    //console.log(path.join(__dirname, '..', file.file_path))
    res.sendFile(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
});

Router.delete("/delete/:id", function(req, res) {
  File.findByIdAndRemove(req.params.id, function(err,data) {
    if(err) {
      res.status(400).send('Error while deleting file. Try again later.');
    } else {
      //console.log(res.file_path);
      res.status(200).json({
        msg: data
      })
      fs.unlink(path.join(__dirname, '..', data.file_path), (err) => {
        if (err) {
            console.log("failed to delete local image:");
        } else {
            console.log('successfully deleted local image');                                
        }
    });
    }
  });
});



module.exports = Router;
