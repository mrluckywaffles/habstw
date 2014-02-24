;

var src = anime.module('src').images;

(function(module){

	function genImageTag(url, classes, styles){
		var c = '';
		if(classes){
			c = ' class="' + classes + '"';
		}
		var s = '';
		if(styles){
			s = ' style="' + styles + '"';
		}		
		return '<img src="' + url + '"' + c + s +' />'
	}

	function genImage (url, count) {
		count = count ? count : 1;
		var px = 700/count;
		var styles = 'width: ' + px + 'px;';
		var data = "";
		for(var i = 0; i < count; i++)
		{
			data += genImageTag(url, null, styles);
		}
		return data;
	}	

	function genImageObj(url, count){
		var preloadedImage = new Image();
		preloadedImage.src = url;
		var imageObj = {
			url: url,
			count: count,
			imgTag: genImage(url, count)
		};
		return imageObj;
	}

	var waitingImages = [
	// 	genImageObj('http://i.imgur.com/Aio5V6d.png'), //ep16 this sucks
	// 		genImageObj('http://i.imgur.com/uKlWv5U.png'), //ep02 mako dead
	// 		genImageObj('http://i.imgur.com/87UTib6.png'), //ep13 ryuuko in bed
		genImageObj('http://i.imgur.com/OyMOAhq.gif', 3), //ep16 mako sleeping in chair
		genImageObj('http://i.imgur.com/wgDoGZ1.gif', 3) //ep14 mako sad w/ stick
	];	
	var successImages = [
	// 		genImageObj('http://i.imgur.com/JocUhFU.png'), //ep02 nosebleed
	// 		genImageObj('http://i.imgur.com/o5eteZt.png'), //ep02 confident smile
		genImageObj('http://i.imgur.com/pTX2Bz4.png') //ed2 mako + elephant
	];
	var leftAnswerBookend = genImageTag(src.leftAnswerBookend, 'answerBookends');
	var rightAnswerBookend = genImageTag(src.rightAnswerBookend, 'answerBookends');

	function getRandomImage (images) {		
		var index = Math.floor(Math.random()*images.length);
		return images[index];
	};
	
	module.getWaiting = function(){
		return getRandomImage(waitingImages).imgTag;
	};
	module.getSuccess = function(){
		return getRandomImage(successImages).imgTag;
	};
	module.getAnswerBookends = function(){
		return [leftAnswerBookend, rightAnswerBookend];
	};
	
})(anime.module('images'));