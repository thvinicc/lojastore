try {
var _xnext_included;
if (!_xnext_included && !window.location.href.match(/fb_xd_fragment/g)) {
_xnext_included = true;

if(!document.body) {
    throw "The tag <body> is missing";
}

function xInjectJs(src) {
	var script = document.createElement("script");
	script.setAttribute("src", src);
	script.charset = "utf-8";
	script.setAttribute("type", "text/javascript");
	document.body.appendChild(script);
}

if (window.Ecwid && window.Ecwid.restoreCartData) {
    var cartData = window.Ecwid.restoreCartData;
    for (var item in cartData) {
        localStorage.setItem(item, cartData[item]);
    }
}

function isOnIframe() {
	return window.top.location != window.location;
}

// Hi! Do you love reading JavaScript code? We too! 
// Ecwid has a plenty of different APIs and we welcome all developers to 
// create addons and services (free or paid ones) for Ecwid merchants. Such 
// addons and apps will be promoted on our site. 
// More about our APIs: http://api.ecwid.com

var ecwidContextPath = "\/";
var addExtension = function(cons,ext) {
	if (cons.addExtension) cons.addExtension(ext);
	else cons(ext);
};
var ep = function() {
	  this.extensions = [];
	  this.consumers = [];
	  var that = this;
	  this.registerConsumer = function(cons) {
	    that.consumers.push(cons);
	    for (var i=0; i<that.extensions.length; i++) addExtension(cons, that.extensions[i]);
	  };
	  this.addExtension = this.add = function(ext) {
	    that.extensions.push(ext);
	    for (var i=0; i<that.consumers.length; i++) addExtension(that.consumers[i],ext);
	  };
      this.clear = function() {
        that.extensions = [];
      };
	};
var proxyChain = function() {return {Chain:new ep};};
window.ec = window.ec || {};
window.ec.config = window.ec.config || {};
var chameleon = window.ec.config.chameleon || {};

var colorPrefix = "color-";
for (var key in chameleon) {
	if (chameleon.hasOwnProperty(key) && key.indexOf(colorPrefix) == 0) {
		chameleon.colors = chameleon.colors || {};
		chameleon.colors[key] = chameleon[key];
	}
}

window.ec.config.chameleon = chameleon;
(function(h){var d=function(d,e,n){function k(a){if(b.body)return a();setTimeout(function(){k(a)})}function f(){a.addEventListener&&a.removeEventListener("load",f);a.media=n||"all"}var b=h.document,a=b.createElement("link"),c;if(e)c=e;else{var l=(b.body||b.getElementsByTagName("head")[0]).childNodes;c=l[l.length-1]}var m=b.styleSheets;a.rel="stylesheet";a.href=d;a.media="only x";k(function(){c.parentNode.insertBefore(a,e?c:c.nextSibling)});var g=function(b){for(var c=a.href,d=m.length;d--;)if(m[d].href===
c)return b();setTimeout(function(){g(b)})};a.addEventListener&&a.addEventListener("load",f);a.onloadcssdefined=g;g(f);return a};"undefined"!==typeof exports?exports.loadCSS=d:h.loadCSS=d})("undefined"!==typeof global?global:this);window.Ecwid = {
	MessageBundles:(window.Ecwid && window.Ecwid.MessageBundles) ? window.Ecwid.MessageBundles : {},
	ExtensionPoint:ep,
	ProductBrowser : {Links:new ep,
			CategoryView:proxyChain()
			},
	Controller : proxyChain(),
	ShoppingCartController : proxyChain(),
	ProductModel : proxyChain(),
	CategoriesModel : proxyChain(),
	CategoryModel : proxyChain(),
	AppContainer : proxyChain(),
	Profile : proxyChain(),
	CustomerCredentialsModel : proxyChain(),
	LocationHashModel : proxyChain(),
	OnAPILoaded: new ep,
	OnPageLoad: new ep,
	OnSetProfile: new ep,
	OnPageLoaded: new ep,
	OnConfigLoaded: new ep,
	OnCartChanged: new ep,
	OnOrderPlaced: new ep,
	OnProductOptionsChanged: new ep,

	_injectEcwidCss: function() {

		var cssUrlAddition = (document.documentMode==7?'&IE8-like-IE7':'')+(window.css_selectors_prefix? '&id-selector='+window.css_selectors_prefix:'')+((function() {return 'ontouchstart' in window || !!(window.DocumentTouch && document instanceof DocumentTouch);})()?'&hover=disable':'');
ChameleonIntegration = {
	getChameleonColors: function () {
		var colors = {};
		var parent = this.findAncestor();
		if (!parent) {
			return colors;
		}
		colors['color-foreground'] = getComputedStyle(parent, null).color;
		colors['color-background'] = this.getBackground(parent);
		colors['color-link'] = this.getLinkColor(parent);
		colors['color-button'] = colors['color-link'];
		colors['color-price'] = colors['color-foreground'];

		if (colors['color-background'] == 'transparent') {
			colors['color-background'] = 'white';
		}
		return colors;
	},

	getChameleonFontFamily: function () {
		var font = {};
		var parent = this.findAncestor();
		if (!parent) {
			return font;
		}
		font['font-family'] = this.getStyle(parent, 'font-family');
		return font;
	},

	findAncestor: function () {
		var widgetTypes = ['ProductBrowser', 'SingleProduct', 'Product', 'Minicart', 'CategoriesV2', 'VCategories'];
		for (var i = 0; i < widgetTypes.length; ++i) {
			var productWidget = this.extractWidget(widgetTypes[i]);
			if (productWidget) {
				var widget = document.querySelector("#" + productWidget.id);
				return widget ? widget.parentNode : undefined;
			}
		}
	},

	extractWidget: function (widgetType) {
		var widgets = window._xnext_initialization_scripts;
		if (!widgets) {
			return;
		}
		widgets = widgets.reverse();
		for (var i = 0; i < widgets.length; ++i) {
			if (widgets[i].widgetType == widgetType) {
				return widgets[i];
			}
		}
	},

	getLinkColor: function (parent) {
		var a = document.createElement('a');
		a.href = a.textContent = url = '';
		parent.appendChild(a);
		var primary_link = document.defaultView.getComputedStyle(a, null).color;
		parent.removeChild(a);
		return primary_link;
	},

	toCamelCase: function (s) {
		for (var exp = /-([a-z])/; exp.test(s); s = s.replace(exp, RegExp.$1.toUpperCase()));
		return s;
	},

	getStyle: function (e, a) {
		var v = null;
		if (document.defaultView && document.defaultView.getComputedStyle) {
			var cs = document.defaultView.getComputedStyle(e, null);
			if (cs && cs.getPropertyValue)
				v = cs.getPropertyValue(a);
		}
		if (!v && e.currentStyle)
			v = e.currentStyle[this.toCamelCase(a)];
		return v;
	},

	getBackground: function (e) {
		var v = this.getStyle(e, 'background-color');
		while (!v || v == 'transparent' || v == '#000000' || v == 'rgba(0, 0, 0, 0)') {
			if (e == document.body)
				v = 'white';
			else {
				e = e.parentNode;
				v = this.getStyle(e, 'background-color');
			}
		}
		return v;
	}
};

function isOnIframe() {
	return window.top.location != window.location;
}

function getAdditionalCssUrlParams(colors, valueLengthLimit) {
	var cssColorParams = "";
	for (var key in colors) {
		if (colors.hasOwnProperty(key)) {
			var value = colors[key];
			cssColorParams += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value.substring(0, valueLengthLimit));
		}
	}
	return cssColorParams;
}

var colors;
if (window.ec && window.ec.config && window.ec.config.chameleon && window.ec.config.chameleon.colors) {
	colors = window.ec.config.chameleon.colors;
}
var chameleonEnabled = false || false && !isOnIframe();
if (!colors && chameleonEnabled || colors === "auto") {
	colors = ChameleonIntegration.getChameleonColors();
}
var valueLengthLimit;
if (!!colors) {
	valueLengthLimit = 50;
	cssUrlAddition += getAdditionalCssUrlParams(colors, valueLengthLimit);
}

var font;
if (window.ec && window.ec.config && window.ec.config.chameleon && window.ec.config.chameleon.font) {
	font = window.ec.config.chameleon.font;
}

if (!font && chameleonEnabled || font === "auto") {
	font = ChameleonIntegration.getChameleonFontFamily();
}

if (!!font) {
	valueLengthLimit = 150;
	cssUrlAddition += getAdditionalCssUrlParams(font, valueLengthLimit);
}

		var cssUrl = 'https://d3j0zfs7paavns.cloudfront.net/css/new?hc=-1360013879&ownerid=10922396&useProximaNovaFont=true' + cssUrlAddition;

            loadCSS(cssUrl )
	},

	_isAllCssLoaded: function() {
		return /complete/.test(document.readyState);
	},

	_waitForCssLoaded: function(callback) {
		var ecwidCssLoadedTimer = setInterval(function() {
			if (Ecwid._isAllCssLoaded()) {
				clearInterval(ecwidCssLoadedTimer);
				callback();
			}
		}, 10);
	},

	_autoChameleonEnabled: function() {
		window.ec = window.ec || {};
		window.ec.config = window.ec.config || {};
		window.ec.config.chameleon = window.ec.config.chameleon || {};

		var colors = window.ec.config.chameleon.colors;
		var chameleonEnabled = false || false && !isOnIframe();
		if (!colors && chameleonEnabled || colors === "auto") {
			return true;
		}
		var font = window.ec.config.chameleon.font;
		if (!font && chameleonEnabled || font === "auto") {
			return true;
		}
		return false;
	},

	_loadEcwidCss: function() {
		if (Ecwid._autoChameleonEnabled()) {
			Ecwid._waitForCssLoaded(function () {
				Ecwid._injectEcwidCss();
			});
		} else {
			Ecwid._injectEcwidCss();
		}
	},

	_loadEcwidAsync: function() {
		setTimeout(function() {
			Ecwid._onBodyDone();
		}, 10);
	},

	_hasFacebookIframe: function() {
		return window.location.href.match(/fb_xd_fragment/g);
	},

	_onBodyDone: function() {
		if ((!ecwid_bodyDone && !Ecwid._hasFacebookIframe() && !window.ecwid_dynamic_widgets) || window.ecwid_dynamic_widgets) {
			ecwid_bodyDone = true;

			Ecwid._loadEcwidCss();

			// ========================= NOCACHE BEGIN =========================
			ru_cdev_xnext_frontend_Main=function(){var P='bootstrap',Q='begin',R='gwt.codesvr.ru.cdev.xnext.frontend.Main=',S='gwt.codesvr=',T='ru.cdev.xnext.frontend.Main',U='startup',V='DUMMY',W=0,X=1,Y='iframe',Z='javascript:""',$='fitvidsignore',_='position:absolute; width:0; height:0; border:none; left: -1000px;',ab=' top: -1000px;',bb='CSS1Compat',cb='<!doctype html>',db='',eb='<html><head><\/head><body><\/body><\/html>',fb='undefined',gb='DOMContentLoaded',hb=50,ib='script',jb='javascript',kb='ru_cdev_xnext_frontend_Main',lb='Failed to load ',mb='moduleStartup',nb='scriptTagAdded',ob='moduleRequested',pb='meta',qb='name',rb='ru.cdev.xnext.frontend.Main::',sb='::',tb='gwt:property',ub='content',vb='=',wb='gwt:onPropertyErrorFn',xb='Bad handler "',yb='" for "gwt:onPropertyErrorFn"',zb='gwt:onLoadErrorFn',Ab='" for "gwt:onLoadErrorFn"',Bb='#',Cb='?',Db='/',Eb='img',Fb='clear.cache.gif',Gb='baseUrl',Hb='ru.cdev.xnext.frontend.Main.nocache.js',Ib='base',Jb='//',Kb='mgwt.os',Lb='safari',Mb='android',Nb='desktop',Ob='iphone',Pb='ipad',Qb='ipod',Rb='user.agent',Sb='webkit',Tb='msie',Ub=10,Vb=11,Wb='iemobile/10',Xb='ie10',Yb=9,Zb='ie9',$b='msie 6.',_b='msie 7.',ac=8,bc='ie8',cc='gecko',dc='opera',ec='gecko1_8',fc=2,gc=3,hc=4,ic='selectingPermutation',jc='ru.cdev.xnext.frontend.Main.devmode.js',kc='160877E3C5550BD2FADF2C9DDDF2315F',lc='7C6FAFCE84A82445781E7D55F2EB4E4D',mc='911459763A825963E6563FF8DB7319DE',nc='91FFE9FEBE27F0C11AF50267FBA1D8C3',oc='F2FEA2E0C68B26FD743353FFF04783A9',pc=':',qc='.cache.js',rc='loadExternalRefs',sc='end',tc='http:',uc='https:',vc='file:',wc='_gwt_dummy_',xc='__gwtDevModeHook:ru.cdev.xnext.frontend.Main',yc='Ignoring non-whitelisted Dev Mode URL: ',zc=':moduleBase',Ac='head';var n;var o=window;var p=document;r(P,Q);function q(){var a=o.location.search;return a.indexOf(R)!=-1||a.indexOf(S)!=-1}
function r(a,b){if(o.__gwtStatsEvent){o.__gwtStatsEvent({moduleName:T,sessionId:o.__gwtStatsSessionId,subSystem:U,evtGroup:a,millis:(new Date).getTime(),type:b})}}
ru_cdev_xnext_frontend_Main.__sendStats=r;ru_cdev_xnext_frontend_Main.__moduleName=T;ru_cdev_xnext_frontend_Main.__errFn=null;ru_cdev_xnext_frontend_Main.__moduleBase=V;ru_cdev_xnext_frontend_Main.__softPermutationId=W;ru_cdev_xnext_frontend_Main.__computePropValue=null;ru_cdev_xnext_frontend_Main.__getPropMap=null;ru_cdev_xnext_frontend_Main.__installRunAsyncCode=function(){};ru_cdev_xnext_frontend_Main.__gwtStartLoadingFragment=function(){return null};ru_cdev_xnext_frontend_Main.__gwt_isKnownPropertyValue=function(){return false};ru_cdev_xnext_frontend_Main.__gwt_getMetaProperty=function(){return null};var s=null;var t=o.__gwt_activeModules=o.__gwt_activeModules||{};t[T]={moduleName:T};ru_cdev_xnext_frontend_Main.__moduleStartupDone=function(e){var f=t[T].bindings;t[T].bindings=function(){var a=f?f():{};var b=e[ru_cdev_xnext_frontend_Main.__softPermutationId];for(var c=W;c<b.length;c++){var d=b[c];a[d[W]]=d[X]}return a}};var u;function v(){w();return u}
function w(){if(u){return}var a=p.createElement(Y);if(!o.needLoadEcwidAsync){a.src=Z}a.id=T;a.className=$;a.style.cssText=_+ab;a.tabIndex=-1;p.body.appendChild(a);u=a.contentDocument;if(!u){u=a.contentWindow.document}u.open();var b=document.compatMode==bb?cb:db;u.write(b+eb);u.close()}
function A(f){function g(a){function b(){if(typeof p.readyState==fb){return typeof p.body!=fb&&p.body!=null}return /loaded|complete/.test(p.readyState)}
var c=b();if(c){a();return}function d(){if(!c){c=true;a();if(p.removeEventListener){p.removeEventListener(gb,d,false)}if(e){clearInterval(e)}}}
if(p.addEventListener){p.addEventListener(gb,d,false)}var e=setInterval(function(){if(b()){d()}},hb)}
function h(a){var b=v();var c=b.body;var d=b.createElement(ib);d.language=jb;d.src=a;if(ru_cdev_xnext_frontend_Main.__errFn){d.onerror=function(){ru_cdev_xnext_frontend_Main.__errFn(kb,new Error(lb+a))}}c.appendChild(d);r(mb,nb)}
r(mb,ob);g(function(){h(f)})}
function B(e){function f(a){var b=v();var c=b.body;var d=b.createElement(ib);d.language=jb;d.src=a;d.async=true;if(ru_cdev_xnext_frontend_Main.__errFn){d.onerror=function(){ru_cdev_xnext_frontend_Main.__errFn(kb,new Error(lb+a))}}c.appendChild(d);r(mb,nb)}
r(mb,ob);f(e)}
ru_cdev_xnext_frontend_Main.__startLoadingFragment=function(a){return F(a)};ru_cdev_xnext_frontend_Main.__installRunAsyncCode=function(a){var b=v();var c=b.body;var d=b.createElement(ib);d.language=jb;d.text=a;c.appendChild(d);c.removeChild(d)};function C(){var c={};var d;var e;var f=p.getElementsByTagName(pb);for(var g=W,h=f.length;g<h;++g){var i=f[g],j=i.getAttribute(qb),k;if(j){j=j.replace(rb,db);if(j.indexOf(sb)>=W){continue}if(j==tb){k=i.getAttribute(ub);if(k){var l,m=k.indexOf(vb);if(m>=W){j=k.substring(W,m);l=k.substring(m+X)}else{j=k;l=db}c[j]=l}}else if(j==wb){k=i.getAttribute(ub);if(k){try{d=eval(k)}catch(a){alert(xb+k+yb)}}}else if(j==zb){k=i.getAttribute(ub);if(k){try{e=eval(k)}catch(a){alert(xb+k+Ab)}}}}}__gwt_getMetaProperty=function(a){var b=c[a];return b==null?null:b};s=d;ru_cdev_xnext_frontend_Main.__errFn=e}
function D(){if(window.ecwid_script_base){n=window.ecwid_script_base;return n}function e(a){var b=a.lastIndexOf(Bb);if(b==-1){b=a.length}var c=a.indexOf(Cb);if(c==-1){c=a.length}var d=a.lastIndexOf(Db,Math.min(c,b));return d>=W?a.substring(W,d+X):db}
function f(a){if(a.match(/^\w+:\/\//)){}else{var b=p.createElement(Eb);b.src=a+Fb;a=e(b.src)}return a}
function g(){var a=__gwt_getMetaProperty(Gb);if(a!=null){return a}return db}
function h(){var a=p.getElementsByTagName(ib);for(var b=W;b<a.length;++b){if(a[b].src.indexOf(Hb)!=-1){return e(a[b].src)}}return db}
function i(){var a=p.getElementsByTagName(Ib);if(a.length>W){return a[a.length-X].href}return db}
function j(){var a=p.location;return a.href==a.protocol+Jb+a.host+a.pathname+a.search+a.hash}
var k=g();if(k==db){k=h()}if(k==db){k=i()}if(k==db&&j()){k=e(p.location.href)}k=f(k);return k}
function F(a){if(a.match(/^\//)){return a}if(a.match(/^[a-zA-Z]+:\/\//)){return a}return ru_cdev_xnext_frontend_Main.__moduleBase+a}
function G(){var f=[];var g=W;function h(a,b){var c=f;for(var d=W,e=a.length-X;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
var i=[];var j=[];function k(a){var b=j[a](),c=i[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(s){s(a,d,b)}throw null}
j[Kb]=function(){{var b=function(){var a=window.navigator.userAgent.toLowerCase();if(a.indexOf(Lb)==-1&&a.indexOf(Mb)!=-1){return Nb}if(a.indexOf(Mb)!=-1||(a.indexOf(Ob)!=-1||(a.indexOf(Pb)!=-1||a.indexOf(Qb)!=-1))){return Ob}return Nb}();return b}};i[Kb]={desktop:W,iphone:X};j[Rb]=function(){var a=navigator.userAgent.toLowerCase();var b=p.documentMode;if(function(){return a.indexOf(Sb)!=-1}())return Lb;if(function(){return a.indexOf(Tb)!=-1&&(b>=Ub&&b<Vb)||a.indexOf(Wb)!=-1}())return Xb;if(function(){return a.indexOf(Tb)!=-1&&(b>=Yb&&b<Vb)}())return Zb;if(function(){return a.indexOf($b)!=-1||(a.indexOf(_b)!=-1||a.indexOf(Tb)!=-1&&(b>=ac&&b<Vb))}())return bc;if(function(){return a.indexOf(cc)!=-1||(b>=Vb||a.indexOf(dc)!=-1)}())return ec;return Lb};i[Rb]={gecko1_8:W,ie10:X,ie8:fc,ie9:gc,safari:hc};__gwt_isKnownPropertyValue=function(a,b){return b in i[a]};ru_cdev_xnext_frontend_Main.__getPropMap=function(){var a={};for(var b in i){if(i.hasOwnProperty(b)){a[b]=k(b)}}return a};ru_cdev_xnext_frontend_Main.__computePropValue=k;o.__gwt_activeModules[T].bindings=ru_cdev_xnext_frontend_Main.__getPropMap;r(P,ic);if(q()){return F(jc)}var l;try{h([Nb,Xb],kc);h([Nb,Zb],lc);h([Nb,bc],mc);h([Nb,Lb],nc);h([Ob,Lb],nc);h([Nb,ec],oc);l=f[k(Kb)][k(Rb)];var m=l.indexOf(pc);if(m!=-1){g=parseInt(l.substring(m+X),Ub);l=l.substring(W,m)}}catch(a){}ru_cdev_xnext_frontend_Main.__softPermutationId=g;return F(l+qc)}
function H(){if(!o.__gwt_stylesLoaded){o.__gwt_stylesLoaded={}}r(rc,Q);r(rc,sc)}
C();ru_cdev_xnext_frontend_Main.__moduleBase=D();t[T].moduleBase=ru_cdev_xnext_frontend_Main.__moduleBase;var I=G();if(o){var J=!!(o.location.protocol==tc||(o.location.protocol==uc||o.location.protocol==vc));o.__gwt_activeModules[T].canRedirect=J;function K(){var b=wc;try{o.sessionStorage.setItem(b,b);o.sessionStorage.removeItem(b);return true}catch(a){return false}}
if(J&&K()){var L=xc;var M=o.sessionStorage[L];if(!/^https:\/\/\w+.sandbox.ecwid.com(:\d+)?\/.*$/.test(M)){if(M&&(window.console&&console.log)){console.log(yc+M)}M=db}if(M&&!o[L]){o[L]=true;o[L+zc]=D();var N=p.createElement(ib);N.src=M;var O=p.getElementsByTagName(Ac)[W];O.insertBefore(N,O.firstElementChild||O.children[W]);return false}}}H();r(P,sc);if(window.needLoadEcwidAsync){B(I)}else{A(I)}return true}
ru_cdev_xnext_frontend_Main.succeeded=ru_cdev_xnext_frontend_Main();
			// ========================= NOCACHE END ===========================
		}
	}
};

window.ecwid_bodyDone = false;
window.ecwid_onBodyDone = Ecwid._onBodyDone;
window.needLoadEcwidAsync = true; //need for async loading in gwt library

xInjectJs('https://d3fi9i0jj23cau.cloudfront.net/gz/23.8-664-g5d6105c/lang/pt_BR.js');

if (window.top != window && document.referrer) {
	var hash_position = document.referrer.lastIndexOf('#!/');
	if (hash_position == -1) {
		// compatibility with old hashes
		// TODO: remove it 
		hash_position = document.referrer.lastIndexOf('#ecwid:');
	}
	if (hash_position != -1) {
		var hash = document.referrer.substr(hash_position);
		var loc = window.location.href;
		if (loc.indexOf('#') == -1) window.location.replace(loc + hash);
		else {
			if (loc.substr(loc.indexOf('#')) != hash) window.location.replace(loc.substr(0, loc.indexOf('#')) + hash);
		}
	}
	if (typeof ecwid_history_token != 'undefined') {
		var loc = window.location.href;		
		if(hash_position != -1)
			window.location.replace(loc.substr(0, loc.indexOf('#')) + ecwid_history_token);
		else
			window.location.replace(loc + '#' + ecwid_history_token);
	}		
}

window.css_selectors_prefix = "";
if (!window.ecwid_nocssrewrite) {
    var html_id = null;
    var html_tag = document.getElementsByTagName("html");
    if(html_tag && html_tag.length) {
        html_tag = html_tag[0];
        if(!html_tag.id) html_tag.id = "ecwid_html";
        html_id = html_tag.id;
    }

    var body_id = null;
    var body_tag = document.getElementsByTagName("body");
    if(body_tag && body_tag.length) {
        body_tag = body_tag[0];
        if(!body_tag.id) body_tag.id = "ecwid_body";
        body_id = body_tag.id;
    }

	if (html_id || body_id) {
		if (html_id) {
			window.css_selectors_prefix += "html#" + html_id;
		}
		if (html_id && body_id) {
			css_selectors_prefix += " ";
		}
		if (body_id) {
			css_selectors_prefix += "body#" + body_id;
		}
		window.css_selectors_prefix = encodeURIComponent(window.css_selectors_prefix)
	}
}

window.ecwid_script_base="https://d3fi9i0jj23cau.cloudfront.net/gz/23.8-664-g5d6105c/";
window.ecwid_url="https://app.ecwid.com/";


if (!window.amazon_image_domain) {
	window.amazon_image_domain = "https://s3.amazonaws.com/images.ecwid.com";
}

window.Ecwid.demo=false;
window.Ecwid.cssUrl="https://d3j0zfs7paavns.cloudfront.net/css/new?hc=-1360013879&ownerid=10922396&useProximaNovaFont=true";
window.Ecwid.acceptLanguage=["pt_BR","pt","en"];
window.Ecwid.appDomain="https://app.ecwid.com/";


window.Ecwid.getAppPublicConfig = function(namespace) {
    var publicData = {};
    var result = publicData[namespace];
    return typeof result === 'string' ? result : null;
}

window.Ecwid.getAppPublicToken = function(namespace) {
	var tokenMap = {};
	var result = tokenMap[namespace];
	return typeof result === 'string' ? result : null;
}

Ecwid._loadEcwidAsync();


function parseId(args) {
	var idPrefix = "id=";
	var id;
	for (var i=0; i<args.length; i++) {
		if (args[i].substr(0, idPrefix.length) == idPrefix) {
			id = args[i].substr(idPrefix.length);
		}
	}
	return id;
}

function parseStyle(args) {
	var stylePrefix = "style=";
	var style = "";
	for (var i=0; i<args.length; i++) {
		if (args[i].substr(0,stylePrefix.length) == stylePrefix) {
			var str = args[i].substr(stylePrefix.length);
			str = str.replace(/^ +\'?/,"").replace(/\'? +$/,"");
			if (str.substring(0,1)=="'") str = str.substring(1);
			if (str.substring(str.length-1)=="'") str = str.substring(0, str.length-1);
			style += str;
		}
	}
	return style;
}

function xAddWidget(widgetType, args) {

	args = Array.prototype.slice.call(args); // Cast Argument object into array

	var id = parseId(args);
	var style = parseStyle(args);

	var hashParams = window.location.hash.match(/.*\/(.*)$/);
	if (hashParams && hashParams.length > 1) {
		hashParams = hashParams[1].split('&');
		for (i = 0; i < hashParams.length; i++) {
			var hashParam = hashParams[i];
			var paramPrefix = '_x' + widgetType + '_';
			if (hashParam.indexOf(paramPrefix) != 0) {
				continue;
			}
			hashParam = hashParam.split('=');
			if (hashParam.length != 2) {
				continue;
			}
			var paramName = hashParam[0].replace(paramPrefix, '');
			var paramValue = decodeURIComponent(hashParam[1]);
			var replaceIndex = args.length;
			for (var j = 0; j < args.length; j++) {
				if (args[j].indexOf(paramName + '=') == 0) {
					replaceIndex = j;
					break;
				}
			}
			args[replaceIndex] = paramName + '=' + paramValue;
		}
	}

	if(id && document.getElementById(id)) {
		var e = document.getElementById(id);
		while(e.hasChildNodes()) e.removeChild(e.firstChild);
		e.setAttribute("style", style);
		try { e.style.cssText = style; } catch(ex) { } // IE
	} else {
		i=1;
		do {
			id = widgetType+"-"+i++;
		} while (document.getElementById(id));
		var html = "<div id='"+id+"'";
		if(style) {
			html += " style='"+style+"'";
		} else {
			if (widgetType == "Product") {
				html += " style='display:none'";
			}
		}
		html += "></div>";
		document.write(html);
	}

	if (widgetType == "ProductBrowser" ||
		widgetType == "Categories") {
		ecwid_loader(id);
	}

	var l = 0;
	if (!window._xnext_initialization_scripts) {
		window._xnext_initialization_scripts = [];
	} else {
		l = window._xnext_initialization_scripts.length;
	}
	window._xnext_initialization_scripts[l] = {widgetType:widgetType, id:id, arg:args};
    window.ecwid_dynamic_widgets && Ecwid._onBodyDone();
}

function xProductBrowser() {
    window.ecwid_dynamic_widgets && Ecwid.destroy();
	xAddWidget("ProductBrowser", arguments);
}
function ecwid_loader(id) {
	if (!window.ecwid_loader_shown && !Ecwid._hasFacebookIframe()) {
		if (!window.ecwid_use_custom_loading_indicator && !window.ecwid_dynamic_widgets) {
			var html;
				html = '<style>\
\
/* PB placeholder */\
\
.ecwid-pb-placeholder {\
	opacity: 0;\
	min-height: 400px;\
	box-sizing: border-box;\
	padding-top: 1px;\
}\
.ecwid-pb-placeholder > div {\
	-webkit-box-sizing: border-box;\
	box-sizing: border-box;\
}\
.ecwid-pb-placeholder--light,\
.ecwid-pb-placeholder--dark {\
	opacity: 1;\
}\
.ecwid-pb-placeholder__grid {\
	height: 280px;\
	width: 100%;\
	max-width: 786px;\
	text-align: center;\
	margin: 35px auto 50px;\
	overflow: hidden;\
	transition: opacity .15s ease-in-out;\
}\
.ecwid-pb-placeholder__grid-cell {\
	display: inline-block;\
	height: 280px;\
	line-height: 280px;\
	white-space: nowrap;\
	min-width: 342px;\
}\
.ecwid-pb-placeholder__grid-cell:nth-child(1),\
.ecwid-pb-placeholder__grid-cell:nth-child(3) {\
	width: 222px;\
	min-width: 222px;\
}\
.ecwid-pb-placeholder__product {\
	width: 222px;\
	height: 222px;\
	margin: 0 auto;\
	padding: 0;\
}\
.ecwid-pb-placeholder__title {\
	margin: 12px auto;\
	padding: 0;\
	max-width: 222px;\
}\
.ecwid-pb-placeholder__title > div {\
	height: 7px;\
	margin: 12px auto;\
	padding: 0;\
}\
.ecwid-pb-placeholder__title > div:nth-child(3) {\
	max-width: 100px; \
}\
\
/* PB placeholder light */\
\
.ecwid-pb-placeholder--light .ecwid-pb-placeholder__grid-cell .ecwid-pb-placeholder__product,\
.ecwid-pb-placeholder--light .ecwid-pb-placeholder__grid-cell .ecwid-pb-placeholder__title > div {\
	background-color: rgba(0,0,0,.03);\
}\
.ecwid-pb-placeholder--light.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(1) .ecwid-pb-placeholder__product {\
	-webkit-animation: pb-flash-light 800ms ease-out 0ms infinite;\
	animation: pb-flash-light 800ms ease-in-out 0ms infinite;\
}\
.ecwid-pb-placeholder--light.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(1) .ecwid-pb-placeholder__title > div {\
	-webkit-animation: pb-flash-light 800ms ease-out 83ms infinite;\
	animation: pb-flash-light 800ms ease-in-out 83ms infinite;\
}\
.ecwid-pb-placeholder--light.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(2) .ecwid-pb-placeholder__product {\
	-webkit-animation: pb-flash-light 800ms ease-out 167ms infinite;\
	animation: pb-flash-light 800ms ease-in-out 167ms infinite;\
}\
.ecwid-pb-placeholder--light.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(2) .ecwid-pb-placeholder__title > div {\
	-webkit-animation: pb-flash-light 800ms ease-out 250ms infinite;\
	animation: pb-flash-light 800ms ease-in-out 250ms infinite;\
}\
.ecwid-pb-placeholder--light.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(3) .ecwid-pb-placeholder__product {\
	-webkit-animation: pb-flash-light 800ms ease-out 333ms infinite;\
	animation: pb-flash-light 800ms ease-in-out 333ms infinite;\
}\
.ecwid-pb-placeholder--light.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(3) .ecwid-pb-placeholder__title > div {\
	-webkit-animation: pb-flash-light 800ms ease-out 416ms infinite;\
	animation: pb-flash-light 800ms ease-in-out 416ms infinite;\
}\
\
/* PB placehoder dark */\
\
.ecwid-pb-placeholder--dark .ecwid-pb-placeholder__grid-cell .ecwid-pb-placeholder__product,\
.ecwid-pb-placeholder--dark .ecwid-pb-placeholder__grid-cell .ecwid-pb-placeholder__title > div {\
	background-color: rgba(255,255,255,.1);\
}\
.ecwid-pb-placeholder--dark.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(1) .ecwid-pb-placeholder__product {\
	-webkit-animation: pb-flash-dark 800ms ease-out 0ms infinite;\
	animation: pb-flash-dark 800ms ease-in-out 0ms infinite;\
}\
.ecwid-pb-placeholder--dark.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(1) .ecwid-pb-placeholder__title > div {\
	-webkit-animation: pb-flash-dark 800ms ease-out 83ms infinite;\
	animation: pb-flash-dark 800ms ease-in-out 83ms infinite;\
}\
.ecwid-pb-placeholder--dark.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(2) .ecwid-pb-placeholder__product {\
	-webkit-animation: pb-flash-dark 800ms ease-out 167ms infinite;\
	animation: pb-flash-dark 800ms ease-in-out 167ms infinite;\
}\
.ecwid-pb-placeholder--dark.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(2) .ecwid-pb-placeholder__title > div {\
	-webkit-animation: pb-flash-dark 800ms ease-out 250ms infinite;\
	animation: pb-flash-dark 800ms ease-in-out 250ms infinite;\
}\
.ecwid-pb-placeholder--dark.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(3) .ecwid-pb-placeholder__product {\
	-webkit-animation: pb-flash-dark 800ms ease-out 333ms infinite;\
	animation: pb-flash-dark 800ms ease-in-out 333ms infinite;\
}\
.ecwid-pb-placeholder--dark.ecwid-pb-placeholder--animate .ecwid-pb-placeholder__grid-cell:nth-child(3) .ecwid-pb-placeholder__title > div {\
	-webkit-animation: pb-flash-dark 800ms ease-out 416ms infinite;\
	animation: pb-flash-dark 800ms ease-in-out 416ms infinite;\
}\
@-webkit-keyframes pb-flash-light {\
	0% { background-color: rgba(0,0,0,.03); }\
	30% { background-color: rgba(0,0,0,.047); }\
	100% { background-color: rgba(0,0,0,.03); }\
}\
@keyframes pb-flash-light {\
	0% { background-color: rgba(0,0,0,.03); }\
	30% { background-color: rgba(0,0,0,.047); }\
	100% { background-color: rgba(0,0,0,.03); }\
}\
@-webkit-keyframes pb-flash-dark {\
	0% { background-color: rgba(255,255,255,.06); }\
	30% { background-color: rgba(255,255,255,.1); }\
	100% { background-color: rgba(255,255,255,.1); }\
}\
@keyframes pb-flash-dark {\
	0% { background-color: rgba(255,255,255,.06); }\
	30% { background-color: rgba(255,255,255,.1); }\
	100% { background-color: rgba(255,255,255,.06); }\
}\
</style>\
\
<div class="ecwid-pb-placeholder" id="ecwidStorefrontPlaceholder">\
	<div class="ecwid-pb-placeholder__grid">\
		<div class="ecwid-pb-placeholder__grid-cell">\
			<div class="ecwid-pb-placeholder__product"></div><div class="ecwid-pb-placeholder__title"><div></div><div></div><div></div></div>\
		</div><div class="ecwid-pb-placeholder__grid-cell">\
			<div class="ecwid-pb-placeholder__product"></div><div class="ecwid-pb-placeholder__title"><div></div><div></div><div></div></div>\
		</div><div class="ecwid-pb-placeholder__grid-cell">\
			<div class="ecwid-pb-placeholder__product"></div><div class="ecwid-pb-placeholder__title"><div></div><div></div><div></div></div>\
		</div>\
	</div><div class="ecwid-pb-placeholder__grid">\
		<div class="ecwid-pb-placeholder__grid-cell">\
			<div class="ecwid-pb-placeholder__product"></div><div class="ecwid-pb-placeholder__title"><div></div><div></div><div></div></div>\
		</div><div class="ecwid-pb-placeholder__grid-cell">\
			<div class="ecwid-pb-placeholder__product"></div><div class="ecwid-pb-placeholder__title"><div></div><div></div><div></div></div>\
		</div><div class="ecwid-pb-placeholder__grid-cell">\
			<div class="ecwid-pb-placeholder__product"></div><div class="ecwid-pb-placeholder__title"><div></div><div></div><div></div></div>\
		</div>\
	</div>\
</div>';
			var element = document.createElement("div")
			element.innerHTML = html;
			var e = document.getElementById(id);
			if (e) {
				e.appendChild(element);
			}
(function() {
	var getRGB = function(b){
		var a;
		if (b && b.constructor==Array && b.length==3)
			return b;
		if (a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))
			return [parseInt(a[1]),parseInt(a[2]),parseInt(a[3])];
		if (a=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b))
			return [parseFloat(a[1])*2.55,parseFloat(a[2])*2.55,parseFloat(a[3])*2.55];
		if (a=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b))
			return [parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)];
		if (a=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b))
			return [parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)];
		return false;
	}

	var getLuminance = function(color){
		var rgb = getRGB(color);
		return (rgb) ? 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] : false;
	}

	var getBackgroundColor = function(el){
		var bg = getStyle(el, 'background-color');
		while (!bg || bg == 'transparent' || bg == 'rgba(0, 0, 0, 0)'){
			if (el == document.body)
				bg = '#fff';
			else {
				el = el.parentNode;
				bg = getStyle(el, 'background-color');
			}
		}
		return bg;
	}

	var isDark = function(el){
		var color = getStyle(el, 'color');
		var bg = getBackgroundColor(el);
		return (getLuminance(color) > getLuminance(bg)) ? true : false;
	}

	var getStyle = function(el, cssRule){
		var val = '';
		if(document.defaultView && document.defaultView.getComputedStyle){
			val = document.defaultView.getComputedStyle(el, '').getPropertyValue(cssRule);
		}
		else if(el.currentStyle){
			cssRule = cssRule.replace(/\-(\w)/g, function (m, p){
				return p.toUpperCase();
			});
			val = el.currentStyle[cssRule];
		}
		return val;
	}

	var placeholder = document.querySelector('.ecwid-pb-placeholder'),
		grid = placeholder.querySelector('.ecwid-pb-placeholder__grid'),
		skin = (isDark(grid)) ? 'ecwid-pb-placeholder--dark' : 'ecwid-pb-placeholder--light';

	placeholder.className += ' ecwid-pb-placeholder--animate '+ skin;

})();		}
		window.ecwid_loader_shown = true;
	}
}
function xAddToBag() {
    xAddWidget("AddToBag", arguments);
}
function xProductThumbnail() {
    xAddWidget("ProductThumbnail", arguments);
}
function xLoginForm() {
	xAddWidget("LoginForm", arguments);
}
function xMinicart() {
	xAddWidget("Minicart", arguments);
}
function xCategories() {
	xAddWidget("Categories", arguments);
}
function xVCategories() {
	xAddWidget("VCategories", arguments);
}
function xCategoriesV2() {
	xAddWidget("CategoriesV2", arguments);
}
function xSearchPanel() {
	xAddWidget("SearchPanel", arguments);
}
function xSearch() {
	xAddWidget("SearchWidget", arguments);
}
function xGadget() {
	xAddWidget("Gadget", arguments);
}
	
function xSingleProduct() {
	xAddWidget("SingleProduct", arguments)
}

	function xProduct() {
		xAddWidget("Product", arguments)
	}


function xAffiliate(id) { Ecwid.affiliateId = id; }

if (typeof xInitialized == 'function') xInitialized();
}


} catch (e) {
    function xReportError(msg) {
		var html = '<div style="font-family:sans-serif;"><div style="padding:30px 20px;max-width:500px;word-wrap: break-word;margin:0 auto;border-radius:5px;box-shadow:0 10px 35px rgba(0, 0, 0, 0.15);box-sizing:border-box;background-color:#fff;"><div style="font-size:15px;line-height:1.8em;margin:16px;">' + msg + '</div></div></div><br/>';

		var element = document.createElement("div");
		element.innerHTML = html;
		document.body.appendChild(element);
    }

	var commonError = "The store cannot be loaded in your browser because of some JavaScript errors, sorry. Below here's the exact error occurred.";

	var bodyTagError = "This document doesn't contain the required " +
			"<a href='http://www.htmldog.com/reference/htmltags/body/'>&lt;body&gt; and &lt;/body&gt;</a> "+
            "tags. Thus your Ecwid store cannot be loaded. " +
            "Please add these tags and refresh the page. This message will disappear and you will see your store.";

	var isWindowsMobile2005 = /(msie 4).*(windows ce)/i.test(navigator.userAgent);

    if (!document.body && !isWindowsMobile2005)  {
        xReportError(bodyTagError);
	} else {
		xReportError(commonError + '<br/><br/>Error: <i>' + e.message + '</i>');
	}

	throw e;
}
