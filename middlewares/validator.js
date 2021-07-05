const { body, param, query, validationResult } = require("express-validator");
const { models } = require("../components/database");
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

exports.signupvalidator = () => {
  // return [body("email").exists({checkFalsy: true}).withMessage("email is required")];
  return [
  body('retypepass').custom((value, { req }) => {
    if (value !== req.body.password) {
      return false;
    }else{
      return true;
    }
    }).withMessage("password tidak sama"),
  body('email').custom(async (value)=>{
    let result = await models.user.findOne({where:{email:value}})
    if (result !== null) {
      console.log('User Exists');
      return Promise.reject();
    }
  }).withMessage("email telah terdaftar"),
  body("email").exists({checkFalsy: true}).withMessage("email harus ada"),
  body("password").exists({checkFalsy: true}).withMessage("password harus ada"),
  body("retypepass").exists({checkFalsy: true}).withMessage("password belum diketik ulang"),
  body("telepon").exists({checkFalsy: true}).withMessage("nomor telepon harus ada"),
  body("telepon").isNumeric().withMessage("Harap isi nomor telepon dengan benar")
]; 
}
exports.postUpdateProfile = () => {
  return [
    body("nama").exists({checkFalsy: true}).withMessage("Nama Harus ada"),
    body("telepon").exists({checkFalsy: true}).withMessage("nomor telepon Harus ada"),
    body("deskripsi").exists({checkFalsy: true}).withMessage("Deskripsi Harus ada"),
    body("deskripsi").isLength({max: 5000}).withMessage("Deskripsi Melebihi 5000 karakter"),
    body("tanggal_lahir").exists({checkFalsy: true}).withMessage("Tanggal lahir Harus ada")
  ];
}
exports.postKriteria = () => {
  return [
    body("nama_kriteria").exists({checkFalsy: true}).withMessage("Nama kriteria harus diisi"),
    body('nama_kriteria').custom(async (value)=>{
      let result = await models.kriteria.findOne({where:{nama_kriteria:value}})
      if (result !== null) {
        return Promise.reject();
      }
    }).withMessage("kriteria sudah ada"),
    body("kuesioner").exists({checkFalsy: true}).withMessage("Kuesioner harus diisi")
  ];
}

exports.resetPassword = () => {
  return [
    body('email').custom(async (value)=>{
      let result = await models.user.findOne({where:{email:value}})
      if (result == null) {
        return Promise.reject();
      }
    }).withMessage("email belum terdaftar")
  ];
}

exports.prosesResetPassword = () => {
  return [
    body('otp').custom(async (value ,{req})=>{
      let result = await models.otp.findOne({where:{email:req.body.email,otp:value}})
      if (result == null) {
        return Promise.reject();
      }
    }).withMessage("OTP tidak ada atau kadaluarsa")
  ];
}

exports.updatePass = () => {
  return [
    body('passlama').custom(async (value,{req})=>{
      let result = await models.user.findOne({where:{email:req.session.name},attribute : ['password']})
      console.log(result);
      let hasil = bcrypt.compareSync(value, result.password)
      if (hasil !== true) {
        return Promise.reject();
      }
    }).withMessage("password lama salah"),
    body('retpassbaru').custom((value, { req }) => {
      if (value !== req.body.passbaru) {
        return false;
      }else{
        return true;
      }
      }).withMessage("password baru tidak sama"),
      body("passlama").exists({checkFalsy: true}).withMessage("Password lama belum diisi"),
      body("passbaru").exists({checkFalsy: true}).withMessage("Password baru belum diisi"),
      body("retpassbaru").exists({checkFalsy: true}).withMessage("Password baru belum diketik ulang")
  ];
}

 exports.validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
      return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
      errors: extractedErrors,
  })
} 
