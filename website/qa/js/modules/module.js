var anime = anime || {};

anime.module = function () {
    
    var modules = {};

    var mod = function(name) {
        
        if (modules[name])
        {
            return modules[name];
        }
        
        return modules[name] = {};
    };

    mod.exists = function(name){
        return !!modules[name];
    };

    // unit testing purposes only
    mod._delete = function(name){
        delete modules[name];
    };

    return mod;
}();