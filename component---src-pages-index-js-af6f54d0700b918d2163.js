/*! For license information please see component---src-pages-index-js-af6f54d0700b918d2163.js.LICENSE.txt */
(self.webpackChunkgatsby_starter_default=self.webpackChunkgatsby_starter_default||[]).push([[678],{5900:function(e,t){var a;!function(){"use strict";var r={}.hasOwnProperty;function n(){for(var e=[],t=0;t<arguments.length;t++){var a=arguments[t];if(a){var l=typeof a;if("string"===l||"number"===l)e.push(a);else if(Array.isArray(a)){if(a.length){var s=n.apply(null,a);s&&e.push(s)}}else if("object"===l)if(a.toString===Object.prototype.toString)for(var c in a)r.call(a,c)&&a[c]&&e.push(c);else e.push(a.toString())}}return e.join(" ")}e.exports?(n.default=n,e.exports=n):void 0===(a=function(){return n}.apply(t,[]))||(e.exports=a)}()},7206:function(e,t,a){"use strict";a.d(t,{Z:function(){return s}});var r=a(7294),n=a(5900),l=a.n(n);function s(e){var t=e.dateStr,a=e.className,n=(0,r.useMemo)((function(){var e=new Date(t);return[e.getDate(),e.toLocaleString("en",{month:"short"}),e.getFullYear()]}),[t]),s=n[0],c=n[1],o=n[2];return r.createElement("time",{className:l()("DateDisplay-module--dateContainer--1trkw",a),dateTime:t},r.createElement("span",{className:"DateDisplay-module--month--2KOka"},c),r.createElement("span",{className:"DateDisplay-module--date--oZxQz"},s),r.createElement("span",{className:"DateDisplay-module--year--2577t"},o))}},5531:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return o}});var r=a(7294),n=a(4264),l=a(5444),s=a(7206);function c(e){var t=e.slug,a=e.title,n=e.date,c=e.excerpt;return r.createElement("article",{className:"postExcerpt-module--article--1YC-H"},r.createElement("header",{className:"postExcerpt-module--headerContainer--hcRy6"},r.createElement(s.Z,{dateStr:n}),r.createElement("h2",{className:"postExcerpt-module--header--1LVL4"},r.createElement(l.Link,{to:t},a))),r.createElement("p",{className:"postExcerpt-module--excerpt--2vlk7"},c))}var o=function(e){var t=e.data.allMdx.edges;return r.createElement(n.Z,null,t.map((function(e){var t=e.node,a=t.fields.slug,n=t.frontmatter,l=n.date,s=n.title,o=t.excerpt;return r.createElement(c,{key:a,slug:a,title:s,date:l,excerpt:o})})))}}}]);
//# sourceMappingURL=component---src-pages-index-js-af6f54d0700b918d2163.js.map