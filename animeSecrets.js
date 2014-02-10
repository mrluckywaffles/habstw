//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//rssoff=true

//magic number for results images is the width gets resized to 700px
		
console.log("page ready");
$('#error').empty();
		
		
function genLink (description, url) {
	return '<span class="link"><a href="' + url + '">' + description + '</a></span>';
}

function getFreshRssUrl(url){
	var googleGarbage = new Date().getTime();
	return url + '&googleGarbage=' + googleGarbage;
}

function genFeed (rawRss, blurb) {
	return { 
		rss: getFreshRssUrl(rawRss),
		blurb: blurb,
		success: false
	};
}

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

function genImage (url, count) {
	count = count ? count : 1;
	var px = 700/count;
	var data = "";
	for(var i = 0; i < count; i++)
	{
		data += '<img src="' + url + '" style=" width: ' + px + 'px; "/>';
	}
	return data;
}	

function genImageObj(url, count){
	var preloadedImage = new Image();
	preloadedImage.src = url;
	var imageObj = {
		url: url,
 		count: count,
		imgTag: genImage(url, count)
	};
	return imageObj;
}

var waitingImages = [
// 	genImageObj('http://i.imgur.com/Aio5V6d.png'), //ep16 this sucks
// 		genImageObj('http://i.imgur.com/uKlWv5U.png'), //ep02 mako dead
// 		genImageObj('http://i.imgur.com/87UTib6.png'), //ep13 ryuuko in bed
	genImageObj('http://i.imgur.com/OyMOAhq.gif', 3), //ep16 mako sleeping in chair
	genImageObj('http://i.imgur.com/wgDoGZ1.gif', 3) //ep14 mako sad w/ stick
];	
var successImages = [
// 		genImageObj('http://i.imgur.com/JocUhFU.png'), //ep02 nosebleed
// 		genImageObj('http://i.imgur.com/o5eteZt.png'), //ep02 confident smile
	genImageObj('http://i.imgur.com/pTX2Bz4.png') //ed2 mako + elephant
];

function getParam ( sname ) {
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
}

function getRandomImage (images) {		
	var index = Math.floor(Math.random()*images.length);
	return images[index];
}

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
		
		feedToSet.success = success;
		
		//loop!
		checkRSS(feeds.slice(1), callback, failureHandler);
	};
	
	var param = getParam("rssoff");	
	if(param === "true")
	{
		checkum(null);
		return;
  	}

	var urlToQuery = feedToSet.rss;
	
	$.jQRSS(urlToQuery, { count: 100 }, checkum);
}

function forceSetAllFeeds(success){
	for(var i = 0; i < allFeeds.length; i++){
		allFeeds[i].success = success;
	}
}

function updateContent () {

	var answer = $('#answerText');
	var followup = $('#followup');
	var imageHolder = $('#image');
	var mako = $('.mako');	

	//leave this in for debugging stuff	
	var param = getParam("saved");	
	if(param === "true"){ forceSetAllFeeds(true); }
	if(param === "false"){ forceSetAllFeeds(false); }
	//end debugging
	
	var isSaved = false;
	followup.empty();
	for(var i = 0; i < allFeeds.length; i++){
		var feed = allFeeds[i];
		if(feed.success){
			if(isSaved){
				followup.append(lineBreak);
			}
			isSaved = true;
			followup.append(allFeeds[i].blurb);
		}
	}
	
	if(isSaved) {			
		answer.html('YES');
		imageHolder.html(getRandomImage(successImages).imgTag);
		mako.show();
	}
	else{
		answer.html('not yet :<');
		imageHolder.html(getRandomImage(waitingImages).imgTag);
	}
}

function showSaved () {
	var contentDiv = $('#content');
	contentDiv.fadeOut(500, function(){
		updateContent();
		contentDiv.fadeIn();
	});
}

function rssFailed () {
	$('#answerText').html('rss lookup failed');
	$('#error').html('Try refreshing! If the problem persists, please contact hasanimebeensavedthisweek@gmail.com');
}

//main func

function animeSecrets () {
	checkRSS(allFeeds, showSaved, rssFailed);	
}

console.log("js loaded");
$(document).on("ready", animeSecrets);
