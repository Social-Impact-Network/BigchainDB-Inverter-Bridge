var express = require('express');
var router = express.Router();
var startScript = require("../cron");





/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', { title: 'up' });

});

module.exports = router;

