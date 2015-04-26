(function(module){

	module.addPrefix = function(dir){
		var func = function(filename){
			return 'assets/' + dir + '/' + filename;
		};
		return func;
	}; 

})(anime.module('tools'));
