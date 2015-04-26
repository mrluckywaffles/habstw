; (function(module){

	var _tools = anime.module('tools');
	
	module.savedForever = false;
	
	module.name = 'Arslan';
	module.code = 'arslan';
	
	anime.module('src_links').addSource(module);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'assets/image/bob_ryuko.gif'; //bobbing ryuko
	images.leftAnswerBookend = '';
	images.rightAnswerBookend = '';
	var prefix = _tools.addPrefix(module.code);
	images.waiting = [
		'palace.jpg'
	].map(prefix);
	images.success = images.waiting;
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back later this week";

	music.tracks = [
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=Arslan',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&user=64513&term=Arslan'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_arslan'));
