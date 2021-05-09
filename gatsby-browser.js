/**
 * Implement Gatsby's Browser APIs in this file.
 *
 */

require('prismjs/themes/prism-coy.css')

// This code is taken from
// https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-twitter
// but applies the twitter script too restrictively
const injectTwitterScript = () => {
  function addJS(jsCode) {
    var s = document.createElement(`script`)

    s.type = `text/javascript`
    s.innerText = jsCode
    document.getElementsByTagName(`head`)[0].appendChild(s)
  }
  addJS(`
            window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
    return t;
  }(document, "script", "twitter-wjs"));
  `)
}

let injectedTwitterScript = false
exports.onRouteUpdate = function () {
  if (!injectedTwitterScript) {
    injectTwitterScript()
    injectedTwitterScript = true
  }

  if (
    typeof twttr !== `undefined` &&
    window.twttr.widgets &&
    typeof window.twttr.widgets.load === `function`
  ) {
    window.twttr.widgets.load()
  }
}
