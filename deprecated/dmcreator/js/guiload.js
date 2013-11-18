if($ == null)
	var $ = function(el){return document.getElementById(el);};
/** Hook The GUI **/
$('btnSend').addEventListener('click',function(){
	if($('textIn').value == '')
		return;
	if(!cm)
		return alert('Comment Core load Fail');
	if(parseInt($('dmMovementMode').value)<7){
		var nc = {
			mode:parseInt($('dmMovementMode').value),
			text:$('textIn').value,
			size:parseInt($('dmSize').value),
			border:($('dmBorder').checked ? true:false),
			debug:($('dmDbg').checked ? true:false),
			color:'#fff'
		};
		cm.sendComment(nc);
	}else{
		StartPositionedDM();
	}
});
$('dmplay').addEventListener('click',function(){
	$('playtime').style.color = "#000";
	cm.startTimer();
});
$('dmstop').addEventListener('click',function(){
	$('playtime').style.color = "#d00";
	cm.stopTimer();
});
document.onkeyup = function(evt){
	if(!evt)
		evt = window.event;
	if(evt.keyCode == 17)
		$('dmstart').click();
	if(evt.keyCode == 18)
		$('dmstop').click();
}
/** Editor For Positioned DM **/
function StartPositionedDM(){
	
}