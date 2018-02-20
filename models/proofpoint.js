var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// ProofPoint Schema
var ProofPointSchema = mongoose.Schema({
	title: {
		type: String,
	},
	industry: {
		type: String
	},
	useCaseType: {
		type: String
	},
	secondaryUseCaseType: {
		type: String
    },
    whyMongo: {
		type: Array
    },
    pbos: {
		type: Array
    },
    companyName: {
        type: String
    },
    quote: {
		type: String
    },
    speakerNotes: {
		type: String
    },
    internalOnly: {
		type: Boolean
    },
    createdDate: {
        type: Date
    },
    user: {
      type: mongoose.Schema.Types.Mixed
    },
    logo: {
        data: Buffer, contentType: String 
    }
    
});
 

var ProofPoint = module.exports = mongoose.model('ProofPoint', ProofPointSchema);

module.exports.createPP = function(newPP, callback){
    console.log("creatingPP");
    newPP.save(callback);
}

module.exports.getPPByCompanyName = function(companyName, callback){
    var query = {companyName: companyName};
    ProofPoint.find(query,callback);
	
}

