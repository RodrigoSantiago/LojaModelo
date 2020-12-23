var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('solution', { name : "solution", type: 'HOME', page : 'HOME' });
});

module.exports = router;
