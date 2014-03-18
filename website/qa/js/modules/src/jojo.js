; (function(module){

	var _tools = anime.module('tools');

	var images = {};
	var music = {};
	var feeds = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'http://i.imgur.com/HNR6h13.png'; //mako face right
	images.rightAnswerBookend = 'http://i.imgur.com/ShLuqus.png'; //mako face left
	images.waiting = [
		'http://i.imgur.com/OyMOAhq.gif', //ep16 mako sleeping in chair
		'http://i.imgur.com/wgDoGZ1.gif'  //ep14 mako sad w/ stick
	];	
	images.success = [
		'http://i.imgur.com/pTX2Bz4.png'  //ED-2 mako + elephant
	];

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/pu6o4nwuzf',		//06
		'http://k007.kiwi6.com/hotlink/q306ya962v',		//04
		'http://k007.kiwi6.com/hotlink/c71c6yjfn4'		//14
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
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_jojo'));
