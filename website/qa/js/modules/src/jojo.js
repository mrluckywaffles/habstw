; (function(module){

	var _tools = anime.module('tools');

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/XsOXgn5.gif'; //bobbing ryuuko
	images.leftAnswerBookend = 'http://i.imgur.com/HNR6h13.png'; //mako face right
	images.rightAnswerBookend = 'http://i.imgur.com/ShLuqus.png'; //mako face left
	images.waiting = [
		'http://i.imgur.com/Il557U0.png'	//dio vs jotaro art
	];
	images.success = [
		'http://i.imgur.com/pTX2Bz4.png'  //ED-2 mako + elephant
	];
	images.defaultMainImageTag = '<img src="http://i.imgur.com/Il557U0.png" style="width: 700px;">';
	
	text.waiting = "soon...";

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/10po8om1ml'		//roundabout
	];

	feeds.feeds = [];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_jojo'));
