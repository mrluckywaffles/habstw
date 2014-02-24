;

var src = anime.module('src').music;

(function(module){
		
	var paused = false;
	var song = 0;
	var tracks = src.tracks;
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
			song = parseInt(c_song) % tracks.length;
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