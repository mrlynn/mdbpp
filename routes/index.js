var express = require('express');
var router = express.Router();
var ProofPoint = require('../models/proofpoint');
var PptxGenJS = require("pptxgenjs");

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
router.get('/pptdownload/:ppId',function(req, res, next) {
	ppId = req.params.ppId;
	res.render('pptdownload',{ppId: ppId});
})
router.get('/ppt/:ppId', function(req, res, next) {
	ppId = req.params.ppId;
	ProofPoint.findOne({_id: ppId}, function(err, doc) {
		console.log(JSON.stringify(doc));
		var pptx = new PptxGenJS();
		pptx.setLayout('LAYOUT_WIDE');

		pptx.defineSlideMaster({
		title: 'MASTER_SLIDE',
		bkgd:  'FFFFFF',
		objects: [
			{ 'line':  { x: 3.5, y:1.00, w:6.00, line:'0088CC', lineSize:5 } },
			{ 'rect':  { x: 0.0, y:5.30, w:'100%', h:0.75, fill:'F1F1F1' } },
			{ 'text':  { text:'Proof Point', options:{ x:3.0, y:5.30, w:5.5, h:0.75 } } },
			{ 'image': { x:11.3, y:6.40, w:1.67, h:0.75, path:'images/logo.png' } }
		],
		slideNumber: { x:0.3, y:'90%' }
		});

		var slide = pptx.addNewSlide('MASTER_SLIDE');
		slide.addText('How To Create PowerPoint Presentations with JavaScript', { x:0.5, y:0.7, font_size:18 });
		slide.addText(doc.companyName, { x:0.5, y:0.25, font_size:22, fontFace:'Arial', color:'0088CC' });
		slide.addText(doc.title, { x:0.5, y:2, font_size:18, fontFace:'Arial', color:'0088CC' });
		slide.addText(doc.title, { x:0.5, y:2, font_size:18, fontFace:'Arial', color:'0088CC' });
		pptx.save('public/uploads/' + doc._id + '.pptx');
		res.redirect('/pptdownload/' + doc._id);
		
	})
});

function streamCallback(data) {
	var strFilename = "Node-Presenation-Streamed.pptx";

	app.get('/', function(req, res) {
		res.writeHead(200, { 'Content-disposition':'attachment;filename='+strFilename, 'Content-Length':data.length });
		res.end(new Buffer(data, 'binary'));
	});

	app.listen(3001, function() {
		console.log('PptxGenJS Node Demo app listening on port 3000!');
		console.log('Visit: http://localhost:3000/');
		console.log('(press Ctrl-C to quit app)');
	});
}

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;