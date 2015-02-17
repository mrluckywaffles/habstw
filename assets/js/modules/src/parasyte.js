; (function(module){
	
	var _tools = anime.module('tools');
	
	module.savedForever = false;
	
	module.name = 'Parasyte';
	module.code = 'parasyte';
	
	anime.module('src_links').addSource(module);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'assets/parasyte/thumbs_up.png';
	images.rightAnswerBookend = 'assets/parasyte/thumbs_up.png';
	images.waiting = [
		'assets/parasyte/migi_sup.png'
	];	
	images.success = [
		'assets/parasyte/happy_chin.png'
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = 'not yet...';
	text.waitingFollowup = 'check back Wednesday afternoon';
	
	music.tracks = [
		'assets/parasyte/op_tv.mp3'
	];

	text.subtitle;
	
	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=parasyte+720p',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&user=64513&term=parasyte'
		),
	];	
	
	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;
	
})(anime.module('src_parasyte'));
