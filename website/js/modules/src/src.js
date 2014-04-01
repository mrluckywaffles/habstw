; (function(module){

	var _tools = anime.module('tools');
  
	var moduleName = 'src_jojo';
  
	var paramSrc = _tools.getParam('src');
	if(paramSrc && paramSrc.length > 0){
		moduleName = 'src_' + paramSrc;
	}
	
	anime.module.set(module.moduleName, moduleName);

})(anime.module('src'));
