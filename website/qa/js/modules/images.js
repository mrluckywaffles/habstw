;

var src = anime.module('src').images;

(function(module){

	function chooseRandom (images) {		
		var index = Math.floor(Math.random()*images.length);
		return images[index];
	};
	
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

	function resizeImage (img) {
		var maxWidth = 700;
		var width = img.width;
		var count = Math.floor(maxWidth/width);
		if(count < 1){
			count = 1;
		}
		var px = maxWidth/count;
		var styles = 'width: ' + px + 'px;';
		var data = "";
		for(var i = 0; i < count; i++)
		{
			data += genImageTag(img.src, null, styles);
		}
		img.imgTag = data;
	}	

	function genMainImage(url){
		var img = new Image();
		img.imgTag = 'something happened';
		img.onload = function(){
			resizeImage(img);
		};
		img.src = url;
		return img;
	}
		
	var waiting = genMainImage(chooseRandom(src.waiting));
	module.getWaiting = function(){
		return waiting.imgTag;
	};
	
	var success = genMainImage(chooseRandom(src.success));
	module.getSuccess = function(){
		return success.imgTag;
	};
	
	var leftAnswerBookend = genImageTag(src.leftAnswerBookend, 'answerBookends');
	var rightAnswerBookend = genImageTag(src.rightAnswerBookend, 'answerBookends');
	module.getAnswerBookends = function(){
		return [leftAnswerBookend, rightAnswerBookend];
	};
	
})(anime.module('images'));