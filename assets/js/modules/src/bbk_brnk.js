; (function(module){

	var _tools = anime.module('tools');

	module.savedForever = false;

	module.name = 'Bubuki Buranki';
	module.code = 'bbk_brnk';

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
		'looking.jpg',
	].map(prefix);
	images.success = [
		'grin.jpg',
	].map(prefix);
	images.defaultMainImageTag = 'refresh pls';

	text.waiting = "not yet...";
	text.waitingFollowup = "check back later this week";

	music.tracks = [
		'op_full.mp3',
	].map(prefix);

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=buranki',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&user=64513&term=buranki'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_bbk_brnk'));
