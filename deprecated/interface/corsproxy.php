<?php
if(isset($_GET['xml']))
	header('Content-Type: text/xml');
if($_GET['addr'] != '' && preg_match('~https*://~iUs',$_GET['addr'])){
	if(isset($_GET['unzip'])){
		$cont = gzinflate(file_get_contents($_GET['addr']));
	}else{
		$cont = file_get_contents($_GET['addr']);
	}
}
echo $cont;
?>