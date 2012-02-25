<?php
if($_GET['addr'] != '' && preg_match('~https*://~iUs',$_GET['addr'])){
	echo file_get_contents($_GET['addr']);
}
?>