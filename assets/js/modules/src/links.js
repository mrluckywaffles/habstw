; (function(module){
  
  	var archived = [];
  	var airing = [];
  
  	module.addSource = function(module){
  		if(module.savedForever){
  			archived.push(module);
  		} else {
	  		airing.push(module);
	  	}
  	};

  	var _getHtml = function(sources){
  		var res = [];
		sources.forEach(function (src){
			res.push(
			'<a href="/?show='
			+ src.code
			+ '">'
			+ src.name
			+ '</a>'
			);
		});  	
		return res;	
  	}

	module.getSources = function(){
		var urls = [
			'',
			'<a href="/">Current</a>',
			''
		];
		urls = urls.concat(_getHtml(airing));
		urls.push('');
		urls = urls.concat(_getHtml(archived));
		return urls;
	};

})(anime.module('src_links'));
