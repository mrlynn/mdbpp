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
    }
});
 

var ProofPoint = module.exports = mongoose.model('ProofPoint', ProofPointSchema);

module.exports.createPP = function(newPP, callback){
    console.log("creatingPP");
    newPP.save(callback);
}
