
const router = require("express").Router();
const {createUser,updateUser,getUser} = require('../controllers/users.controllers');
const multer = require('multer');
const path = require('path');
const passport = require("passport");



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/image/');
    },
  
    filename: function(req, file, cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
const upload = multer({ storage: storage })

router.get('/',passport.authenticate("jwt", { session: false }),getUser)
router.post("/", createUser);

router.patch("/",upload.single("image"),passport.authenticate("jwt", { session: false }),updateUser)
  


module.exports = router;