; 

(function(module){
	
	var original = window.console;
	
	var emptyLog = function(){};
	var realLog = function(){
		original.log.apply(original, arguments);
	};
	
	module.shouldLog = function(shouldLog){
		if(shouldLog){
			module.log = realLog;
		} else {
			module.log = emptyLog;
		}
		return shouldLog;
	};
	
	module.shouldLog(document.URL.indexOf("qatest") > -1);
	
})(anime.module('tools'));