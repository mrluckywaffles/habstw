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
var emailRaw = 'hasanimebeensavedthisweek@gmail.com';
var emailHtml = '<a href="mailto:' + emailRaw
	 + '?subject=Show Suggestion">' + emailRaw + '</a>';

function updateContent (checkedFeeds) {

	var answer = $('#answerText');
	var followup = $('#followup');
	var imageHolder = $('#image');
	
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
		
	if(_tools.askForSuggestions){
		$('#image-followup').html(lineBreak
			+ _src.name	+ ' has ended! Any suggestions for what this site should track next season?'
			+ lineBreak	+ 'Send them to ' + emailHtml
		);
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
	$('#answerText').html('something went wrong D:');
	$('#error').html(
		'Try refreshing! If the problem persists, please contact ' + emailRaw
		+ lineBreak + '<b>EDIT (9/1/14)</b> nyaa.eu is currently down: http://www.downforeveryoneorjustme.com/nyaa.eu'
		+ lineBreak + 'Check https://twitter.com/HorribleSubs for more info'
	);
}

//main func

function fetchContent(){
	if(timesChecked > 0){
		$('.reloading-rss').fadeIn(500);
	}
	
	_feeds.checkFeeds(showSaved, rssFailed);
	
	return !_tools.savedForever && (_src.feeds.feeds.length > 0);
}

function addLinks(){
	var links = $('#permalinks');
	links.append("Permalinks:" + lineBreak);
	var urls = anime.module("src_links").getSources();
	urls.forEach(function (u){
		links.append(u + lineBreak);
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

	var shouldRefresh = fetchContent();
	if(shouldRefresh){
		setInterval(fetchContent, 30000);	
	}
	
	addLinks();
}
