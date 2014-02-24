; 

var src = anime.module('src').feeds;

(function(module){
		
	function genLink (description, url) {
		return '<span class="link"><a href="' + url + '">' + description + '</a></span>';
	}

	function getFreshRssUrl(url){
		var googleGarbage = new Date().getTime();
		return url + '&googleGarbage=' + googleGarbage;
	};

	var lineBreak = '<br/>';
	function polishSrcFeed (feed) {
		var blurb =
			'<div>'
			+ feed.name + ' IS OUT'
			+ lineBreak
			+ genLink('blog', feed.blog)
			+ ' '
			+ genLink('nyaa', feed.tor)
			+ '</div>'
			;	
		return { 
			rss: getFreshRssUrl(feed.rss),
			html: blurb,
			success: false //default value to be overridden
		};
	};
	
 	var allFeeds = src.feeds.map(polishSrcFeed);
 		
	module.getFeeds = function(){
		return allFeeds;
	};
	
	module.forceSetAllFeeds = function(success){
		for(var i = 0; i < allFeeds.length; i++){
			allFeeds[i].success = success;
		}
	};
	
})(anime.module('feeds'));