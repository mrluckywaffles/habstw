//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//rss=false (checked in feeds.js)

var _tools = _tools || anime.module('tools');
var _images = _images || anime.module('images');
var _feeds = _feeds || anime.module('feeds');
var _music = _music || anime.module('music');
var _src = _src || anime.module('src');
var _links = _links || anime.module("src_links")

var lineBreak = '<br/>';
var emailRaw = 'hasanimebeensavedthisweek@gmail.com';
var emailHtml = '<a href="mailto:' + emailRaw
	 + '?subject=Show Suggestion">' + emailRaw + '</a>';
var pageBreak = lineBreak+lineBreak+lineBreak
	+lineBreak+lineBreak+lineBreak+lineBreak+lineBreak
	+lineBreak+lineBreak+lineBreak+lineBreak+lineBreak;

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

	imageHolder.empty();
	var imgUrl;
	
	if(isSaved) {	
		var bookends = _images.getAnswerBookends();
 		$('#leftAnswerBookend').html(bookends[0]);		
		answer.html('YES');
 		$('#rightAnswerBookend').html(bookends[1]);
		if(_src.text.subtitle) {
			followup.prepend('<b>' + _src.text.subtitle + '</b>' + lineBreak + lineBreak)
		}
		imgUrl = _images.getSuccess();
	}
	else{
		answer.html(_src.text.waiting);
		followup.html(lineBreak + _src.text.waitingFollowup + lineBreak);
		imgUrl = _images.getWaiting();
	}

	if(_links.isRandomFrontPage() && _tools.isIndex){
		followup.append(lineBreak + 'wanna only see this show? save this permalink for ' + _links.permalink(_src));
	}

	$('body').css('background-image','url("' + imgUrl + '")');
		
	if(_tools.askForSuggestions){
		$('#image-followup').html(pageBreak
			+ 'This season\'s just about over! Any suggestions for what this site should track next?'
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
	);
}

//main func

function fetchContent(){
	if(timesChecked > 0){
		$('.reloading-rss').fadeIn(500);
	}
	
	_feeds.checkFeeds(showSaved, rssFailed);
	
	return !_src.savedForever && (_src.feeds.feeds.length > 0);
}

function addLinks(){
	var links = $('#permalinks');
	links.append("Permalinks:" + lineBreak);
	var urls = _links.getSources();
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
