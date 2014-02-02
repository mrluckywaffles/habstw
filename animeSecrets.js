//diff args you can use to debug/view different pages:
//saved=true
//saved=false
//jsoff=true
//rssoff=true

function getParam ( sname ) {
	var params = location.search.substr(location.search.indexOf("?")+1);
	var sval = "";
	params = params.split("&");
	// split param and value into individual pieces
	for (var i=0; i<params.length; i++)
	{
		temp = params[i].split("=");
		if ( [temp[0]] == sname ) { sval = temp[1]; }
	}
	return sval;
}

function genImage (url, count) {
	count = count ? count : 1;
	var data = "";
	for(var i = 0; i < count; i++)
	{
		data += '<img src="' + url + '" />';
	}
	return data;
};	
			
function genLink (description, url) {
	return '<span class="link"><a href="' + url + '">' + description + '</a></span>';
};

function getRandomImage (images) {		
	var index = Math.floor(Math.random()*images.length);
	return images[index];
};

function checkRSS(callback, failureHandler) {
		
	var checkum = function (data){
		var success = false;
// 		console.log(data);		

		if(!data){
// 			console.log('shits null');
			failureHandler();
			return;
		}
		
		var curr = new Date; // get current date
		var first = curr.getDate() - curr.getDay(); // should return most recent monday
		var lastMonday = new Date(curr.setDate(first)); // it returns the time of day so its only kinda an approx but whatevs
		
		for(var i = 0; i < data.entries.length; i++){
			var latestUpload = data.entries[i];			
			var latestDate = new Date(latestUpload['publishedDate']);
			success = success || lastMonday < latestDate;				
		}
		
		callback(success);
	};
	
	var param = getParam("rssoff");	
	if(param === "true")
	{
		checkum(null);
		return;
  	}

	var underwaterRss = 'http://www.nyaa.se/?page=rss&user=265&term=Kill+la+Kill';
	var googleGarbage = new Date().getTime();
	var urlToQuery = underwaterRss + '&googleGarbage=' + googleGarbage;
	
	$.jQRSS(urlToQuery, { count: 100 }, checkum);
}

function showSaved (isSaved) {

	//leave this in for debugging stuff	
	var param = getParam("saved");	
	if(param === "true"){ isSaved = true; }
	if(param === "false"){ isSaved = false; }
	//end debugging
	
	var lineBreak = '<br/>';
	var answer = $('#answerText');
	var followup = $('#followup');
	var imageHolder = $('#image');
	var mako = $('.mako');		
	var waitingImages = [
		genImage('http://i.imgur.com/Aio5V6d.png'), //ep16 this sucks
		genImage('http://i.imgur.com/uKlWv5U.png'), //ep02 mako dead
		genImage('http://i.imgur.com/87UTib6.png'), //ep13 ryuuko in bed
		genImage('http://i.imgur.com/OyMOAhq.gif', 3) //ep16 mako sleeping in chair
		];	
	var successImages = [
		genImage('http://i.imgur.com/JocUhFU.png'), //ep02 nosebleed
		genImage('http://i.imgur.com/o5eteZt.png'), //ep02 confident smile
		genImage('http://i.imgur.com/pTX2Bz4.png') //ed2 mako + elephant
		];
		
	var underwaterBlurb = 
		'PRAISE BE TO UNDERWATER'
		+ lineBreak
		+ genLink('blog', 'http://underwater.nyaatorrents.org/?tag=KILL%20la%20KILL')
		+ ' '
		+ genLink('nyaa', 'http://www.nyaa.se/?page=search&cats=0_0&filter=0&term=kill+la+kill&user=265')
		;
	
	if(isSaved) {			
		answer.html('YES');
		followup.html(underwaterBlurb);
		imageHolder.html(getRandomImage(successImages));
		mako.show();
	}
	else{
		answer.html('not yet :<');
		imageHolder.html(getRandomImage(waitingImages));
	}
};

function rssFailed () {
	$('#answerText').html('rss lookup failed');
	$('#error').html('If the problem persists, please contact hasanimebeensavedthisweek@gmail.com');
}

//main func

function animeSecrets () {
	
	var param = getParam("jsoff");	
	if(param === "true") { return; }

	$('#error').empty();

	var isSaved = checkRSS(showSaved, rssFailed);
	
}