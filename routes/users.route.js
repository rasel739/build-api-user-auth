
const router = require("express").Router();
const {createUser,loginUser,updateUser,getUser,userDelete} = require('../controllers/users.controllers');
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



router.post("/user-signup", createUser);
router.post("/user-login", loginUser);
router.get('/', passport.authenticate("jwt", { session: false }), getUser);
router.patch("/", upload.single("image"), passport.authenticate("jwt", { session: false }), updateUser);
router.delete('/', passport.authenticate("jwt", { session: false }), userDelete);

  


module.exports = router;