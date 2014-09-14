; (function(module){
	
	var _tools = anime.module('tools');
	
	_tools.savedForever = true;
	
	anime.module('src_links').addSource('Kill la Kill', 'klk');

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'http://i.imgur.com/HNR6h13.png'; //mako face right
	images.rightAnswerBookend = 'http://i.imgur.com/ShLuqus.png'; //mako face left
	images.waiting = [
	// 	'http://i.imgur.com/Aio5V6d.png', //ep16 this sucks
	// 	'http://i.imgur.com/uKlWv5U.png', //ep02 mako dead
	// 	'http://i.imgur.com/87UTib6.png', //ep13 ryuuko in bed
		'http://i.imgur.com/OyMOAhq.gif', //ep16 mako sleeping in chair
		'http://i.imgur.com/wgDoGZ1.gif'  //ep14 mako sad w/ stick
	];	
	images.success = [
	// 	'http://i.imgur.com/JocUhFU.png', //ep02 nosebleed
	// 	'http://i.imgur.com/o5eteZt.png', //ep02 confident smile
		'http://i.imgur.com/pTX2Bz4.png'  //ED-2 mako + elephant
	];
	images.defaultMainImageTag = 'refresh pls';
	
	text.waiting = 'not yet :<';
	text.waitingFollowup = "";
	
	music.tracks = [
		'assets/music/klk-06.mp3',
		'assets/music/klk-04.mp3',
		'assets/music/klk-14.mp3'
	];
	
	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=Kill+la+Kill+720p',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=64513'
		),
		_tools.rawFeed(
			'UNDERWATER',
			'http://www.nyaa.se/?page=rss&user=265&term=Kill+la+Kill',
			'http://underwater.nyaatorrents.org/?tag=KILL%20la%20KILL',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=265'
		)
	];	
	
	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;
	
})(anime.module('src_klk'));
