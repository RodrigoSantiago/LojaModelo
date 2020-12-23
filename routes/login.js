var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { name : "login", type: 'DEFAULT', page : 'PROF' });
});

module.exports = router;
