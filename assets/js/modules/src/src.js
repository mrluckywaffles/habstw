; (function(module){

	var _tools = anime.module('tools');
	
	var isIndex = true;  
	var valueModuleName = 'src_parasyte';
	var paramSrc = _tools.getParam('show');
	if(paramSrc && paramSrc.length > 0){
		valueModuleName = 'src_' + paramSrc;
		isIndex = false;
	}
		
	anime.module.set(module.moduleName, valueModuleName);
	
	var src = anime.module(module.moduleName);

	var paramSaved = _tools.getParam('saved');
	if(paramSaved){
		src.savedForever = true;
	}
	
	_tools.askForSuggestions = isIndex && src.savedForever;

})(anime.module('src'));
