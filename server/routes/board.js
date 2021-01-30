var express = require("express");
var router = express.Router();

router.get("/",function(req,res){
    res.send("Hello, hello, how low");
})

module.exports=router;