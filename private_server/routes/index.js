var express = require('express');
var router = express.Router();
const {resolve} = require("path")

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    let absolutePath = resolve('../html/teacherhomepage.html')
    res.sendFile(absolutePath)

});

module.exports = router;
