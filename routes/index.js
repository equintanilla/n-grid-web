var express = require('express');
var router = express.Router();
var nGridService = require(global.__base + '/services/nGridService');
/* GET home page. */
var nGridUrlRegex = nGridService.N_GRID_URL_REGEX;
router.get( nGridUrlRegex , function(req, res, next) {
  res.render('index', { title: 'N-Grid' });
});

module.exports = router;
