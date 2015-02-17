; (function(module){

	var _tools = anime.module('tools');
	
	module.savedForever = false;
	
	module.name = 'Death Parade';
	module.code = 'death_parade';
	
	anime.module('src_links').addSource(module);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = '';
	images.rightAnswerBookend = '';
	images.waiting = [
		'assets/death_parade/op_point.jpg'
	];
	images.success = [
		'assets/death_parade/decim_bow.jpg'
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Friday afternoon";

	music.tracks = [
		'assets/death_parade/op.mp3',
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=death+parade',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=death+parade&user=64513'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_death_parade'));
