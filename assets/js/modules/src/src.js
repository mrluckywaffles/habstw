; (function(module){

	var _tools = anime.module('tools');
  
	var moduleName = 'src_jojo';

	var paramSrc = _tools.getParam('show');
	_tools.askForSuggestions = true;
	if(paramSrc && paramSrc.length > 0){
		moduleName = 'src_' + paramSrc;
		_tools.askForSuggestions = false;
	}
		
	anime.module.set(module.moduleName, moduleName);

})(anime.module('src'));
