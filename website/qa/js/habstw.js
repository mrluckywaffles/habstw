//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//rss=false (checked in feeds.js)

$('#error').empty();

var _tools = _tools || anime.module('tools');
var _images = _images || anime.module('images');
var _feeds = _feeds || anime.module('feeds');
var _music = _music || anime.module('music');

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
		answer.html('not yet :<');
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

	if(changed) {
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

function animeSecrets () {

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
	setInterval(fetchContent, 30000);	
}

$(document).on("ready", animeSecrets);
