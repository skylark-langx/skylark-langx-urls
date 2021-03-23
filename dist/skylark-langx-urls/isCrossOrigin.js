/**
 * skylark-langx-urls - The skylark JavaScript language extension library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./urls"],function(o){"use strict";return o.isCrossOrigin=function(o,r=window.location){const t=parseUrl(o);return(":"===t.protocol?r.protocol:t.protocol)+t.host!==r.protocol+r.host}});
//# sourceMappingURL=sourcemaps/isCrossOrigin.js.map
