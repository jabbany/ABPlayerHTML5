var ABP = {};
(function(){
	"use strict";
	if(!ABP) return;
	var $ = function (e) { return document.getElementById(e); };
	var _ = function (type, props, children, callback) {
		var elem = null;
		if (type === "text") {
			return document.createTextNode(props);
		} else {
			elem = document.createElement(type);
		}
		for(var n in props){
			if(n !== "style"){
				elem.setAttribute(n, props[n]);
			}else{
				for(var x in props.style){
					elem.style[x] = props.style[x];
				}
			}
		}
		if (children) {
			elem.appendChild(children);
		}
		if (callback && typeof callback === "function") {
			callback(elem);
		}
		return elem;
	};
	ABP.create = function (element) {
		var elem = element;
		if (typeof element === "string") {
			elem = $(element);
		}
		elem.appendChild(_("div",{
			"className":"ABPlayer",
		},_("div",{}),));
		
	}
})()
