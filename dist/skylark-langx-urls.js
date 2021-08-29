/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(t,n){var e=n.define,require=n.require,r="function"==typeof e&&e.amd,s=!r&&"undefined"!=typeof exports;if(!r&&!e){var i={};e=n.define=function(t,n,e){"function"==typeof e?(i[t]={factory:e,deps:n.map(function(n){return function(t,n){if("."!==t[0])return t;var e=n.split("/"),r=t.split("/");e.pop();for(var s=0;s<r.length;s++)"."!=r[s]&&(".."==r[s]?e.pop():e.push(r[s]));return e.join("/")}(n,t)}),resolved:!1,exports:null},require(t)):i[t]={factory:null,resolved:!0,exports:e}},require=n.require=function(t){if(!i.hasOwnProperty(t))throw new Error("Module "+t+" has not been defined");var module=i[t];if(!module.resolved){var e=[];module.deps.forEach(function(t){e.push(require(t))}),module.exports=module.factory.apply(n,e)||null,module.resolved=!0}return module.exports}}if(!e)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(t,require){t("skylark-langx-urls/urls",["skylark-langx-ns"],function(t){return t.attach("langx.urls",{})}),t("skylark-langx-urls/get-absolute-url",["./urls"],function(t){"use strict";return t.getAbsoluteUrl=function(t){if(!t.match(/^https?:\/\//)){const n=document.createElement("div");n.innerHTML=`<a href="${t}">x</a>`,t=n.firstChild.href}return t}}),t("skylark-langx-urls/get-file-extension",["./urls"],function(t){"use strict";return t.getFileExtension=function(t){if("string"==typeof t){const n=/^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/,e=n.exec(t);if(e)return e.pop().toLowerCase()}return""}}),t("skylark-langx-urls/get-file-name",["./urls"],function(t){"use strict";return t.getFileName=function(t){const n=t.indexOf("#"),e=t.indexOf("?"),r=Math.min(n>0?n:t.length,e>0?e:t.length);return t.substring(t.lastIndexOf("/",r)+1,r)}}),t("skylark-langx-urls/get-query",["./urls"],function(t){"use strict";return t.getQuery=function(t){for(var n={},e=t.split("&"),r=e.length,s=[],i=0;i<r;i++){s=e[i].split("=",2);try{s[0]=decodeURIComponent(s[0]),s[1]=decodeURIComponent(s[1])}catch(t){}void 0===n[s[0]]?n[s[0]]=s[1]:n[s[0]]+=","+s[1]}return n}}),t("skylark-langx-urls/parse-url",["./urls"],function(t){"use strict";return t.parseUrl=function(t){const n=["protocol","hostname","port","pathname","search","hash","host"];let e=document.createElement("a");e.href=t;const r=""===e.host&&"file:"!==e.protocol;let s;r&&((s=document.createElement("div")).innerHTML=`<a href="${t}"></a>`,e=s.firstChild,s.setAttribute("style","display:none; position:absolute;"),document.body.appendChild(s));const i={};for(let t=0;t<n.length;t++)i[n[t]]=e[n[t]];"http:"===i.protocol&&(i.host=i.host.replace(/:80$/,""));"https:"===i.protocol&&(i.host=i.host.replace(/:443$/,""));i.protocol||(i.protocol=window.location.protocol);r&&document.body.removeChild(s);return i}}),t("skylark-langx-urls/is-cross-origin",["./urls","./parse-url"],function(t,n){"use strict";return t.isCrossOrigin=function(t,e=window.location){const r=n(t);return(":"===r.protocol?e.protocol:r.protocol)+r.host!==e.protocol+e.host}}),t("skylark-langx-urls/path",["skylark-langx-types","skylark-langx-constructs/klass","./urls"],function(t,n,e){var r=n({_construct:function(){var n=this._={segments:null,hasLeading:!1,hasTrailing:!1};1==arguments.length&&t.isString(arguments[0])?this._parse(arguments[0]):t.isArray(arguments[0])&&(n.segments=arguments[0],n.hasLeading=arguments[1]||!1,n.hasTrailing=arguments[2]||!1,this._canonicalize())},_canonicalize:function(){for(var t,n=this._.segments,e=0;e<n.length;e++)if("."==n[e]||".."==n[e]){t=!0;break}if(t){for(var r=[],e=0;e<n.length;e++)".."==n[e]?0==r.length?this.hasLeading||r.push(n[e]):".."==r[r.length-1]?r.push(".."):r.pop():"."==n[e]&&1!=n.length||r.push(n[e]);if(r.length==n.length)return;this._.segments=r}},_length:function(t){return this._.segments.length},_parse:function(t){t||(t=".");var n=this._,e=t.split("/");"/"==t.charAt(0)&&(n.hasLeading=!0,e.shift()),"/"==t.charAt(t.length-1)&&(n.hasTrailing=!0,e.pop()),n.segments=e,n.path=t,this._canonicalize()},append:function(n){return t.isString(n)?this.appendPathStr(n):this.appendPath(n)},appendPath:function(t){if(t.isAbsolute())return t;var n=this.segments,e=t.segments,s=n.concat(e),i=new r(s,this.hasLeading,t.hasTrailing);return i},appendPathStr:function(t){return t=new r(t||""),this.appendPath(t)},clone:function(){return new r(this.segments,this.hasLeading,this.hasTrailing)},endsWith:function(t){for(var n=this.segments,e=new r(t).segments;e.length>0&&n.length>0;)if(e.pop()!=n.pop())return!1;return!0},equals:function(t){var n=this._.segments,e=t._.segments;if(n.length!=e.length)return!1;for(var r=0;r<n.length;r++)if(e[r]!=n[r])return!1;return!0},firstSegment:function(t){var n=this._.segments;return n[t||0]},getExtension:function(){var t=this._.extension,n=this._.path;return textension||(t=this._.extension=n.substr(n.lastIndexOf(".")+1)),t},getSegments:function(){return this.segments},getParentPath:function(){var t=this._.parentPath;if(!t){var n=this.segments;n.pop(),t=this._.parentPath=new r(n,this.hasLeading)}return t},getRoot:function(){},isAbsolute:function(){return this.hasLeading},lastSegment:function(){var t=this._.segments;return t[t.length-1]},matchingFirstSegments:function(t){for(var n=this.segments,e=t.segments,r=Math.min(n.length,e.length),s=0,i=0;i<r;i++){if(n[i]!=e[i])return s;s++}return s},normalize:function(){},removeFirstSegments:function(t){var n=this._.segments,e=this._.hasLeading;return hasTrailing=this._.hasTrailing,new r(n.slice(t,n.length),e,hasTrailing)},removeLastSegments:function(t){var n=this._.segments,e=this._.hasLeading;return hasTrailing=this._.hasTrailing,t||(t=1),new r(n.slice(0,n.length-t),e,hasTrailing)},removeMatchingFirstSegments:function(t){var n=this.matchingFirstSegments(t);return this.removeFirstSegments(n)},removeMatchingLastSegments:function(t){var n=this.matchingFirstSegments(anotherPath);return this.removeLastSegments(n)},removeRelative:function(){var t=this.segments;return t.length>0&&"."==t[1]?this.removeFirstSegments(1):this},relativeTo:function(t,n){"string"==typeof t&&(t=new r(t));var e=this.segments;if(this.isAbsolute())return this;var s=t.segments,i=this.matchingFirstSegments(t),a=s.length;n&&(a-=1);var o=a-i,h=o+e.length-i;if(0==h)return r.EMPTY;for(var l=[],u=0;u<o;u++)l.push("..");for(var u=i;u<e.length;u++)l.push(e[u]);return new r(l,!1,this.hasTrailing)},segment:function(t){var n=this._.segments;return n.length<t?null:n[t]},startsWith:function(t){var n=this.matchingFirstSegments(t);return t._length()==n},toString:function(){var t=[],n=this._.segments;this.hasLeading&&t.push("/");for(var e=0;e<n.length;e++)e>0&&t.push("/"),t.push(n[e]);return this.hasTrailing&&t.push("/"),t.join("")},hasLeading:{get:function(){return this._.hasLeading}},hasTrailing:{get:function(){return this._.hasTrailing}}});return r.EMPTY=new r(""),e.Path=r}),t("skylark-langx-urls/main",["./urls","./get-absolute-url","./get-file-extension","./get-file-name","./get-query","./is-cross-origin","./parse-url","./path"],function(t){return t}),t("skylark-langx-urls",["skylark-langx-urls/main"],function(t){return t})}(e),!r){var a=require("skylark-langx-ns");s?module.exports=a:n.skylarkjs=a}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-langx-urls.js.map
