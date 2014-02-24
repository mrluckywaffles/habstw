; (function(module){
		
	var paused = false;
	var song = 0;
	var tracks = [
		'http://k007.kiwi6.com/hotlink/pu6o4nwuzf',		//06
		'http://k007.kiwi6.com/hotlink/q306ya962v',		//04
		'http://k007.kiwi6.com/hotlink/c71c6yjfn4'		//14
	]
	var audios = [];
	var music = function(){
		return audios[song];
	}
	var _selectors;

	function saveCookies(){
		setCookie('song', song, 7);
		setCookie('paused', paused, 7);
	}
	function incSong(){
		song = (song + 1) % tracks.length;
		saveCookies();	
	}
	function refreshMusic(){
		if(paused){
			music().pause();
		} else {
			music().play();
		}
	}
	function setMusicAsPaused(pause){
		paused = pause;
		refreshMusic();
		saveCookies();
	}
	function nextSong(){
		if(!paused){
			music().pause();
			incSong();
			music().currentTime=0;
			music().play();
		}
	}
	function loadCookies(){
		var c_song = getCookie('song');
		if(c_song){
			song = parseInt(c_song);
		} //else 0
		var c_paused = getCookie('paused');
		if(c_paused){
			if(c_paused == "true"){
				$(_selectors.pause).trigger('click');
			} else {
				setMusicAsPaused(false);
			}
		}
	}
	
	module.init = function(selectors){	
		for(var i = 0; i < tracks.length; i++){
			audios[i] = document.createElement('audio');
			audios[i].setAttribute('src', tracks[i]);
			audios[i].setAttribute('preload', true);
			audios[i].setAttribute('loop', true);
			audios[i].pause();
		}

		_selectors = selectors;
		$(_selectors.play).click(function (){
			setMusicAsPaused(false);
		});
		$(_selectors.pause).click(function (){
			setMusicAsPaused(true);
		});
		$(_selectors.next).click(nextSong);

		loadCookies();
	};
	
	module.refresh = refreshMusic;
	
})(anime.module('music'));