//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//rssoff=true

//magic number for results images is the width gets resized to 700px

$('#error').empty();

var _images = anime.module('images');
var _feeds = anime.module('feeds');
var _music = anime.module('music');

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

var lineBreak = '<br/>';
function updateContent () {

	var answer = $('#answerText');
	var followup = $('#followup');
	var imageHolder = $('#image');	

	//leave this in for debugging stuff	
	var param = getParam("saved");	
	if(param === "true"){ _feeds.forceSetAllFeeds(true); }
	if(param === "false"){ _feeds.forceSetAllFeeds(false); }
	//end debugging
	
	var isSaved = false;
	followup.empty();
	var allFeeds = _feeds.getFeeds();
	for(var i = 0; i < allFeeds.length; i++){
		var feed = allFeeds[i];
		if(feed.success){
			if(isSaved){
				followup.append(lineBreak);
			}
			isSaved = true;
			followup.append(allFeeds[i].html);
		}
	}
	
	if(isSaved) {	
 		$('#leftAnswerBookend').html(
 		'<img class="answerBookends" src="http://i.imgur.com/HNR6h13.png"></img>'
 		);		
		answer.html('YES');
 		$('#rightAnswerBookend').html(
 		'<img class="answerBookends" src="http://i.imgur.com/ShLuqus.png"></img>'
 		);
		imageHolder.html(_images.getSuccess());
	}
	else{
		answer.html('not yet :<');
		imageHolder.html(_images.getWaiting());
	}
	
	//last ditch effort to try and make music work
	_music.refresh();
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

	checkRSS(_feeds.getFeeds(), showSaved, rssFailed);	
}

$(document).on("ready", animeSecrets);