; (function(module){
		
	function genLink (description, url) {
		return '<span class="link"><a href="' + url + '">' + description + '</a></span>';
	}

	function getFreshRssUrl(url){
		var googleGarbage = new Date().getTime();
		return url + '&googleGarbage=' + googleGarbage;
	};

	function genFeed (rawRss, blurb) {
		return { 
			rss: getFreshRssUrl(rawRss),
			html: blurb,
			success: false //default value to be overridden
		};
	};

	var lineBreak = '<br/>';
	var horribleRss = 'http://www.nyaa.se/?page=rss&user=64513&term=Kill+la+Kill+720p';
	var horribleBlurb = 
		'<div>'
		+ 'HORRIBLE IS OUT'
		+ lineBreak
		+ genLink('blog', 'http://horriblesubs.info/')
		+ ' '
		+ genLink('nyaa', 'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=64513')
		+ '</div>'
		;	
	var underwaterRss = 'http://www.nyaa.se/?page=rss&user=265&term=Kill+la+Kill';
	var underwaterBlurb = 
		'<div>'
		+ 'UNDERWATER IS OUT'
		+ lineBreak
		+ genLink('blog', 'http://underwater.nyaatorrents.org/?tag=KILL%20la%20KILL')
		+ ' '
		+ genLink('nyaa', 'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=265')
		+ '</div>'
		;	
		
 	var allFeeds = [
		genFeed(horribleRss, horribleBlurb),
		genFeed(underwaterRss, underwaterBlurb)
	];
 		
	module.getFeeds = function(){
		return allFeeds;
	};
	
	module.forceSetAllFeeds = function(success){
		for(var i = 0; i < allFeeds.length; i++){
			allFeeds[i].success = success;
		}
	};
	
})(anime.module('feeds'));