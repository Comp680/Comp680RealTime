var express = require('express');
var router = express.Router();
/**
 * @api {get} / Retrieve the main page of the site
 * @apiGroup Default
 * @apiName FrontPage
 */
router.get('/', function(req, res, next) {
	res.render('index', {
		user : req.user,
		title : "Login"
	});
});

module.exports = router;
