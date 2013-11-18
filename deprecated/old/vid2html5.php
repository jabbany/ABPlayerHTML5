<?php
//Very hackish and probably wont work very long
$page = 'http://gae.mukio.org/ipad/video/' . $_GET['vid'];
$purr = @file_get_contents($page);
if(preg_match('~v_play_ipad\.php\?vid=(\d+)"~iUs',$purr,$mt)){
	//Got a match
	exit($mt[1]);
}else{
	//Try googling for it
	$gquery = 'http://www.google.com/search?tbm=vid&q=' . urlencode('video.sina.com.cn/v/b/' . (int)$_GET['vid'] . '-');
	$gq = preg_replace('~<[^a].+>~iUs','',@file_get_contents($gquery));
	if(preg_match('~v/b/' . $_GET['vid'] . '-(\d+)\.html~iUs',$gq,$m)){
		//Got the addr
		$sinaddr = 'http://video.sina.com.cn/v/b/' . $_GET['vid'] . '-' . $m[1] . '.html';
		$sp = @file_get_contents($sinaddr);
		if(preg_match('~ipad_vid:(.+),~iUs',$sp,$mat)){
			exit(preg_replace('~[^0-9]~','',$mat[1]));
		}else
			exit('-1');
	}else{
		exit('-1');
	}
}
?>
