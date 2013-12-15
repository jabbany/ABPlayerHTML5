var ABP = {
	"version":"0.8.0"
};

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
			if(n !== "style" && n !== "className"){
				elem.setAttribute(n, props[n]);
			}else if(n === "className"){
				elem.className = props[n];
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
	var addClass = function(elem, className){
		if(elem == null) return;
		var oldClass = elem.className.split(" ");
		if(oldClass.indexOf(className) < 0){
			oldClass.push(className);
		}
		elem.className = oldClass.join(" ");
	};
	var hasClass = function(elem, className){
		if(elem == null) return false;
		var oldClass = elem.className.split(" ");
		return oldClass.indexOf(className) >= 0;
	}
	var removeClass = function(elem, className){
		if(elem == null) return;
		var oldClass = elem.className.split(" ");
		if(oldClass.indexOf(className) >= 0){
			oldClass.splice(oldClass.indexOf(className),1);
		}
		elem.className = oldClass.join(" ");
	};
	var bulidFromDefaults = function (n, d){
		var r = {};
		for(var i in d){
			if(n && typeof n[i] !== "undefined")
				r[i] = n[i];
			else
				r[i] = d[i];
		}
		return r;
	}
	
	
	ABP.create = function (element) {
		var elem = element;
		if (typeof element === "string") {
			elem = $(element);
		}
		
	}
	
	ABP.load = function (inst, videoProvider, commentProvider, commentReceiver){
	
	};
	
	ABP.bind = function (playerUnit, mobile, state) {
		var ABPInst = {
			btnPlay:null,
			barTime:null,
			barLoad:null,
			divComment:null,
			btnFull:null,
			btnDm:null,
			video:null,
			divTextField:null,
			txtText:null,
			cmManager:null,
			defaults:{
				w:0,
				h:0
			},
			state:bulidFromDefaults(state, {
				fullscreen: false,
				commentVisible: true,
				allowRescale: false
			}),
			createPopup:function(text, delay){
				if(playerUnit.hasPopup === true)
					return false;
				var p = _("div", {
					"className":"ABP-Popup"
				},_("text",text));
				p.remove = function(){
					if(p.isRemoved)	return;
					p.isRemoved = true;
					playerUnit.removeChild(p);
					playerUnit.hasPopup = false;
				};
				playerUnit.appendChild(p);
				playerUnit.hasPopup = true;
				if(typeof delay === "number"){
					setTimeout(function(){
						p.remove();
					},delay);
				}
				return p;
			},
			removePopup:function(){
				var pops = playerUnit.getElementsByClassName("ABP-Popup");
				for(var i = 0; i < pops.length; i++){
					if(pops[i].remove != null){
						pops[i].remove();
					}else{
						pops[i].parentNode.removeChild(pops[i]);
					}
				}
				playerUnit.hasPopup = false;
			},
		};
		if(playerUnit === null || playerUnit.getElementsByClassName === null) return;
		ABPInst.defaults.w = playerUnit.offsetWidth; 
		ABPInst.defaults.h = playerUnit.offsetHeight;
		var _v = playerUnit.getElementsByClassName("ABP-Video");
		if(_v.length <= 0) return;
		var video = null;
		for(var i in _v[0].children){
			if(_v[0].children[i].tagName != null &&
				_v[0].children[i].tagName.toUpperCase() === "VIDEO"){
				video = _v[0].children[i];
				break;
			}
		}
		if(_v[0] && mobile){
			_v[0].style.bottom="0px";
		}
		var cmtc = _v[0].getElementsByClassName("ABP-Container");
		if(cmtc.length > 0)
			ABPInst.divComment = cmtc[0];
		if(video === null) return;
		ABPInst.video = video;
		/** Bind the Play Button **/
		var _p = playerUnit.getElementsByClassName("ABP-Play");
		if(_p.length <= 0) return;
		ABPInst.btnPlay = _p[0];
		/** Bind the Loading Progress Bar **/
		var pbar = playerUnit.getElementsByClassName("progress-bar");
		if(pbar.length <= 0) return;
		ABPInst.barHitArea = pbar[0];
		var pbars = pbar[0].getElementsByClassName("bar");
		ABPInst.barTime = pbars[0];
		ABPInst.barLoad = pbars[1];
		/** Bind the FullScreen button **/
		var fbtn = playerUnit.getElementsByClassName("ABP-FullScreen");
		if(fbtn.length <= 0) return;
		ABPInst.btnFull = fbtn[0];
		/** Bind the TextField **/
		var txtf = playerUnit.getElementsByClassName("ABP-Text");
		if(txtf.length > 0){
			ABPInst.divTextField = txtf[0];
			var txti = txtf[0].getElementsByTagName("input");
			if(txti.length > 0)
				ABPInst.txtText = txti[0];
		}
		/** Bind the Comment Disable button **/
		var cmbtn = playerUnit.getElementsByClassName("ABP-CommentShow");
		if(cmbtn.length > 0){
			ABPInst.btnDm = cmbtn[0];
		}
		/** Bind mobile **/
		if(mobile){
			// Controls
			var controls = playerUnit.getElementsByClassName("ABP-Control");
			if(controls.length > 0){
				ABPInst.controlBar = controls[0];
			}
			var timer = -1;
			var hideBar = function(){
						ABPInst.controlBar.style.display = "none";
						ABPInst.divTextField.style.display = "none";
			};
			var listenerMove = function(){
				ABPInst.controlBar.style.display = "";
				ABPInst.divTextField.style.display = "";
				try{
					if (timer != -1){
						clearInterval(timer);
						timer = -1;
					}
					timer = setInterval(function(){
						if(document.activeElement !== ABPInst.txtText){
							hideBar();
							clearInterval(timer);
							timer = -1;
						}
					}, 2500);
				} catch(e){
					console.log(e);
				}
			};
			playerUnit.addEventListener("touchmove",listenerMove);
			playerUnit.addEventListener("mousemove",listenerMove);
			timer = setTimeout(function(){
				ABPInst.controlBar.style.display = "none";
				ABPInst.divTextField.style.display = "none";
			}, 4000);
		}
		if(video.isBound !== true){
			video.addEventListener("progress",function(){
				if(this.buffered != null){
					try{
						var s = this.buffered.start(0);
						var e = this.buffered.end(0);
					}catch(err){
						return;
					}
					var dur = this.duration;
					var perc = (e/dur) * 100;
					ABPInst.barLoad.style.width = perc + "%";
				}
			});
			video.addEventListener("loadedmetadata", function(){
				if(this.buffered != null){
					try{
						var s = this.buffered.start(0);
						var e = this.buffered.end(0);
					}catch(err){
						return;
					}
					var dur = this.duration;
					var perc = (e/dur) * 100;
					ABPInst.barLoad.style.width = perc + "%";
				}
			});
			ABPInst.btnFull.addEventListener("click", function(){
				ABPInst.state.fullscreen = hasClass(playerUnit, "ABP-FullScreen");
				if(!ABPInst.state.fullscreen){
					addClass(playerUnit, "ABP-FullScreen");
				}else{
					removeClass(playerUnit, "ABP-FullScreen");
				}
				ABPInst.state.fullscreen = !ABPInst.state.fullscreen;
				if(ABPInst.cmManager)
					ABPInst.cmManager.setBounds();
				if(!ABPInst.state.allowRescale) return;
				if(ABPInst.state.fullscreen){
					if(ABPInst.defaults.w >0){
						ABPInst.cmManager.def.scrollScale = playerUnit.offsetWidth / ABPInst.defaults.w;
					}
				}else{
					ABPInst.cmManager.def.scrollScale = 1;
				}
			});
			ABPInst.barTime.style.width = "0%";
			var dragging = false;
			video.addEventListener("timeupdate", function(){
				if(!dragging)
					ABPInst.barTime.style.width = ((video.currentTime / video.duration) * 100) + "%";
			});
			ABPInst.barHitArea.addEventListener("mousedown", function(e){
				dragging = true;
			});
			ABPInst.barHitArea.addEventListener("mouseup", function(e){
				dragging = false;
				var newTime = ((e.layerX) / this.offsetWidth) * video.duration;
				if(Math.abs(newTime - video.currentTime) > 4){
					if(ABPInst.cmManager)
						ABPInst.cmManager.clear();
				}
				video.currentTime = newTime;
			});
			ABPInst.barHitArea.addEventListener("mousemove", function(e){
				if(dragging){
					ABPInst.barTime.style.width =((e.layerX) * 100 / this.offsetWidth) + "%";
				}
			});
			ABPInst.btnPlay.addEventListener("click", function(){
				if(video.paused){
					video.play();
					this.className = "button ABP-Play ABP-Pause";
				}else{
					video.pause();
					this.className = "button ABP-Play";
				}
			});
			playerUnit.addEventListener("keyup", function(e){
				if(e && e.keyCode == 32 && document.activeElement !== ABPInst.txtText){
					ABPInst.btnPlay.click();
				}
			});
			playerUnit.addEventListener("touchmove", function(e){
				event.preventDefault();
			});
			var _touch = null;
			playerUnit.addEventListener("touchstart", function(e){
				if(e.targetTouches.length > 0) {
					//Determine whether we want to start or stop
					_touch = e.targetTouches[0];
				}
			});
			playerUnit.addEventListener("touchend", function(e){
				if(e.changedTouches.length > 0) {
					if(_touch != null){
						var diffx = e.changedTouches[0].pageX - _touch.pageX;
						var diffy = e.changedTouches[0].pageY - _touch.pageY;
						if(Math.abs(diffx) < 20 && Math.abs(diffy) < 20){
							_touch = null;
							return;
						}
						if(Math.abs(diffx) > 3 * Math.abs(diffy)){
							if(diffx > 0) {
								if(video.paused){
									ABPInst.btnPlay.click();
								}
							} else {
								if(!video.paused){
									ABPInst.btnPlay.click();
								}
							}
						} else if (Math.abs(diffy) > 3 * Math.abs(diffx)) {
							if(diffy < 0){
								ABPInst.video.volume = Math.min(1,ABPInst.video.volume + 0.1)
							}else{
								ABPInst.video.volume = Math.max(0,ABPInst.video.volume - 0.1)
							}
						}
						_touch = null;
					}
				}
			});
			video.addEventListener("ended", function(){
				ABPInst.btnPlay.className = "button ABP-Play";
				ABPInst.barTime.style.width = "0%";
			});
			video.isBound = true;
		}
		/** Bind command interface **/
		if(ABPInst.txtText !== null){
			ABPInst.txtText.addEventListener("keyup", function(k){
				if(this.value == null) return;
				if(/^!/.test(this.value)){
					this.style.color = "#5DE534";
				}else{
					this.style.color = "";
				}
				if(k != null && k.keyCode === 13){
					if(this.value == "") return;
					if(/^!/.test(this.value)){
						/** Execute command **/
						var commandPrompts = this.value.substring(1).split(":");
						var command = commandPrompts.shift();
						switch (command){
							case "help":{
								var popup = ABPInst.createPopup("提示信息：",2000);
							}break;
							case "speed":
							case "rate":
							case "spd":{
								if(commandPrompts.length < 1){
									ABPInst.createPopup("速度调节：输入百分比【 1% - 300% 】", 2000);
								}else{
									var pct = parseInt(commandPrompts[0]);
									if(pct != NaN){
										var percentage = Math.min(Math.max(pct, 1), 300);
										ABPInst.video.playbackRate = percentage / 100;
									}
									if(ABPInst.cmManager !== null){
										ABPInst.cmManager.clear();
									}
								}
							}break;
							case "off":{
								ABPInst.cmManager.display = false;
								ABPInst.cmManager.clear();
								ABPInst.cmManager.stopTimer();
							}break;
							case "on":{
								ABPInst.cmManager.display = true;
								ABPInst.cmManager.startTimer();
							}break;
							case "cls":
							case "clear":{
								if(ABPInst.cmManager !== null){
									ABPInst.cmManager.clear();
								}
							}break;
							case "pp":
							case "pause":{
								ABPInst.video.pause();
							}break;
							case "p":
							case "play":{
								ABPInst.video.play();
							}break;
							case "vol":
							case "volume":{
								if(commandPrompts.length == 0){
									var popup = ABPInst.createPopup("目前音量：" + 
										Math.round(ABPInst.video.volume * 100) + "%", 2000);
								}else{
									var precVolume = parseInt(commandPrompts[0]);
									if(precVolume !== null && precVolume !== NaN){
										ABPInst.video.volume = Math.max(Math.min(precVolume, 100),0) / 100;
									}
									ABPInst.createPopup("目前音量：" + 
										Math.round(ABPInst.video.volume * 100) + "%", 2000);
								}
							}break;
							default:break;
						}
						this.value = "";
					}
				}else if(k != null && k.keyCode === 38){
					if(!k.shiftKey){
						/** Volume up **/
						ABPInst.video.volume = Math.round(Math.min((ABPInst.video.volume * 100) + 5, 100)) / 100;
						ABPInst.removePopup();
						var p = ABPInst.createPopup("目前音量：" + 
											Math.round(ABPInst.video.volume * 100) + "%", 800);
					}else{
						if(ABPInst.cmManager !== null){
							var opa = Math.min(Math.round(ABPInst.cmManager.def.opacity * 100) + 5,100);
							ABPInst.cmManager.def.opacity = opa / 100;
							ABPInst.removePopup();
							var p = ABPInst.createPopup("弹幕透明度：" + Math.round(opa) + "%",800);
						}
					}
				}else if(k != null && k.keyCode === 40){
					if(!k.shiftKey){
						/** Volume Down **/
						ABPInst.video.volume = Math.round(Math.max((ABPInst.video.volume * 100) - 5, 0)) / 100;
						ABPInst.removePopup();
						var p = ABPInst.createPopup("目前音量：" + 
											Math.round(ABPInst.video.volume * 100) + "%", 800);
					}else{
						if(ABPInst.cmManager !== null){
							var opa = Math.max(Math.round(ABPInst.cmManager.def.opacity * 100) - 5,0);
							ABPInst.cmManager.def.opacity = opa / 100;
							ABPInst.removePopup();
							var p = ABPInst.createPopup("弹幕透明度：" + Math.round(opa) + "%",800);
						}
					}
				}
			});
		}
		/** Create a bound CommentManager if possible **/
		if(typeof CommentManager !== "undefined"){
			ABPInst.cmManager = new CommentManager(ABPInst.divComment);
			ABPInst.cmManager.display = true;
			ABPInst.cmManager.init();
			ABPInst.cmManager.clear();
			var lastPosition = 0;
			video.addEventListener("progress", function(){
				if(lastPosition == video.currentTime){
					video.hasStalled = true;
					ABPInst.cmManager.stopTimer();
				}else
					lastPosition = video.currentTime;
			});
			if(window){
				window.addEventListener("resize", function(){
					//Notify on resize
					ABPInst.cmManager.setBounds();
				});
			}
			video.addEventListener("timeupdate", function(){
				if(ABPInst.cmManager.display === false) return;
				if(video.hasStalled){
					ABPInst.cmManager.startTimer();
					video.hasStalled = false;
				}
				ABPInst.cmManager.time(Math.floor(video.currentTime * 1000));
			});
			video.addEventListener("play", function(){
				ABPInst.cmManager.startTimer();
				try{
					var e = this.buffered.end(0);
					var dur = this.duration;
					var perc = (e/dur) * 100;
					ABPInst.barLoad.style.width = perc + "%";
				}catch(err){}	
			});
			video.addEventListener("ratechange", function(){
				if(ABPInst.cmManager.def.globalScale != null){
					if(video.playbackRate !== 0){
						ABPInst.cmManager.def.globalScale = (1 / video.playbackRate);
						ABPInst.cmManager.rescale();
					}
				}
			});
			video.addEventListener("pause", function(){
				ABPInst.cmManager.stopTimer();
			});
			video.addEventListener("waiting", function(){
				ABPInst.cmManager.stopTimer();
			});
			video.addEventListener("playing",function(){
				ABPInst.cmManager.startTimer();
			});
		}
		return ABPInst;
	}
})()
