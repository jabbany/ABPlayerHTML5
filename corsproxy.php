<?php
if($_GET['addr'] != '' && preg_match('~https*://~iUs',$_GET['addr'])){
	if(isset($_GET['unzip'])){
		echo gzinflate(file_get_contents($_GET['addr']));
	}else{
		echo file_get_contents($_GET['addr']);
	}
}
?>