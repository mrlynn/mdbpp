var express = require('express');
var router = express.Router();
var ProofPoint = require('../models/proofpoint');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	ProofPoint.find({},function(err,docs) {
		console.log(JSON.stringify(docs));
		res.render('index',{
			user: req.user,
			pp: docs
		});
	});

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;