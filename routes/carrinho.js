var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('carrinho', { name : "carrinho", type: 'DEFAULT', page : 'CART' });
});

module.exports = router;
