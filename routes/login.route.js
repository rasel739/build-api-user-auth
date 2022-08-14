const express = require("express");
const { loginUser } = require("../controllers/login.controllers");
const router = express.Router();

router.post("/", loginUser);

module.exports = router;
