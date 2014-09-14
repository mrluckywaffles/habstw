; (function(module){
  
  	var allSources = [];
  
  	module.addSource = function(name, code){
  		allSources.push({
  			name: name,
  			code: code
		});
  	};

	module.getSources = function(){
		var urls = [
			'',
			'<a href="index.html">Current</a>',
			''
		];
		allSources.forEach(function (src){
			urls.push(
			'<a href="index.html?show='
			+ src.code
			+ '">'
			+ src.name
			+ '</a>'
			);
		});
		return urls;
	};

})(anime.module('src_links'));
