var anime = anime || {};

anime.module = function () {
    
    var modules = {};

    var mod = function(name) {
        
        if (modules[name])
        {
            return modules[name];
        }
        
        return modules[name] = { moduleName: name };
    };

    mod.exists = function(name){
        return !!modules[name];
    };
	
	mod.set = function(dest, src){
		modules[dest] = mod(src);
	};
	
    mod._delete = function(name){
        delete modules[name];
    };

    return mod;
}();
