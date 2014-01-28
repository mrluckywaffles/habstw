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

function genImage (url) {
	return '<img src="' + url + '" />';
};	
			
function genLink (description, url) {
	return '<span class="link"><a href="' + url + '">' + description + '</a></span>';
};

function genRandomImage (images) {		
	var index = Math.floor(Math.random()*images.length);
	return genImage(images[index]);
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

	var rssUrl = 'http://www.nyaa.se/?page=rss&user=265&term=Kill+la+Kill';
	
	$.jQRSS(rssUrl, { count: 100 }, checkum);
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
	var waitingImages = ['http://i.imgur.com/kXVbjxj.png',
		'http://i.imgur.com/uKlWv5U.png',
		'http://i.imgur.com/87UTib6.png'];	
	var successImages = ['http://i.imgur.com/JocUhFU.png',
		'http://i.imgur.com/o5eteZt.png'];
		
	var underwaterLink = genLink('PRAISE BE TO UNDERWATER', 'http://underwater.nyaatorrents.org/?tag=KILL%20la%20KILL');
	
	if(isSaved) {			
		answer.html('YES');
		followup.html(underwaterLink);
		imageHolder.html(genRandomImage(successImages));
		mako.show();
	}
	else{
		answer.html('not yet :<');
		imageHolder.html(genRandomImage(waitingImages));
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