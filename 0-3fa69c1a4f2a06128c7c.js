(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{139:function(e,t,a){"use strict";a.r(t),a.d(t,"graphql",function(){return p}),a.d(t,"StaticQueryContext",function(){return m}),a.d(t,"StaticQuery",function(){return f});var n=a(0),r=a.n(n),i=a(4),c=a.n(i),l=a(140),s=a.n(l);a.d(t,"Link",function(){return s.a}),a.d(t,"withPrefix",function(){return l.withPrefix}),a.d(t,"navigate",function(){return l.navigate}),a.d(t,"push",function(){return l.push}),a.d(t,"replace",function(){return l.replace}),a.d(t,"navigateTo",function(){return l.navigateTo});var o=a(143),u=a.n(o);a.d(t,"PageRenderer",function(){return u.a});var d=a(44);a.d(t,"parsePath",function(){return d.a});var m=r.a.createContext({}),f=function(e){return r.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function p(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}f.propTypes={data:c.a.object,query:c.a.string.isRequired,render:c.a.func,children:c.a.func}},141:function(e,t,a){"use strict";var n=a(155),r=a(0),i=a.n(r),c=a(4),l=a.n(c),s=a(142),o=a.n(s),u=a(139),d=(a(156),a(157),a(158),a(159),function(){return i.a.createElement("a",{href:"https://twitter.com/fquednau?ref_src=twsrc%5Etfw",className:"twitter-follow-button","data-size":"large","data-show-count":"false","data-show-screen-name":"false"},"Follow @fquednau")}),m=function(e){var t=e.title,a=e.description;return i.a.createElement("div",{className:"sidebar"},i.a.createElement("h1",null,i.a.createElement("a",{className:"sidebar__sitetitle",href:"/"},t)),i.a.createElement("p",null,a),i.a.createElement("nav",null,i.a.createElement(u.Link,{to:"/tags"},"Tags")),i.a.createElement("div",{className:"sidebar__twitter"},i.a.createElement(d,null)))},f=function(){return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"footer__twitter"},i.a.createElement(d,null)," "),i.a.createElement("p",{className:"footer__copyright"},"© Frank Quednau ",(new Date).getFullYear()))},p=function(e){var t=e.children;return i.a.createElement(u.StaticQuery,{query:"2328579951",render:function(e){return i.a.createElement(i.a.Fragment,null,i.a.createElement(o.a,{title:e.site.siteMetadata.title,meta:[{name:"description",content:e.site.siteMetadata.description}]},i.a.createElement("html",{lang:"en"}),i.a.createElement("link",{href:"//fonts.googleapis.com/css?family=Raleway:400,300,600",rel:"stylesheet",type:"text/css"})),i.a.createElement("div",{className:"container"},i.a.createElement("div",{className:"row"},i.a.createElement("div",{className:"two columns right-padded"},i.a.createElement(m,{title:e.site.siteMetadata.title,description:e.site.siteMetadata.description})),i.a.createElement("div",{className:"nine columns"},t)),i.a.createElement("div",{className:"row"},i.a.createElement(f,null))))},data:n})};p.propTypes={children:l.a.node.isRequired};t.a=p},143:function(e,t,a){var n;e.exports=(n=a(147))&&n.default||n},147:function(e,t,a){"use strict";a.r(t);a(29);var n=a(0),r=a.n(n),i=a(4),c=a.n(i),l=a(63),s=a(2),o=function(e){var t=e.location,a=s.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(l.a,Object.assign({location:t,pageResources:a},a.json))};o.propTypes={location:c.a.shape({pathname:c.a.string.isRequired}).isRequired},t.default=o},155:function(e){e.exports={data:{site:{siteMetadata:{title:"Realfiction",description:"Content from Frank Quednau about dev and fields of interest."}}}}},156:function(e,t,a){},157:function(e,t,a){},158:function(e,t,a){},159:function(e,t,a){}}]);
//# sourceMappingURL=0-3fa69c1a4f2a06128c7c.js.map