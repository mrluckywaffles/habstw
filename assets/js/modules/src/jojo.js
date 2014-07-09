; (function(module){

	var _tools = anime.module('tools');
	
	anime.module('src_links').addSource('JoJo', 'jojo', false);

	var images = {};
	var music = {};
	var feeds = {};
	var text = {};

	images.loadingRss = 'http://i.imgur.com/QzEuoVY.gif'; //dio stand punching
	images.leftAnswerBookend = 'http://i.imgur.com/CpXcYP4.gif'; //dio standing
	images.rightAnswerBookend = 'http://i.imgur.com/vbsR9w0.gif'; //jotaro win
	images.waiting = [
		'http://i.imgur.com/Il557U0.png'	//dio vs jotaro art
	];
	images.success = [
		'http://i.imgur.com/QFwkov1.gif'  //YES gif
	];
	images.defaultMainImageTag = '<img src="http://i.imgur.com/OfD6OXd.png" style="width: 700px;">';
		//jojo and dio face off
	
	text.waiting = "not yet...";
	text.waitingFollowup = "check back Friday afternoonish";

	music.tracks = [
		'http://k007.kiwi6.com/hotlink/uvtjht44cb',		//walk like an egyptian
		'http://k007.kiwi6.com/hotlink/10po8om1ml'		//roundabout
	];

	feeds.feeds = [
		_tools.rawFeed(
			'HORRIBLE',
			'http://www.nyaa.se/?page=rss&user=64513&term=JoJo',
			'http://horriblesubs.info/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=JoJo&user=64513'
		)/*,
		_tools.rawFeed(
			'COMMIE',
			'http://www.nyaa.se/?page=rss&user=76430&term=JoJo',
			'http://commiesubs.com/category/jojo/',
			'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=JoJo&user=76430'
		)*/
	];

	module.images = images;
	module.text = text;
	module.music = music;
	module.feeds = feeds;

})(anime.module('src_jojo'));
