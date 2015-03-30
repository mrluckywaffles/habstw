; (function(module){

	var _tools = anime.module('tools');
	
	module.savedForever = true;
	
	module.name = 'Yatterman';
	module.code = 'yatterman';
	
	anime.module('src_links').addSource(module);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = '';
	images.rightAnswerBookend = '';
	images.waiting = [
		'assets/yatterman/crying.jpg',
		'assets/yatterman/moon.jpg'
	];
	images.success = [
		'assets/yatterman/mask.jpg',
		'assets/yatterman/team_looking_right.jpg',
		'assets/yatterman/oda.jpg'
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Sunday morning";

	music.tracks = [
		'assets/yatterman/yatta.mp3',
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=yatterman',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=yatterman&user=64513'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_yatterman'));
