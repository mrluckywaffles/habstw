; (function(module){

	var _tools = anime.module('tools');

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/AVyg9Kc.png'; //paddle
	images.leftAnswerBookend = 'http://i.imgur.com/AVyg9Kc.png'; //paddle
	images.rightAnswerBookend = 'http://i.imgur.com/AVyg9Kc.png'; //paddle
	images.waiting = [
		'http://i.imgur.com/is6DD70.jpg'	//peco smiling
	];
	images.success = [
		'http://i.imgur.com/Ou3vNV0.jpg'  //peco promo
	];
	images.defaultMainImageTag = '<img src="http://i.imgur.com/Ou3vNV0.jpg" style="width: 700px;">';
		//peco promo
	
	text.waiting = "come back Thursday";

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/nfm5mn7deb'		//ur the best
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=Ping+Pong',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=Ping+Pong&user=64513'
		),
		_tools.rawFeed(
			'COMMIE',
			'http://www.nyaa.se/?page=rss&user=76430&term=Ping+Pong',
			'http://commiesubs.com/category/jojo/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=Ping+Pong&user=76430'
		),
		_tools.rawFeed(
			'Puya (Spanish)',
			'http://www.nyaa.se/?page=rss&user=239789&term=Ping+Pong',
			'http://www.puya-subs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=Ping+Pong&user=239789'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_pingpong'));
