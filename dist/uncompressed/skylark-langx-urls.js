/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx-urls/urls',[
  "skylark-langx-ns"
],function(skylark){


    return skylark.attach("langx.urls",{

    });
});



define('skylark-langx-urls/create_object_url',[
    './urls'
], function (urls) {
    'use strict';

    const digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function createObjectURL(data, contentType, forceDataSchema = false) {
        if (!forceDataSchema && URL.createObjectURL) {
            const blob = new Blob([data], { type: contentType });
            return URL.createObjectURL(blob);
        }
        let buffer = `data:${ contentType };base64,`;
        for (let i = 0, ii = data.length; i < ii; i += 3) {
            const b1 = data[i] & 255;
            const b2 = data[i + 1] & 255;
            const b3 = data[i + 2] & 255;
            const d1 = b1 >> 2, d2 = (b1 & 3) << 4 | b2 >> 4;
            const d3 = i + 1 < ii ? (b2 & 15) << 2 | b3 >> 6 : 64;
            const d4 = i + 2 < ii ? b3 & 63 : 64;
            buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
        }
        return buffer;
    };


    return urls.createObjectURL = createObjectURL;

});


define('skylark-langx-urls/create_valid_absolute_url',[
    './urls'
], function (urls) {
    'use strict';

    function _isValidProtocol(url) {
        if (!url) {
            return false;
        }
        switch (url.protocol) {
        case 'http:':
        case 'https:':
        case 'ftp:':
        case 'mailto:':
        case 'tel:':
            return true;
        default:
            return false;
        }
    }
    function createValidAbsoluteUrl(url, baseUrl) {
        if (!url) {
            return null;
        }
        try {
            const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);
            if (_isValidProtocol(absoluteUrl)) {
                return absoluteUrl;
            }
        } catch (ex) {
        }
        return null;
    }

    return urls.createValidAbsoluteUrl = createValidAbsoluteUrl;

});


define('skylark-langx-urls/get-absolute-url',[
    './urls'
], function (urls) {
    'use strict';

    const getAbsoluteUrl = function (url) {
        if (!url.match(/^https?:\/\//)) {
            const div = document.createElement('div');
            div.innerHTML = `<a href="${ url }">x</a>`;
            url = div.firstChild.href;
        }
        return url;
    };

    return urls.getAbsoluteUrl = getAbsoluteUrl;

});
define('skylark-langx-urls/get-file-extension',[
    './urls'
], function (urls) {
    'use strict';

    const getFileExtension = function (path) {
        if (typeof path === 'string') {
            const splitPathRe = /^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/;
            const pathParts = splitPathRe.exec(path);
            if (pathParts) {
                return pathParts.pop().toLowerCase();
            }
        }
        return '';
    };

    return urls.getFileExtension = getFileExtension;

});
   define('skylark-langx-urls/get-file-name',[
    './urls'
], function (urls) {
    'use strict';

    function getFileName (url) {
        ///var fileName = url.split('/').pop() || "";
        ///return fileName;
        const anchor = url.indexOf('#');
        const query = url.indexOf('?');
        const end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
        return url.substring(url.lastIndexOf('/', end) + 1, end);         
    }




    return urls.getFileName = getFileName;

});
define('skylark-langx-urls/get-query',[
    './urls'
], function (urls) {
    'use strict';
	function getQuery(querystring) {
		var query = {};

		var pairs = querystring.split('&'),
		    length = pairs.length,
		    keyval = [],
		    i = 0;

		for (; i < length; i++) {
		  keyval = pairs[i].split('=', 2);
		  try {
		    keyval[0] = decodeURIComponent(keyval[0]); // key
		    keyval[1] = decodeURIComponent(keyval[1]); // value
		  } catch (e) {}

		  if (query[keyval[0]] === undefined) {
		    query[keyval[0]] = keyval[1];
		  } else {
		    query[keyval[0]] += ',' + keyval[1];
		  }
		}

		return query;
	}

	return urls.getQuery = getQuery;

});
define('skylark-langx-urls/parse-url',[
    './urls'
], function (urls) {
    'use strict';
    const parseUrl = function (url) {
        const props = [
            'protocol',
            'hostname',
            'port',
            'pathname',
            'search',
            'hash',
            'host'
        ];
        let a = document.createElement('a');
        a.href = url;
        const addToBody = a.host === '' && a.protocol !== 'file:';
        let div;
        if (addToBody) {
            div = document.createElement('div');
            div.innerHTML = `<a href="${ url }"></a>`;
            a = div.firstChild;
            div.setAttribute('style', 'display:none; position:absolute;');
            document.body.appendChild(div);
        }
        const details = {};
        for (let i = 0; i < props.length; i++) {
            details[props[i]] = a[props[i]];
        }
        if (details.protocol === 'http:') {
            details.host = details.host.replace(/:80$/, '');
        }
        if (details.protocol === 'https:') {
            details.host = details.host.replace(/:443$/, '');
        }
        if (!details.protocol) {
            details.protocol = window.location.protocol;
        }
        if (addToBody) {
            document.body.removeChild(div);
        }
        return details;
    };

    return urls.parseUrl = parseUrl;
});
define('skylark-langx-urls/is-cross-origin',[
    './urls',
    "./parse-url"
], function (urls,parseUrl) {
    'use strict';

    const isCrossOrigin = function (url, winLoc = window.location) {
        const urlInfo = parseUrl(url);
        const srcProtocol = urlInfo.protocol === ':' ? winLoc.protocol : urlInfo.protocol;
        const crossOrigin = srcProtocol + urlInfo.host !== winLoc.protocol + winLoc.host;
        return crossOrigin;
    };

    return urls.isCrossOrigin = isCrossOrigin;

});
define('skylark-langx-urls/is_same_origin',[
    './urls'
], function (urls) {
    'use strict';

    function isSameOrigin(baseUrl, otherUrl) {
        let base;
        try {
            base = new URL(baseUrl);
            if (!base.origin || base.origin === 'null') {
                return false;
            }
        } catch (e) {
            return false;
        }
        const other = new URL(otherUrl, base);
        return base.origin === other.origin;
    }

    return urls.isSameOrigin = isSameOrigin;

});

define('skylark-langx-urls/main',[
	"./urls",
	"./create_object_url",
	"./create_valid_absolute_url",
	"./get-absolute-url",
	"./get-file-extension",
	"./get-file-name",
	"./get-query",
	"./is-cross-origin",
	"./is_same_origin",
	"./parse-url"
],function(urls){
	return urls;
});
define('skylark-langx-urls', ['skylark-langx-urls/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-langx-urls.js.map
