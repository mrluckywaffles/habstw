//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//rssoff=true

//magic number for results images is the width gets resized to 700px

$('#error').empty();

var _images = anime.module('images');
		
		
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
		imageHolder.html(_images.getSuccess());
		mako.show();
	}
	else{
		answer.html('not yet :<');
		imageHolder.html(_images.getWaiting());
	}
	
	//last ditch effort to try and make music work
	refreshMusic();
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

var paused = false;
var song = 0;
var tracks = [
	'http://k007.kiwi6.com/hotlink/pu6o4nwuzf',		//06
	'http://k007.kiwi6.com/hotlink/q306ya962v',		//04
	'http://k007.kiwi6.com/hotlink/c71c6yjfn4'		//14
]
var audios = [];
var music = function(){
	return audios[song];
}


function saveCookies(){
	setCookie('song', song, 7);
	setCookie('paused', paused, 7);
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
	var c_song = getCookie('song');
	if(c_song){
		song = parseInt(c_song);
	} //else 0
	var c_paused = getCookie('paused');
	if(c_paused){
		if(c_paused == "true"){
			$('#pause').trigger('click');
		} else {
			setMusicAsPaused(false);
		}
	}
}

//main func

function animeSecrets () {

	for(var i = 0; i < tracks.length; i++){
		audios[i] = document.createElement('audio');
		audios[i].setAttribute('src', tracks[i]);
		audios[i].setAttribute('preload', true);
		audios[i].setAttribute('loop', true);
		audios[i].pause();
	}

	$('.toggleInfo').click(function(){
		$('.info').toggleClass('show');
	});
	$('.toggleMusic').click(function(){
		$('.music').toggleClass('show');
	});
	$('.next').click(nextSong);
	$('#play').click(function (){
		setMusicAsPaused(false);
	});
	$('#pause').click(function (){
		setMusicAsPaused(true);
	});

	loadCookies();
	checkRSS(allFeeds, showSaved, rssFailed);	
}

$(document).on("ready", animeSecrets);