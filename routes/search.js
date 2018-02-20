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
    
    var query = {};

    // Validation
    //req.checkBody('titleText', 'Title is required').notEmpty();
    // gotta run a query builder here or something. 
    if(titleText !== "") {
       // console.log("adding title text to query");
        query.title = titleText;

    }
    if(industrySelector !== "") {
       // console.log("adding industrySelector to query");
        query.industry = industrySelector;
    }
    if(useCaseSelector !== "") {
       // console.log("adding useCaseSelector to query");
        
       query.useCaseType = useCaseSelector;
       // var query = { $or : [ {useCaseType : usecase}, {secondaryUseCaseType : usecase} ]};

    }
    if(companyName !== "") {
       // console.log("adding companyName to query");
        query.companyName = companyName;
    }

    console.log("QUEEERRRRRRRYYYYY" , query)


	var errors = req.validationErrors();

	if(errors){
		res.render('search',{
			errors:errors
		});
	} else {

        
        ProofPoint.getPPs(query, function(err, proofpoints) {
            if(err) throw err;

            if(proofpoints.length === 0){
                console.log("Sorry, no proofs match for the query " + JSON.stringify(query));
                var error = {msg : "Sorry, no matches for your search - Try Again!"};
                res.render('search',{
                    empty: error
                });
            }
            else{
                console.log("Found " + proofpoints.length + " Proofs for ", JSON.stringify(query));
                //console.log(proofpoints);
                res.render('search',{
                    pps: proofpoints
                });
            }

        }) 
    
        /*
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
                //console.log(proofpoints);
                res.render('search',{
                    pps: proofpoints
                });
            }
        });
        */
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