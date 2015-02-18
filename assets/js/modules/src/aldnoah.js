; (function(module){

	var _tools = anime.module('tools');
	
	module.savedForever = false;
	
	module.name = 'Aldnoah Zero';
	module.code = 'aldnoah';
	
	anime.module('src_links').addSource(module);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = '';
	images.rightAnswerBookend = '';
	images.waiting = [
		'assets/aldnoah/morwell.jpg'
	];
	images.success = [
		'assets/aldnoah/morwell.jpg'
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Saturday around noon";

	music.tracks = [
		'assets/aldnoah/mad_aliez.mp3',
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=aldnoah',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=aldnoah&user=64513'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_aldnoah'));
