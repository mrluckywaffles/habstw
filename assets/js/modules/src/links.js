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

  	module.permalink = function(src){
  		return '<a href="/?show='
			+ src.code
			+ '">'
			+ src.name
			+ '</a>';
  	}

  	var _getHtml = function(sources){
  		var res = [];
		sources.forEach(function (src){
			res.push(module.permalink(src));
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

	module.getRandomAiring = function(){
        if(airing.length == 0){
            return archived[archived.length - 1];
        }
		var index = Math.floor(Math.random()*airing.length);
		return airing[index];
	}

	module.isRandomFrontPage = function(){
		return airing.length > 1;
	}

})(anime.module('src_links'));
