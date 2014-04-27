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
		if(shouldLog){
			module.log = realLog;
		} else {
			module.log = emptyLog;
		}
		return shouldLog;
	};
	
	module.shouldLog(document.URL.indexOf("qatest") > -1);
	
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
; (function(module){
	
	var _tools = anime.module('tools');
	
	anime.module('src_links').addSource('Kill la Kill', 'klk', true);

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
	text.waitingFollowup = "";
	
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
	
	anime.module('src_links').addSource('JoJo', 'jojo', false);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/QzEuoVY.gif'; //dio stand punching
	images.leftAnswerBookend = 'http://i.imgur.com/CpXcYP4.gif'; //dio standing
	images.rightAnswerBookend = 'http://i.imgur.com/vbsR9w0.gif'; //jotaro win
	images.waiting = [
		'http://i.imgur.com/Il557U0.png'	//dio vs jotaro art
	];
	images.success = [
		'http://i.imgur.com/QFwkov1.gif'  //YES gif
	];
	images.defaultMainImageTag = '<img src="http://i.imgur.com/OfD6OXd.png" style="width: 700px;">';
		//jojo and dio face off
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Friday afternoonish";

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/uvtjht44cb',		//walk like an egyptian
		'http://k007.kiwi6.com/hotlink/10po8om1ml'		//roundabout
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=JoJo',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=JoJo&user=64513'
		)/*,
		_tools.rawFeed(
			'COMMIE',
			'http://www.nyaa.se/?page=rss&user=76430&term=JoJo',
			'http://commiesubs.com/category/jojo/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=JoJo&user=76430'
		)*/
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_jojo'));
; (function(module){

	var _tools = anime.module('tools');
	
	anime.module('src_links').addSource('Ping Pong', 'pingpong', false);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/AVyg9Kc.png'; //paddle
	images.leftAnswerBookend = 'http://i.imgur.com/AVyg9Kc.png'; //paddle
	images.rightAnswerBookend = 'http://i.imgur.com/AVyg9Kc.png'; //paddle
	images.waiting = [
		'http://i.imgur.com/is6DD70.jpg'	//peco smiling
	];
	images.success = [
		'http://i.imgur.com/Ou3vNV0.jpg'  //peco promo
	];
	images.defaultMainImageTag = '<img src="http://i.imgur.com/Ou3vNV0.jpg" style="width: 700px;">';
		//peco promo
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Thursday afternoonish";

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/nfm5mn7deb'		//ur the best
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=Ping+Pong',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=Ping+Pong&user=64513'
		),
		_tools.rawFeed(
			'COMMIE',
			'http://www.nyaa.se/?page=rss&user=76430&term=Ping+Pong',
			'http://commiesubs.com/category/jojo/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=Ping+Pong&user=76430'
		),
		_tools.rawFeed(
			'PUYA (Spanish)',
			'http://www.nyaa.se/?page=rss&user=239789&term=Ping+Pong',
			'http://www.puya-subs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=Ping+Pong&user=239789'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_pingpong'));
; (function(module){

	var _tools = anime.module('tools');
  
	var moduleName = 'src_pingpong';

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
//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//rss=false (checked in feeds.js)

var _tools = _tools || anime.module('tools');
var _images = _images || anime.module('images');
var _feeds = _feeds || anime.module('feeds');
var _music = _music || anime.module('music');
var _src = _src || anime.module('src');

var lineBreak = '<br/>';

function updateContent (checkedFeeds) {

	var answer = $('#answerText');
	var followup = $('#followup');
	var imageHolder = $('#image');	

	//leave this in for debugging stuff	
	var param = _tools.getParam("saved");	
	if(param === "true"){ _feeds.forceSetAllFeeds(true); }
	if(param === "false"){ _feeds.forceSetAllFeeds(false); }
	//end debugging
	
	var isSaved = false;
	followup.empty();
	for(var i = 0; i < checkedFeeds.length; i++){
		var feed = checkedFeeds[i];
		if(feed.success()){
			if(isSaved){
				followup.append(lineBreak);
			}
			isSaved = true;
			followup.append(feed.html);
		}
	}
	
	if(isSaved) {	
		var bookends = _images.getAnswerBookends();
 		$('#leftAnswerBookend').html(bookends[0]);		
		answer.html('YES');
 		$('#rightAnswerBookend').html(bookends[1]);
		imageHolder.html(_images.getSuccess());
	}
	else{
		answer.html(_src.text.waiting);
		followup.html(lineBreak + _src.text.waitingFollowup);
		imageHolder.html(_images.getWaiting());
	}
}

var timesChecked = 0;

function showSaved (checkedFeeds) {
	
	if(timesChecked > 0){
		$('.reloading-rss').fadeOut(500);
	}
	timesChecked++;

	var changed = false;
	for(var i = 0; i < checkedFeeds.length; i++){
		changed = checkedFeeds[i].getChanged() || changed;
	}

	if(changed || checkedFeeds.length == 0) {
		var contentDiv = $('#content');
		contentDiv.fadeOut(500, function(){
			updateContent(checkedFeeds);
			contentDiv.fadeIn(500);
		});
	}
}

function rssFailed () {
	$('#answerText').html('rss lookup failed');
	$('#error').html('Try refreshing! If the problem persists, please contact hasanimebeensavedthisweek@gmail.com');
}

//main func

function fetchContent(){
	if(timesChecked > 0){
		$('.reloading-rss').fadeIn(500);
	}
	
	_feeds.checkFeeds(showSaved, rssFailed);
}

function addLinks(){
	var links = $('.links');
	links.append("Permalinks:" + lineBreak);
	var urls = anime.module("src_links").getSources();
	urls.forEach(function (u){
		links.append(u + " ");
	});
}

function animeSecrets () {

	$('#error').empty();

	$('.reloading-rss').hide();
	$('.reloading-rss').html(_images.getLoadingRss());

	$('.toggleInfo').click(function(){
		$('.info').toggleClass('show');
	});
	$('.toggleMusic').click(function(){
		$('.music').toggleClass('show');
	});
	
	var musicSelectors = {
		play: '#play',
		pause: '#pause',
		next: '.next'
	};
	_music.init(musicSelectors);

	fetchContent();
	if(_src.feeds.feeds.length > 0){
		setInterval(fetchContent, 30000);	
	}
	
	addLinks();
}