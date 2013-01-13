function BilibiliInteraction(){
	this.apiKey = '';
	this.fetchInfo = function (avid,page){
		if(avid == null)
			return;
		if(page == null)
			page = 1;
		var selfref = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				selfref.doCallback(xhr.responseText,selfref.callback);
			}
		};
		var url = 'http://api.bilibili.tv/view?type=json&id=' + avid + '&appkey=' + this.apiKey + '&page=' + page;
		xhr.open("GET",'corsproxy.php?addr=' + encodeURIComponent(url),true);
		xhr.send();
	};
	this.fetchFeedback = function(avid,page){
		if(avid == null)
			return;
		if(page == null)
			page = 1;
		var url = 'http://api.bilibili.tv/feedback?type=json&aid=' + avid + '&page=' + page + '&appkey=' + this.apiKey;
		var selfref = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				selfref.doCallback(xhr.responseText,selfref.callbackComments);
			}
		};
		xhr.open("GET",'corsproxy.php?addr=' + encodeURIComponent(url),true);
		xhr.send();
	};
	this.fetchPlayUrl = function(playKey,cb){
		var url = "http://interface.bilibili.tv/playurl?type=mp4&otype=json&cid=" + playKey;
		var xhr = new XMLHttpRequest();
		var selfref = this;
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				selfref.doCallback(xhr.responseText,cb);
			}
		}
		xhr.open("GET","corsproxy.php?addr=" + encodeURIComponent(url), true);
		xhr.send();
	};
	this.doCallback = function(rt,cb){
		if(rt == null || rt == 'error'){
			console.log('Error : ' + rt);
			return;
		}
		var aob = JSON.parse(rt);
		cb(aob);
	};
}

function $(ex){
	return document.getElementById(ex);
}
function _(type,init,inner){
	var elem = document.createElement(type);
	for(var i in init){
		if(i=='style'){
			for(var j in init[i]){
				elem.style[j] = init[i][j];
			}
		}else
			elem[i] = init[i];
	}
	if(inner!=null)
		elem.appendChild(inner);
	return elem;
}

function _cb(requestUrl,callback){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			callback(xhr);
		}
	};
	xhr.open("GET",requestUrl,true);
	xhr.send();
}

function VideoController(video){
	var self = this;
	this.v = video;
	this.clock = 0;
	this.monitor = function(t){console.log(t);};
	this.startClock = function(){
		var self = this;
		this.clock =setInterval(function(){
			self.monitor(self.v.currentTime * 1000);
		},10);
	};
	this.stopClock = function(){
		clearInterval(this.clock);
	};
	this.pause = function(){
		this.v.pause();
		this.stopClock();
	};
	this.play = function(){
		try{
			this.stopClock();
		}catch(e){}
		this.v.play();
		this.startClock();
	};
	this.togglePlay = function(callback){
		if(callback==null)
			callback = function(param){console.log('Uncaught toggle!');};//Snub it
		if(!this.v.paused){
			this.pause();
			callback('paused');
		}else{
			this.play();
			callback('playing');
		}
	};
	this.v.addEventListener('play',function(){
		self.startClock();
	});
	this.v.addEventListener('ended',function(){
		self.stopClock();
	});
	this.v.addEventListener('pause',function(){
		self.stopClock();
	});
}