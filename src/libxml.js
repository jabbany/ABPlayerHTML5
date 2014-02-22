/***********************
* XMLParser
* == Licensed Under the MIT License : /LICENSING
* Copyright (c) 2012 Jim Chen ( CQZ, Jabbany )
************************/
function CommentLoader(url,xcm,callback){
	if(callback == null)
		callback = function(){return;};
	var xmlhttp = null;
	if (window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
	var cm = xcm;
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			if(navigator.appName == 'Microsoft Internet Explorer'){
				var f = new ActiveXObject("Microsoft.XMLDOM");
				f.async = false;
				f.loadXML(xmlhttp.responseText);
				cm.load(BilibiliParser(f));
				callback();
			}else{
				cm.load(BilibiliParser(xmlhttp.responseXML));
				callback();
			}
		}
	}
}
function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}
