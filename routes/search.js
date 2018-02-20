var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const fileUpload = require('express-fileupload');
var fs = require('fs');


var ProofPoint = require('../models/proofpoint');


// Create
router.get('/', function(req, res){
	res.render('search',{
        user: req.user
    });
});

// Search
router.post('/findPPs', ensureAuthenticated, function(req, res){
	
	var titleText = req.body.titleText;
    var industrySelector = req.body.industrySelector;
    var useCaseSelector = req.body.useCaseSelector;
    var companyName = req.body.companyName;
    
    console.log("searching for Company: " + companyName)
    

    if (req.body.internalOnlyButton === "true")
        var internalOnly = true;
    else 
        var internalOnly = false;
    
  

    // Validation
	//req.checkBody('titleText', 'Title is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('search',{
			errors:errors
		});
	} else {

        ProofPoint.getPPByCompanyName(companyName, function(err, proofpoints){
            if(err) throw err;
            
            if(proofpoints.length === 0){
                console.log("Sorry, no proofs match for Company " + companyName);

                var error = {msg : "Sorry, no matches for your search - Try Again!"};
                
                res.render('search',{
                    empty: error
                });
            }
            else{
                console.log("Found " + proofpoints.length + " Proofs for ", companyName);
                console.log(proofpoints);
                res.render('search',{
                    pps: proofpoints
                });
                
            }
            
                
        });
	}
});



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;