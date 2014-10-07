;

(function(module){

	var src = anime.module('src').images;

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

	module.getWaiting = function(){
		return chooseRandom(src.waiting);
	};
	
	module.getSuccess = function(){
		return chooseRandom(src.success);
	};
	
	var leftAnswerBookend = genImageTag(src.leftAnswerBookend, 'answerBookends');
	var rightAnswerBookend = genImageTag(src.rightAnswerBookend, 'answerBookends');
	module.getAnswerBookends = function(){
		return [leftAnswerBookend, rightAnswerBookend];
	};
	
	var loadingRss = genImageTag(src.loadingRss, 'reloading-rss-image');
	module.getLoadingRss = function(){
		return loadingRss;
	};
	
})(anime.module('images'));