; (function(module){

	var _tools = anime.module('tools');
  
  var moduleName = 'src_klk';
  
  var paramSrc = _tools.getParam('src');
  if(paramSrc && paramSrc.length > 0){
    moduleName = 'src_' + paramSrc;
  }

  module = anime.module(moduleName);

})(anime.module('src'));
