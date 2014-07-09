; 

(function(module){

	module.rawFeed = function(name, rss, blog, tor)
	{
		return {
			name: name,
			rss: rss,
			blog: blog,
			tor: tor
		};
	};

})(anime.module('tools'));
