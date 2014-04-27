; (function(module){

	var _tools = anime.module('tools');
  
	var moduleName = 'src_pingpong';

	var paramSrc = _tools.getParam('show');
	if(paramSrc && paramSrc.length > 0){
		moduleName = 'src_' + paramSrc;
	}
	
	anime.module.set(module.moduleName, moduleName);

})(anime.module('src'));
