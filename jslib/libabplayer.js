/***********************
* ABPlayer HTML5 Core JS Library
* Version : 1.01 Rev 20120110
* == Licensed Under the MIT License : /LICENSING
* Copyright (c) 2012 Jim Chen ( CQZ, Jabbany )
************************/
//Globally used methods
var ABGlobal = {
	binsert:function(where,what,how){
		var pIndex = ABGlobal.bsearch(where,what,how);
		where.splice(pIndex,0,what);
		return pIndex;
	},
	bsearch:function(where,what,how){
		if(where.length == 0)
			return 0;
		if(how(what,where[0])<0)
			return 0;
		if(how(what,where[where.length - 1]) >=0)
			return where.length;
		var low =0;
		var i = 0;
		var count = 0;
		var high = where.length - 1;
		while(low<=high){
			i = Math.floor((high + low + 1)/2);
			count++;
			if(how(what,where[i-1])>=0 && how(what,where[i])<0){
				return i;
			}else if(how(what,where[i-1])<0){
				high = i-1;
			}else if(how(what,where[i])>=0){
				low = i;
			}else{
				alert('Program Error');
			}
			if(count > 1500){
				alert('Too many Comments');
				break;
			}
		}
		return -1;
	},
	is_webkit:function(){
		try{
			if(/webkit/.test( navigator.userAgent.toLowerCase())){
				return true;
			}
		}catch(e){
			return false;
		}
		return false;
	}
};
function CommentManager(stageObject,timeline){
	var cmTimer = 0;
	this.stage = stageObject;
	this.timeline = [];
	this.runline = [];
	this.position = 0;
	this.lastPos = 0;
	this.filter = {doValidate:function(smth){return true;}};
	this.csa = {
		scroll: new CommentSpaceAllocator(0,0),
		top:new TopCommentSpaceAllocator(0,0),
		bottom:new BottomCommentSpaceAllocator(0,0),
		reverse:new ReverseCommentSpaceAllocator(0,0)
	};
	this.initTimeline = function(){
		//Order the timeline
		this.timeline.sort(function(a,b){
			if(a.stime > b.stime)
				return 2;
			else if(a.stime < b.stime)
				return -2;
			else{
				if(a.date > b.date){
					return 1;
				}else if(a.date < b.date){
					return -1;
				}else
					return 0;
			}
		});
	};
	this.init = function(){
		//Init the CSAs
		this.csa.scroll.setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
		this.csa.top.setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
		this.csa.bottom.setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
		this.csa.reverse.setBounds(this.stage.offsetWidth,this.stage.offsetHeight);
		this.startTimer();
	};
	this.seek = function (time){
		this.position = ABGlobal.bsearch(this.timeline,time,function(a,b){
			if(a < b.stime)
				return -1
			else if(a > b.stime)
				return 1;
			else 
				return 0;
		});
	};
	this.clear = function (){
		for(var i=0;i<this.runline.length;i++){
			this.finish(this.runline[i]);
			this.stage.removeChild(this.runline[i]);
		}
		this.runline = [];
	};
	this.validate = function(cmtData){
		/** TODO: improve filters **/
		if(cmtData == null)
			return false;
		return this.filter.doValidate(cmtData);
	};
	this.time = function(time){
		time = time - 1;
		if(this.position >= this.timeline.length || Math.abs(this.lastPos - time) >= 2000){
			this.seek(time);
			//this.clear();
			this.lastPos = time;
			if(this.timeline.length <= this.position)
				return;
		}else{
			this.lastPos = time;
		}
		for(;this.position < this.timeline.length;this.position++){
			if(this.validate(this.timeline[this.position]) && this.timeline[this.position]['stime']<=time)
				this.sendComment(this.timeline[this.position]);
			else
				break;
		}
	};
	this.sendComment = function(data){
		var cmt = document.createElement('div');
		cmt.className = 'cmt';
		if(ABGlobal.is_webkit()){
			cmt.className+=" webkit-helper";
		}
		cmt.stime = data.stime;
		cmt.mode = data.mode;
		cmt.data = data;
		cmt.innerText = data.text;
		cmt.style.fontSize = data.size + "px";
		if(data.color != null)
			cmt.style.color = data.color;
		this.stage.appendChild(cmt);
		cmt.style.width = (cmt.offsetWidth + 1) + "px";
		cmt.style.height = (cmt.offsetHeight + 1) + "px";
		cmt.style.left = this.stage.offsetWidth + "px";
		cmt.ttl = 4000;
		switch(cmt.mode){
			default:
			case 1:{this.csa.scroll.add(cmt);}break;
			case 4:{this.csa.bottom.add(cmt);}break;
			case 5:{this.csa.top.add(cmt);}break;
			case 6:{this.csa.reverse.add(cmt);}break;
			case 7:{
				cmt.style.top = data.y + "px";
				cmt.style.left = data.x + "px";
				cmt.ttl = data.duration;
				cmt.dur = data.duration;
				if(data.rY!=0 || data.rZ!=0){
					/** TODO: revise when browser manufacturers make up their mind on Transform APIs **/
					cmt.style.transform = "rotateY(" + data.rY + "deg)";
					cmt.style.transform = "rotateZ(" + data.rZ + "deg)";
					cmt.style.webkitTransform = "rotateY(" + data.rY + "deg)";
					cmt.style.webkitTransform = "rotateZ(" + data.rZ + "deg)";
					cmt.style.OTransform = "rotateY(" + data.rY + "deg)";
					cmt.style.OTransform = "rotateZ(" + data.rZ + "deg)";
					cmt.style.MozTransform = "rotateY(" + data.rY + "deg)";
					cmt.style.MozTransform = "rotateZ(" + data.rZ + "deg)";
				}
			}break;
		}
		if(data.border)
			cmt.style.border = "1px solid #00ffff";
		this.runline.push(cmt);
	};
	this.finish = function(cmt){
		switch(cmt.mode){
			default:
			case 1:{this.csa.scroll.remove(cmt);}break;
			case 4:{this.csa.bottom.remove(cmt);}break;
			case 5:{this.csa.top.remove(cmt);}break;
			case 6:{this.csa.reverse.remove(cmt);}break;
			case 7:break;
		}
	};
	this.startTimer = function(){
		if(cmTimer > 0)
			return;
		var lastTimingInterval = new Date().getTime();
		var cmObj = this;
		cmTimer = setInterval(function(){
			var timePassed = new Date().getTime() - lastTimingInterval;
			lastTimingInterval = new Date().getTime();
			for(var i=0;i<cmObj.runline.length;i++){
				var cmt = cmObj.runline[i];
				cmt.ttl -= timePassed;
				if(cmt.mode == 1){
					cmt.style.left = (cmt.ttl / 4000) * (cmObj.stage.offsetWidth + cmt.offsetWidth) - cmt.offsetWidth + "px";
				}else if(cmt.mode == 6){
					cmt.style.left = (1 - cmt.ttl / 4000) * (cmObj.stage.offsetWidth + cmt.offsetWidth) - cmt.offsetWidth + "px";
				}else if(cmt.mode == 4 || cmt.mode == 5 || cmt.mode >= 7){
					if(cmt.dur == null)
						cmt.dur = 4000;
					if(cmt.data.alphaFrom != null && cmt.data.alphaTo != null){
						cmt.style.opacity = (cmt.data.alphaFrom - cmt.data.alphaTo) * (cmt.ttl/cmt.dur) + cmt.data.alphaTo;
					}
					if(cmt.mode == 7 && cmt.data.movable){
						cmt.style.top = ((cmt.data.toY - cmt.data.y) * (1 - cmt.ttl / cmt.dur) + parseInt(cmt.data.y)) + "px";
						cmt.style.left = ((cmt.data.toX - cmt.data.x) * (1 - cmt.ttl  / cmt.dur) + parseInt(cmt.data.x)) + "px";
					}
				}
				if(cmt.ttl <= 0){
					cmObj.stage.removeChild(cmt);
					cmObj.runline.splice(i,1);//remove the comment
					cmObj.finish(cmt);
				}
			}
		},10);
	};
	this.stopTimer = function(){
		clearInterval(cmTimer);
		cmTimer = 0;
	};
}
function CommentFilter(){
	this.rulebook = [];
	this.allowTypes = [0,true,true,true,true,true,true,true,true,true];
	this.doValidate = function(cmtData){
		if(this.allowTypes[cmtData.mode]!=true)
			return false;
		return true;
	}
}

function CommentSpaceAllocator(w,h){
	this.width = w;
	this.height = h;
	this.dur = 4000;
	this.pools = [[]];
	this.pool = this.pools[0];
	this.setBounds = function(w,h){this.width = w;this.height = h;};
	this.add = function(cmt){
		if(cmt.height >= this.height){
			cmt.cindex = this.pools.indexOf(this.pool);
			cmt.style.top = "0px";
		}else{
			cmt.cindex = this.pools.indexOf(this.pool);
			cmt.style.top = this.setY(cmt) + "px";
		}
	};
	this.remove = function(cmt){
		var tpool = this.pools[cmt.cindex];
		var n = tpool.indexOf(cmt);
		tpool.splice(n,1);
	};
	this.validateCmt = function(cmt){
		cmt.bottom = cmt.offsetTop + cmt.offsetHeight;
		cmt.y = cmt.offsetTop;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.width = cmt.offsetWidth;
		cmt.top = cmt.offsetTop;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	this.setY = function(cmt,index){
		if(!index)
			var index = 0;
		cmt = this.validateCmt(cmt);
		if(this.pools.length <= index){
			this.pools.push([]);
		}
		this.pool = this.pools[index];
		if(this.pool.length == 0){
			this.pool.push(cmt);	
			return 0;
		}
		else if(this.vCheck(0,cmt)){
			ABGlobal.binsert(this.pool,cmt,function(a,b){
					if(a.bottom < b.bottom){
						return -1;
					}else if (a.bottom == b.bottom){
						return 0;
					}else{return 1;}
				});
			return cmt.y;
		}
		var y=0;
		for(var k=0;k<this.pool.length;k++){
			y = this.pool[k].bottom + 1;
			if(y + cmt.offsetHeight > this.height){
				break;
			}
			if(this.vCheck(y,cmt)){
				ABGlobal.binsert(this.pool,cmt,function(a,b){
					if(a.bottom < b.bottom){
						return -1;
					}else if (a.bottom == b.bottom){
						return 0;
					}else{return 1;}
				});
				return cmt.y;
			}
		}
		this.setY(cmt,index+1);
	};
	this.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		var right = cmt.x + cmt.width;
		this.validateCmt(cmt);
		for(var i=0;i<this.pool.length;i++){
			this.pool[i] = this.validateCmt(this.pool[i]);
			if(this.pool[i].y > bottom || this.pool[i].bottom < y)
				continue;
			else if(this.pool[i].right < cmt.x || this.pool[i].x > right){
				if(this.getEnd(this.pool[i]) < this.getMiddle(cmt))
					continue;
				else
					return false;
			}else{
				return false;}
		}
		cmt.y = y;
		cmt.bottom = cmt.height + y;
		return true;
	};
	this.getEnd  = function(cmt){
		return cmt.stime + this.dur;
	};
	this.getMiddle = function(cmt){
		return cmt.stime + (this.dur / 2);
	};
}
function TopCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.add = function (cmt){
		csa.validateCmt(cmt);
		cmt.style.left = (csa.width - cmt.width)/2 + "px";
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.top = "0px";
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.top = csa.setY(cmt) + "px";
		}
	};
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		for(var i=0;i<csa.pool.length;i++){
			var c = csa.validateCmt(csa.pool[i]);
			if(c.y > bottom || c.bottom < y){
				continue;
			}else{
				return false;
			}
		}
		cmt.y = y;
		cmt.bottom = cmt.bottom + y;
		return true;
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function BottomCommentSpaceAllocator(w,h){
	var csa = new CommentSpaceAllocator(w,h);
	csa.add = function (cmt){
		cmt.style.top = "";
		cmt.style.bottom = "0px";
		csa.validateCmt(cmt);
		cmt.style.left = (csa.width - cmt.width)/2 + "px";
		if(cmt.height >= csa.height){
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = "0px";
		}else{
			cmt.cindex = csa.pools.indexOf(csa.pool);
			cmt.style.bottom = csa.setY(cmt) + "px";
		}
	};
	csa.validateCmt = function(cmt){
		cmt.y = csa.height - (cmt.offsetTop + cmt.offsetHeight);
		cmt.bottom = cmt.y + cmt.offsetHeight;
		cmt.x = cmt.offsetLeft;
		cmt.right = cmt.offsetLeft + cmt.offsetWidth;
		cmt.height = cmt.offsetHeight;
		cmt.width = cmt.offsetWidth;
		cmt.top = cmt.y;
		cmt.left = cmt.offsetLeft;
		return cmt;
	};
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		for(var i=0;i<csa.pool.length;i++){
			var c = csa.validateCmt(csa.pool[i]);
			if(c.y > bottom || c.bottom < y){
				continue;
			}else{
				return false;
			}
		}
		cmt.y = y;
		cmt.bottom = cmt.bottom + y;
		return true;
	};
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}
function ReverseCommentSpaceAllocator(w,h){
	var csa= new CommentSpaceAllocator(w,h);
	csa.vCheck = function(y,cmt){
		var bottom = y + cmt.height;
		var right = cmt.x + cmt.width;
		this.validateCmt(cmt);
		for(var i=0;i<this.pool.length;i++){
			var c = this.validateCmt(this.pool[i]);
			if(c.y > bottom || c.bottom < y)
				continue;
			else if(c.x > right || c.right < cmt.x){
				if(this.getEnd(c) < this.getMiddle(cmt))
					continue;
				else
					return false;
			}else{
				return false;}
		}
		cmt.y = y;
		cmt.bottom = cmt.height + y;
		return true;
	}
	this.setBounds = function(w,h){csa.setBounds(w,h);};
	this.add = function(what){csa.add(what);};
	this.remove = function(d){csa.remove(d);};
}