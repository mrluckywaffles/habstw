; (function(module){

	var _tools = anime.module('tools');
	
	var isIndex = true;  
	var valueModuleName = 'src_jojo';
	var paramSrc = _tools.getParam('show');
	if(paramSrc && paramSrc.length > 0){
		valueModuleName = 'src_' + paramSrc;
		isIndex = false;
	}
		
	anime.module.set(module.moduleName, valueModuleName);
	
	var src = anime.module(module.moduleName);
	
	_tools.askForSuggestions = isIndex && src.savedForever;

})(anime.module('src'));
