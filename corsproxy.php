<?php
/******
*	Cross-Origin-Resource-Sharing Proxy 
*	Version : 0.89
*	Author : Jim Chen
*	License : MIT License
*	- Proxies Ajax CORS Requests to a remote server that doesnt support it by default
******/
//You can set a prefix for req options
define('CORSPROXY','CORSProxy');

//Pseudo Implement a 'Public Resource' - Change if you want some protection
header('Access-Control-Allow-Origin: *');


//Read Request Parameters
if(count($_POST) > 0){
	//Extension for Resource
	$requestURI = $_POST[CORSPROXY . '_URI'];
	$requestType = $_POST[CORSPROXY . '_TYPE'];
	$requestPassReferer = $_POST[CORSPROXY . '_REFERER'];
	$requestEncoding = $_POST[CORSPROXY . '_ENCTYPE'];
	if($requestType != 'POST' && $requestType != 'GET')
		$requestType = 'GET';
	if($requestPassReferer = '_PASS_REAL_REFERER')
		$requestPassReferer = $_SERVER['HTTP_REFERER'];
	if($requestEncoding != 'base64')
		$requestEncoding = 'plain';
	if($requestURI == '')
		if(isset($_GET[CORSPROXY . '_URI']) && $_GET[CORSPROXY . '_URI']!='')
			$requestURI = $_GET[CORSPROXY . '_URI'];
		else{
			//Cannot Proceed Without Valid URL
			header('HTTP/1.1 404 Resource Not Locatable');
			exit();
		}
	if($requestEncoding == 'base64')
		$requestURI = base64_decode($requestURI);
}
?>