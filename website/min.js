var anime = anime || {};

anime.module = function () {
    
    var modules = {};

    var mod = function(name) {
        
        if (modules[name])
        {
            return modules[name];
        }
        
        return modules[name] = { moduleName: name };
    };

    mod.exists = function(name){
        return !!modules[name];
    };
	
	mod.set = function(dest, src){
		modules[dest] = mod(src);
	};
	
    mod._delete = function(name){
        delete modules[name];
    };

    return mod;
}();
; 

(function(module){
	
	var original = window.console;
	
	var emptyLog = function(){};
	var realLog = function(){
		original.log.apply(original, arguments);
	};
	
	module.shouldLog = function(shouldLog){
		console.log('logging: ' + shouldLog);
		if(shouldLog){
			module.log = realLog;
		} else {
			module.log = emptyLog;
		}
		return shouldLog;
	};
	
	module.shouldLog(false);
	
})(anime.module('tools'));; 

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
;

(function($) {
    if (!$.jQRSS) { 
    	var _tools = anime.module('tools');
    	
        $.extend({  
            jQRSS: function(rss, options, func) {
                if (arguments.length <= 0) return false;

                var str, obj, fun;
                for (i=0;i<arguments.length;i++) {
                    switch(typeof arguments[i]) {
                        case "string":
                            str = arguments[i];
                            break;
                        case "object":
                            obj = arguments[i];
                            break;
                        case "function":
                            fun = arguments[i];
                            break;
                    }
                }

                if (str == null || str == "") {
                    if (!obj['rss']) return false;
                    if (obj.rss == null || obj.rss == "") return false;
                }

                var o = $.extend(true, {}, $.jQRSS.defaults);

                if (typeof obj == "object") {
                    if ($.jQRSS.methods.getObjLength(obj) > 0) {
                        o = $.extend(true, o, obj);
                    }
                }

                if (str != "" && !o.rss) o.rss = str;
                o.rss = escape(o.rss);

                var gURL = $.jQRSS.props.gURL 
                    + $.jQRSS.props.type 
                    + "?v=" + $.jQRSS.props.ver
                    + "&q=" + o.rss
                    + "&callback=" + $.jQRSS.props.callback;

                var ajaxData = {
                        num: o.count,
                        output: o.output,
                    };

                if (o.historical) ajaxData.scoring = $.jQRSS.props.scoring;
                if (o.userip != null) ajaxData.scoring = o.userip;

                $.ajax({
                    url: gURL,
                    beforeSend: function (jqXHR, settings) {
						_tools.log(new Array(30).join('-'), "REQUESTING RSS XML", new Array(30).join('-'));
						_tools.log({ ajaxData: ajaxData, ajaxRequest: settings.url, jqXHR: jqXHR, settings: settings, options: o }); 
						_tools.log(new Array(80).join('-')); 
                    },
                    dataType: o.output != "xml" ? "json" : "xml",
                    data: ajaxData,
                    type: "GET",
                    xhrFields: { withCredentials: true },
                    error: function (jqXHR, textStatus, errorThrown) { return new Array("ERROR", { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown } ); },
                    success: function (data, textStatus, jqXHR) {  
                        var f = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : null : null,
                            e = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed['entries'] ? data.responseData.feed.entries : null : null : null
                        _tools.log(new Array(30).join('-'), "SUCCESS", new Array(30).join('-'));
						_tools.log({ data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e });
						_tools.log(new Array(70).join('-'));
						if (fun) {
                            return fun.call(this, data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : data.responseData : null);
                        }
                        else {
                            return { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e };
                        }
                    }
                });
            }
        });
        $.jQRSS.props = {
            callback: "?",
            gURL: "http://ajax.googleapis.com/ajax/services/feed/",
            scoring: "h",
            type: "load",
            ver: "1.0"
        };
        $.jQRSS.methods = {
            getObjLength: function(obj) {
                if (typeof obj != "object") return -1;
                var objLength = 0;
                $.each(obj, function(k, v) { objLength++; })
                return objLength;
            }
        };
        $.jQRSS.defaults = {
            count: "10", // max 100, -1 defaults 100
            historical: false,
            output: "json", // json, json_xml, xml
            rss: null,  //  url OR search term like "Official Google Blog"
            userip: null
        };
    }
})(jQuery);
; 

(function(module){

	module.setCookie = function(cname,cvalue,exdays)
	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname+"="+cvalue+"; "+expires;
	};
	
	module.getCookie = function(cname)
	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return null;
	};
	
})(anime.module('tools'));
; 

(function(module){
	
	module.getParam = function ( sname ) {
		var params = location.search.substr(location.search.indexOf("?")+1);
		var sval = "";
		params = params.split("&");
		// split param and value into individual pieces
		for (var i=0; i<params.length; i++)
		{
			temp = params[i].split("=");
			if ( [temp[0]] == sname ) { sval = temp[1]; }
		}
		return sval;
	};

})(anime.module('tools'));
; (function(module){
	
	var _tools = anime.module('tools');

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'http://i.imgur.com/HNR6h13.png'; //mako face right
	images.rightAnswerBookend = 'http://i.imgur.com/ShLuqus.png'; //mako face left
	images.waiting = [
	// 	'http://i.imgur.com/Aio5V6d.png', //ep16 this sucks
	// 	'http://i.imgur.com/uKlWv5U.png', //ep02 mako dead
	// 	'http://i.imgur.com/87UTib6.png', //ep13 ryuuko in bed
		'http://i.imgur.com/OyMOAhq.gif', //ep16 mako sleeping in chair
		'http://i.imgur.com/wgDoGZ1.gif'  //ep14 mako sad w/ stick
	];	
	images.success = [
	// 	'http://i.imgur.com/JocUhFU.png', //ep02 nosebleed
	// 	'http://i.imgur.com/o5eteZt.png', //ep02 confident smile
		'http://i.imgur.com/pTX2Bz4.png'  //ED-2 mako + elephant
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = 'not yet :<';
	
	music.tracks = [
		'http://k007.kiwi6.com/hotlink/pu6o4nwuzf',		//06
		'http://k007.kiwi6.com/hotlink/q306ya962v',		//04
		'http://k007.kiwi6.com/hotlink/c71c6yjfn4'		//14
	];
	
	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=Kill+la+Kill+720p',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=64513'
		),
		_tools.rawFeed(
			'UNDERWATER',
			'http://www.nyaa.se/?page=rss&user=265&term=Kill+la+Kill',
			'http://underwater.nyaatorrents.org/?tag=KILL%20la%20KILL',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=265'
		)
	];	
	
	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;
	
})(anime.module('src_klk'));
; (function(module){

	var _tools = anime.module('tools');

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'http://i.imgur.com/HNR6h13.png'; //mako face right
	images.rightAnswerBookend = 'http://i.imgur.com/ShLuqus.png'; //mako face left
	images.waiting = [
		'http://i.imgur.com/Il557U0.png'	//dio vs jotaro art
	];
	images.success = [
		'http://i.imgur.com/pTX2Bz4.png'  //ED-2 mako + elephant
	];
	images.defaultMainImageTag = '<img src="http://i.imgur.com/Il557U0.png" style="width: 700px;">';
	
	text.waiting = "soon...";

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/10po8om1ml'		//roundabout
	];

	feeds.feeds = [];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_jojo'));
; (function(module){

	var _tools = anime.module('tools');
  
	var moduleName = 'src_jojo';
  
	var paramSrc = _tools.getParam('src');
	if(paramSrc && paramSrc.length > 0){
		moduleName = 'src_' + paramSrc;
	}
	
	anime.module.set(module.moduleName, moduleName);

})(anime.module('src'));
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

	function resizeImage (img) {
		var maxWidth = 700;
		var width = img.width;
		var count = Math.floor(maxWidth/width);
		if(count < 1){
			count = 1;
		}
		var px = maxWidth/count;
		var styles = 'width: ' + px + 'px;';
		var data = "";
		for(var i = 0; i < count; i++)
		{
			data += genImageTag(img.src, null, styles);
		}
		img.imgTag = data;
	}	

	function genMainImage(url){
		var img = new Image();
		img.imgTag = src.defaultMainImageTag;
		img.onload = function(){
			resizeImage(img);
		};
		img.src = url;
		return img;
	}
		
	var waiting = genMainImage(chooseRandom(src.waiting));
	module.getWaiting = function(){
		return waiting.imgTag;
	};
	
	var success = genMainImage(chooseRandom(src.success));
	module.getSuccess = function(){
		return success.imgTag;
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
	
})(anime.module('images'));; 

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
;

(function(module){
		
	var src = anime.module('src').music;
	var _tools = anime.module('tools');

	var paused = false;
	var song = 0;
	var tracks = src.tracks;
	var audios = [];
	var music = function(){
		return audios[song];
	}
	var _selectors;

	function saveCookies(){
		_tools.setCookie('song', song, 7);
		_tools.setCookie('paused', paused, 7);
	}
	function incSong(){
		song = (song + 1) % tracks.length;
		saveCookies();	
	}
	function refreshMusic(){
		if(paused){
			music().pause();
		} else {
			music().play();
		}
	}
	function setMusicAsPaused(pause){
		paused = pause;
		refreshMusic();
		saveCookies();
	}
	function nextSong(){
		if(!paused){
			music().pause();
			incSong();
			music().currentTime=0;
			music().play();
		}
	}
	function loadCookies(){
		var c_song = _tools.getCookie('song');
		if(c_song){
			song = parseInt(c_song) % tracks.length;
		} //else 0
		var c_paused = _tools.getCookie('paused');
		if(c_paused && c_paused == "true"){
			$(_selectors.pause).trigger('click');
		} else {
			setMusicAsPaused(false);
		}
	}
	
	module.init = function(selectors){	
		for(var i = 0; i < tracks.length; i++){
			audios[i] = document.createElement('audio');
			audios[i].setAttribute('src', tracks[i]);
			audios[i].setAttribute('preload', true);
			audios[i].setAttribute('loop', true);
			audios[i].pause();
		}

		_selectors = selectors;
		$(_selectors.play).click(function (){
			setMusicAsPaused(false);
		});
		$(_selectors.pause).click(function (){
			setMusicAsPaused(true);
		});
		
		if(tracks.length > 1){
			$(_selectors.next).click(nextSong);		
		}
		else {
			$(_selectors.next).remove();		
		}

		loadCookies();
	};
	
})(anime.module('music'));
