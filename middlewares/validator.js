const { body, param, query, validationResult } = require("express-validator");
const { models } = require("../components/database");

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
