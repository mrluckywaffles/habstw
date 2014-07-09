;

(function($) {
    if (!$.jQRSS) { 
    	var _tools = anime.module('tools');
    	
        $.extend({  
            jQRSS: function(rss, options, func) {
                if (arguments.length <= 0) return false;

                var str, obj, fun;
                for (i=0;i<arguments.length;i++) {
                    switch(typeof arguments[i]) {
                        case "string":
                            str = arguments[i];
                            break;
                        case "object":
                            obj = arguments[i];
                            break;
                        case "function":
                            fun = arguments[i];
                            break;
                    }
                }

                if (str == null || str == "") {
                    if (!obj['rss']) return false;
                    if (obj.rss == null || obj.rss == "") return false;
                }

                var o = $.extend(true, {}, $.jQRSS.defaults);

                if (typeof obj == "object") {
                    if ($.jQRSS.methods.getObjLength(obj) > 0) {
                        o = $.extend(true, o, obj);
                    }
                }

                if (str != "" && !o.rss) o.rss = str;
                o.rss = escape(o.rss);

                var gURL = $.jQRSS.props.gURL 
                    + $.jQRSS.props.type 
                    + "?v=" + $.jQRSS.props.ver
                    + "&q=" + o.rss
                    + "&callback=" + $.jQRSS.props.callback;

                var ajaxData = {
                        num: o.count,
                        output: o.output,
                    };

                if (o.historical) ajaxData.scoring = $.jQRSS.props.scoring;
                if (o.userip != null) ajaxData.scoring = o.userip;

                $.ajax({
                    url: gURL,
                    beforeSend: function (jqXHR, settings) {
						_tools.log(new Array(30).join('-'), "REQUESTING RSS XML", new Array(30).join('-'));
						_tools.log({ ajaxData: ajaxData, ajaxRequest: settings.url, jqXHR: jqXHR, settings: settings, options: o }); 
						_tools.log(new Array(80).join('-')); 
                    },
                    dataType: o.output != "xml" ? "json" : "xml",
                    data: ajaxData,
                    type: "GET",
                    xhrFields: { withCredentials: true },
                    error: function (jqXHR, textStatus, errorThrown) { return new Array("ERROR", { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown } ); },
                    success: function (data, textStatus, jqXHR) {  
                        var f = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : null : null,
                            e = data['responseData'] ? data.responseData['feed'] ? data.responseData.feed['entries'] ? data.responseData.feed.entries : null : null : null
                        _tools.log(new Array(30).join('-'), "SUCCESS", new Array(30).join('-'));
						_tools.log({ data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e });
						_tools.log(new Array(70).join('-'));
						if (fun) {
                            return fun.call(this, data['responseData'] ? data.responseData['feed'] ? data.responseData.feed : data.responseData : null);
                        }
                        else {
                            return { data: data, textStatus: textStatus, jqXHR: jqXHR, feed: f, entries: e };
                        }
                    }
                });
            }
        });
        $.jQRSS.props = {
            callback: "?",
            gURL: "http://ajax.googleapis.com/ajax/services/feed/",
            scoring: "h",
            type: "load",
            ver: "1.0"
        };
        $.jQRSS.methods = {
            getObjLength: function(obj) {
                if (typeof obj != "object") return -1;
                var objLength = 0;
                $.each(obj, function(k, v) { objLength++; })
                return objLength;
            }
        };
        $.jQRSS.defaults = {
            count: "10", // max 100, -1 defaults 100
            historical: false,
            output: "json", // json, json_xml, xml
            rss: null,  //  url OR search term like "Official Google Blog"
            userip: null
        };
    }
})(jQuery);
