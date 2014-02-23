
var positiveSpeeds=[10,6,4,3,2,1,0.6,0.3,0.2,0.1,0.05,0.01];var speeds=[0];for(var i=0;i<positiveSpeeds.length;i++){speeds.unshift(positiveSpeeds[i]);speeds.push(positiveSpeeds[i]);}
var index=parseInt((speeds.length/2));var music;function updateSpeed(){var secs=speeds[index];var reverse=(index<speeds.length/2)?' reverse':'';$('.catbox').html('<img class="catoi"'
+' src="http://i.imgur.com/DUNm8LB.png"'
+' style="'
+' -webkit-animation:'+secs+'s spin linear infinite'+reverse+';'
+' -moz-animation:'+secs+'s spin linear infinite'+reverse+';'
+' animation:'+secs+'s spin linear infinite'+reverse+';'
+'">');$('#speed').html(secs);}
function changeIndex(delta){var newIndex=index+delta;if(newIndex>=0&&newIndex<speeds.length){index=newIndex;updateSpeed();if(speeds[index]==speeds[0]){$('#dontLoseYourWay').addClass('show');music.play();}else{$('#dontLoseYourWay').removeClass('show');music.pause();music.currentTime=63.5;}}}
$(document).ready(function(){window.onkeydown=function(e){var code=e.keyCode?e.keyCode:e.which;if(code===37){changeIndex(-1);}else if(code===39){changeIndex(1);}};music=document.getElementById('sound');updateSpeed();});