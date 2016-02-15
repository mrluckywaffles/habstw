; 

var _tools = _tools || anime.module('tools');
var _src = _src || anime.module('src');

(function(module){

	var _feeds = _src.feeds;
		
	function genLink (description, url) {
		return '<a href="' + url + '">' + description + '</a>';
	}

	function getFreshRssUrl(url){
		var googleGarbage = new Date().getTime();
		return url + '&googleGarbage=' + googleGarbage;
	};

	var lineBreak = '<br/>';
	function polishSrcFeed (feed) {
		
		var pfeed = {};
	
		pfeed.rss = getFreshRssUrl(feed.rss);
	
		pfeed.html = '<div>' + feed.name;
		
		if(!_src.savedForever){
			pfeed.html += ' IS OUT';
		}
		
		pfeed.html += lineBreak
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
	
	var forceSetAllFeeds = function(success, callback){
		for(var i = 0; i < allFeeds.length; i++){
			allFeeds[i].success(true);
		}
		return callback();
	};

	function checkRSS(feeds, callback, failureHandler) {
		if(_src.savedForever){ return forceSetAllFeeds(true, callback); }
		if(_tools.getParam('saved')){ return forceSetAllFeeds(true, callback); }

		var feedToSet = feeds[0];
		if(!feedToSet){
			callback();
			return;
		}

		var processRSS = function (data){
			var success = false;

			if(!data){
				failureHandler();
				return;
			}

			var curr = new Date(); // get current date
			curr.setDate(curr.getDate() - curr.getDay());  // should return most recent Sunday
			var lastSunday = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());

			for(var i = 0; i < data.entries.length; i++){
				var latestUpload = data.entries[i];
				var latestDate = new Date(latestUpload['publishedDate']);
				success = success || lastSunday < latestDate;
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

		return $.jQRSS(urlToQuery, { count: 100 }, processRSS);
	}
	
	var allFeeds = _feeds.feeds.map(polishSrcFeed);
 	
	module.checkFeeds = function(callbackOnFeeds, failureHandler){
		checkRSS(
			allFeeds, 
			function(){callbackOnFeeds(allFeeds)}, 
			failureHandler
		);
	};
	
})(anime.module('feeds'));
