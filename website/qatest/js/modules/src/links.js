; (function(module){
  
  	var allSources = [];
  
  	module.addSource = function(name, code, saved){
  		allSources.push({
  			name: name,
  			code: code,
  			saved: saved
		});
  	};

	module.getSources = function(){
		var urls = [];
		allSources.forEach(function (src){
			var savedMarkup = "";
			if(src.saved){
				savedMarkup = "&saved=true";
			}
			urls.push(
			'<a href="index.html?src='
			+ src.code
			+ savedMarkup
			+ '">'
			+ src.name
			+ '</a>'
			);
		});
		return urls;
	};

})(anime.module('src_links'));
