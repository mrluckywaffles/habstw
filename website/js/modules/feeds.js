; 

(function(module){

	var _src = anime.module('src').feeds;
		
	function genLink (description, url) {
		return '<span class="link"><a href="' + url + '">' + description + '</a></span>';
	}

	function getFreshRssUrl(url){
		var googleGarbage = new Date().getTime();
		return url + '&googleGarbage=' + googleGarbage;
	};

	var lineBreak = '<br/>';
	function polishSrcFeed (feed) {
		
		var pfeed = {};
	
		pfeed.rss = getFreshRssUrl(feed.rss);
	
		pfeed.html =
			'<div>'
			+ feed.name + ' IS OUT'
			+ lineBreak
			+ genLink('blog', feed.blog)
			+ ' '
			+ genLink('torrent', feed.tor)
			+ '</div>'
			;
			
		var changed = true;
		pfeed.getChanged = function(){
			var wasChanged = changed;
			changed = false;
			return wasChanged;
		};
		
		var success = false;		
		pfeed.success = function(newVal){
			if(newVal != null && newVal != success){
				changed = true;
				success = newVal;
			}
			return success;
		}
		
		return pfeed;
	};
 	
	function checkRSS(feeds, callback, failureHandler) {

		var feedToSet = feeds[0];
		if(!feedToSet){
			callback();
			return;
		}
		
		var checkum = function (data){
			var success = false;

			if(!data){
				failureHandler();
				return;
			}
		
			var curr = new Date; // get current date
			var first = curr.getDate() - curr.getDay(); // should return most recent monday
			var lastMonday = new Date(curr.setDate(first)); // it returns the time of day so its only kinda an approx but whatevs
		
			for(var i = 0; i < data.entries.length; i++){
				var latestUpload = data.entries[i];			
				var latestDate = new Date(latestUpload['publishedDate']);
				success = success || lastMonday < latestDate;				
			}
		
			feedToSet.success(success);
		
			//loop!
			checkRSS(feeds.slice(1), callback, failureHandler);
		};
	
		var param = _tools.getParam("rss");	
		if(param === "false")
		{
			checkum(null);
			return;
		}

		var urlToQuery = feedToSet.rss;
	
		$.jQRSS(urlToQuery, { count: 100 }, checkum);
	}
	
	var allFeeds = _src.feeds.map(polishSrcFeed);
 	
	module.checkFeeds = function(callbackOnFeeds, failureHandler){
		checkRSS(
			allFeeds, 
			function(){callbackOnFeeds(allFeeds)}, 
			failureHandler
		);
	};
	
	module.forceSetAllFeeds = function(success){
		for(var i = 0; i < allFeeds.length; i++){
			allFeeds[i].success(true);
		}
	};
	
})(anime.module('feeds'));
