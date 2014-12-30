; (function(module){
	
	var _tools = anime.module('tools');
	
	module.savedForever = false;
	
	module.name = 'Parasyte';
	
	anime.module('src_links').addSource(module.name, 'parasyte');

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'assets/psycho/feelsgoodright.png';
	images.rightAnswerBookend = 'assets/psycho/feelsgoodleft.png';
	images.waiting = [
		'assets/psycho/akanedang.jpg'
	];	
	images.success = [
		'assets/psycho/akanegrin.jpg'
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = 'soon...';
	text.waitingFollowup = "";
	
	music.tracks = [
		'assets/psycho/out-of-control.mp3',
		'assets/psycho/01-02.mp3'
	];

	text.subtitle;
	
	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=psycho+pass+720p',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&user=64513&term=psycho+pass'
		),
		_tools.rawFeed(
			'COMMIE',
			'http://www.nyaa.se/?page=rss&user=76430&term=psycho+pass',
			'http://commiesubs.com/category/psycho-pass/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&user=76430&term=psycho+pass'
		)
	];	
	
	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;
	
})(anime.module('src_psycho'));
