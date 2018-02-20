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

module.exports.createPP = function (newPP, callback) {
  console.log("creatingPP");
  newPP.save(callback);
}

module.exports.getPPs = function (query, callback) {
    var JSONQuery = JSON.stringify(query);
    var queryString = "";
    var queryFilter = {};
    //var query = {companyName : query["companyName"], industry: query["industry"]}; //works
   
   // var query2 = {};  
   // query2["companyName"] = query["companyName"];   // works
   // query2["industry"] = query["industry"];

    /*
    var query = {};
    if( your_variable !== "" ) {
    query["some_key"] = your_variable;
    }
    if( your_second_variable !== "" ) {
    query["some_other_key"] = your_second_variable;
    }
    mongoose.model('customers').find(query, function(err, c) {
    //do something
});*/

    Object.keys(query).forEach(function(key,index){

        console.log(key);
        console.log(index);

       queryFilter[key] = query[key];

    });

    console.log("Looking for: " + JSON.stringify(queryFilter));
    ProofPoint.find(queryFilter, callback);

}

module.exports.getPPByCompanyName = function (companyName, callback) {
  var query = { companyName: companyName };
  ProofPoint.find(query, callback);
}

module.exports.getPPByUseCaseType = function (usecase, callback) {
    var query = { $or : [ {useCaseType : usecase}, {secondaryUseCaseType : usecase} ]};
    ProofPoint.find(query, callback);
  }

  

