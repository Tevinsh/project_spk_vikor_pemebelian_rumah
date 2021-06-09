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
  body('email').custom(val=>{
    return models.user.findOne({where:{email:val}})
    .then((result)=>{
      if (result){
        return false
      }else{
        return true
      }
    })
  }).withMessage("email telah terdaftar")
]; 
}



























exports.postGetCicilan = () => {
  return [
    body("aid").exists().withMessage("aid is required"),
    body("aid").isNumeric().withMessage("aid is number")
  ];
}
exports.postTampilUpdateCicilan = () => {
  return [
    body("aid").exists().withMessage("aid is required"),
    body("aid").isNumeric().withMessage("aid is number"),
    body("lender_transfer_date").exists().withMessage("aid is required"),
    body("lender_transfer_date").isISO8601().withMessage("invalid date, please use ISO 8601 format"),
    body("pstart_date").exists().withMessage("aid is required"),
    body("pstart_date").isISO8601().withMessage("invalid date, please use ISO 8601 format"),
    body("pstart_date").isDate({format: 'YYYY-MM-DD'}).withMessage("invalid date, please use YYYY-MM-DD"),
    body("pstart_date").custom(val => {
      if ((new Date(val)).getDate()>28) {
        return false;
      }else{
        return true;
      }
    }).withMessage("please insert date below or equal 28")
  ];
}
exports.postUpdateCicilan = () => {
  return [
    body("aid").exists().withMessage("aid is required"),
    body("aid").isNumeric().withMessage("aid is number"),
    body("pstart_date").exists().withMessage("pstart_date is required"),
    body("pstart_date").isISO8601().withMessage("invalid date, please use ISO 8601 format"),
    body("pstart_date").isDate({format: 'YYYY-MM-DD'}).withMessage("invalid date, please use YYYY-MM-DD"),
    body("pstart_date").custom(val => {
      if ((new Date(val)).getDate()>28) {
        return false;
      }else{
        return true;
      }
    }).withMessage("please insert date below or equal 28"),
    
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
