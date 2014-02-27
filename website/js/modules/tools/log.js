; 

(function(module){
	
	var original = window.console;
	
	var emptyLog = function(){};
	var realLog = function(){
		original.log.apply(original, arguments);
	};
	
	module.shouldLog = function(shouldLog){
		console.log('logging: ' + shouldLog);
		if(shouldLog){
			module.log = realLog;
		} else {
			module.log = emptyLog;
		}
		return shouldLog;
	};
	
	module.shouldLog(false);
	
})(anime.module('tools'));