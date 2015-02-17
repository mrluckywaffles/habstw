; (function(module){

	var _tools = anime.module('tools');
	var _links = anime.module('src_links');
	
	var isIndex = true;  
	var showCode = _links.getRandomAiring().code;
	var paramSrc = _tools.getParam('show');
	if(paramSrc && paramSrc.length > 0){
		showCode = paramSrc;
		isIndex = false;
	}
		
	anime.module.set(module.moduleName, 'src_' + showCode);
	
	var src = anime.module(module.moduleName);

	var paramSaved = _tools.getParam('saved');
	if(paramSaved){
		src.savedForever = true;
	}
	
	_tools.isIndex = isIndex;
	_tools.askForSuggestions = isIndex && src.savedForever;

})(anime.module('src'));
