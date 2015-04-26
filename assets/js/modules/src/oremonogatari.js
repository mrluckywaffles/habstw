; (function(module){

	var _tools = anime.module('tools');
	
	module.savedForever = false;
	
	module.name = 'Ore Monogatari';
	module.code = 'oremonogatari';
	
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
		'blush_pout.jpg',
		'black.jpg',
		'kingkong.jpg',
		'ogre.jpg',
		'op_faces.jpg'
	].map(prefix);
	images.success = images.waiting;
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Wednesday afternoon";

	music.tracks = [
		'assets/oremonogatari/op_tv.mp3',
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=Ore%20Monogatari',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&user=64513&term=Ore%20Monogatari'
		)
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_oremonogatari'));
