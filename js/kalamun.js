/* (c) Kalamun.org - GNU/GPL 3 */

var kBrowser={
	IE:!!(window.attachEvent&&!window.opera),
	IE4:navigator.userAgent.indexOf('MSIE 4')>-1,
	IE5:navigator.userAgent.indexOf('MSIE 5')>-1,
	IE6:navigator.userAgent.indexOf('MSIE 6')>-1,
	IE7:navigator.userAgent.indexOf('MSIE 7')>-1,
	IE8:navigator.userAgent.indexOf('MSIE 8')>-1,
	IE9:navigator.userAgent.indexOf('MSIE 9')>-1,
	OP:!!window.opera,
	SF:navigator.userAgent.indexOf('Safari')>-1,
	FF:navigator.userAgent.indexOf('Gecko')>-1&&navigator.userAgent.indexOf('Safari')==-1
	};

kAddEvent=function(obj,event,func,model) {
	if(!model) model=true;
	if(obj.addEventListener) return obj.addEventListener(event,func,model);
	if(obj.attachEvent) return obj.attachEvent('on'+event,func);
	return false;
	}
kGetPosition=function(obj) {
	var pos=Array();
	pos['left']=0;
	pos['top']=0;
	if(obj) {
		while(obj.offsetParent) {
			pos['left']+=obj.offsetLeft-obj.scrollLeft;
			pos['top']+=obj.offsetTop-obj.scrollTop;
			var tmp=obj.parentNode;
			while(tmp!=obj.offsetParent) {
				pos['left']-=tmp.scrollLeft;
				pos['top']-=tmp.scrollTop;
				tmp=tmp.parentNode;
				}
			obj=obj.offsetParent;
			}
		pos['left']+=obj.offsetLeft;
		pos['top']+=obj.offsetTop;
		}
	return {x:pos['left'],y:pos['top']};
	}

kWindow=new function() {
	this.filterResults=function(win,docel,body) {
		var result=win?win:0;
		if(docel&&(!result||(result>docel))) result=docel;
		return body&&(!result||(result>body))?body:result;
		}

	// size
	this.clientWidth=function() {
		return this.filterResults(window.innerWidth?window.innerWidth:0,document.documentElement?document.documentElement.clientWidth:0,document.body?document.body.clientWidth:0);
		}
	this.clientHeight=function() {
		return this.filterResults(window.innerHeight?window.innerHeight:0,document.documentElement?document.documentElement.clientHeight:0,document.body?document.body.clientHeight:0);
		}
	this.pageWidth=function() {
		if(window.innerHeight&&window.scrollMaxY) ww=window.innerWidth+window.scrollMaxX; //FF
		else if(document.body.scrollHeight>document.body.offsetHeight) ww=document.body.scrollWidth; //all but IE Mac
		else ww=document.body.offsetWidth; //IE 6 Strict, Mozilla (not FF), Safari
		return ww;
		}
	this.pageHeight=function() {
		if(window.innerHeight&&window.scrollMaxY) yy=window.innerHeight+window.scrollMaxY; //FF
		else if(document.body.scrollHeight>document.body.offsetHeight) yy=document.body.scrollHeight; //all but IE Mac
		else yy=document.body.offsetHeight; //IE 6 Strict, Mozilla (not FF), Safari
		return yy;
		}

	// scroll
	this.scrollLeft=function() {
		return this.filterResults(window.pageXOffset?window.pageXOffset:0,document.documentElement?document.documentElement.scrollLeft:0,document.body?document.body.scrollLeft:0);
		}
	this.scrollTop=function() {
		return this.filterResults(window.pageYOffset?window.pageYOffset:0,document.documentElement?document.documentElement.scrollTop:0,document.body ? document.body.scrollTop:0);
		}

	// mouse
	this.mousePos={x:0,y:0};
	this.elementOver=null;
}


/* AJAX */
kAjax=function() {
	var onSuccess=function(txt) {};;
	var onFail=function(txt) {};;
	var ajaxObj=null;
	var method="get";
	var uri="";
	var vars="";

	this.send=function(vmethod,vuri,vvars) {
		method=vmethod.toLowerCase();
		uri=vuri;
		vars=vvars;
		ajaxSend();
		}
	this.onSuccess=function(func) { onSuccess=func }
	this.onFail=function(func) { onFail=func; }

	function createXMLHttpRequest() {
		var XHR=null;
		if(typeof(XMLHttpRequest)==="function"||typeof(XMLHttpRequest)==="object") XHR=new XMLHttpRequest(); //browser standard
		else if(window.ActiveXObject&&!kBrowser.IE4) { //ie4, BLOCCATO
			if(kBrowser.IE5) XHR=new ActiveXObject("Microsoft.XMLHTTP"); //ie5.x: metodo diverso
			else XHR=new ActiveXObject("Msxml2.XMLHTTP"); //ie6: metodo diverso
			}
		return XHR;
		}
	function onStateChange() {
		if(ajaxObj.readyState===4) {
			if(ajaxObj.status==200) onSuccess(ajaxObj.responseText,ajaxObj.responseXML);
			else onFail(ajaxObj.status);
			}
		}
	function ajaxSend() {
		ajaxObj=createXMLHttpRequest();
		if(method=="get") {
			uri+="?"+vars;
			ajaxObj.open(method,uri,true);
			ajaxObj.onreadystatechange=onStateChange;
			ajaxObj.send(null);
			}
		else if(method=="post") {
			ajaxObj.open(method,uri,true);
			ajaxObj.setRequestHeader("content-type","application/x-www-form-urlencoded");
			ajaxObj.onreadystatechange=onStateChange;
			ajaxObj.send(vars);
			}
		delete ajaxObj;
		}	
	}


function easeIn(value,totalSteps,actualStep,pwr) { 
	totalSteps=Math.max(totalSteps,actualStep,1);
	var step=Math.pow(((1/totalSteps)*actualStep),pwr)*(value);
	return Math.ceil(step);
	}
function easeOut(value,totalSteps,actualStep,pwr) { 
	totalSteps=Math.max(totalSteps,actualStep,1);
	var step=value-(Math.pow(((1/totalSteps)*(totalSteps-actualStep)),pwr)*(value));
	return Math.ceil(step);
	}
function easeInOut(value,totalSteps,actualStep,pwr) { 
	totalSteps=Math.max(totalSteps,actualStep,1);
	var p1=Math.ceil(totalSteps/2);
	var p2=totalSteps-p1;
	var p1a=Math.min(actualStep,p1);
	var p2a=actualStep-p1a;
	var step=Math.pow(((1/p1)*p1a),pwr)*(value/2);
	if(p2a>0) step+=value/2-(Math.pow(((1/p2)*(p2-p2a)),pwr)*(value/2));
	return Math.ceil(step);
	}

	
function scrollTo(Y, duration, easingFunction, callback) {
    var start = Date.now(),
    	elem = document.documentElement.scrollTop?document.documentElement:document.body,
    	from = elem.scrollTop;

    if(from === Y) {
        callback();
        return; /* Prevent scrolling to the Y point if already there */
    }

    function min(a,b) {
    	return a<b?a:b;
    }

    function scroll(timestamp) {

        var currentTime = Date.now(),
            time = min(1, ((currentTime - start) / duration)),
            easedT = easingFunction(time);

        elem.scrollTop = (easedT * (Y - from)) + from;

        if(time < 1) requestAnimationFrame(scroll);
        else
            if(callback) callback();
    }
    requestAnimationFrame(scroll)
}

/* bits and bytes of the scrollTo function inspired by the works of Benjamin DeCock */

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
var easing = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

/* Add the following to you main js file

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}()); */