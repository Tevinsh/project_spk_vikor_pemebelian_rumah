"use strict";
const multer = require('multer');

const files = {name: ''}

var storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/user_image')
    },
    filename: function (req, file, cb) {
        var ext = file.mimetype.split('/')[1];
        return cb(null, files.name + Date.now() + "." + ext);
    }
  })

var storageRumah = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/rumah_image')
  },
  filename: function (req, file, cb) {
      var ext = file.mimetype.split('/')[1];
      return cb(null, files.name + Date.now() + "." + ext);
  }
})
  
var uploadAvatar = multer({ storage: storageAvatar }).single('imgupload');
var uploadRumah = multer({ storage: storageRumah }).array('imgupload',3);

module.exports =  {uploadAvatar,uploadRumah,files};


  
