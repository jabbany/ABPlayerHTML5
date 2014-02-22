# Update Log 升级日志
* Ver 1.13.20140222 : Add event handlers and automatic generation of video component.

* Ver 1.11.20131116 : Updated comment logic, redirect focus to simple player.

* Ver 1.07.20130707 : Merge Upstream CommentCore into submodule
	- Merge upstream CommentCore into submodule 合并了CommentCore的最新开发进度
	- Created the gh-pages branch 生成了gh-pages分支

* Ver 1.06.20130113 : Updated the bilibili connector
	- Fixed the bilibili connector 修正了B站信息获取
* Ver 1.04.20120322 : Updated the comment engine.
	- Support for filters 过滤器
	- Bugfix for 3D comments and timed movement comments. 修正了3D弹幕和定时移动弹幕的几个BUG。
* Ver 1.01.20120225 : New Interface
    - Complete functional player model created
	  完整可用的播放器
	- Better support of the HTML5 video element
	  引入HTML5视频体
	- Experimental 'API Access' Mode to fetch information [Uses corsproxy.php]
	  实验性的API接入 [PHP必须开启远程文件访问]
* Ver 1.01.20120110 : Several Enhancements
	- Added Support for initial rotation in comments
	  添加了弹幕旋转的支持
	- Added Limited Support for filtering (by type, by property, by regex)
	  添加了有限的弹幕过滤能力（按类型、属性或正则表达式过滤）
	- Added limited support for default styles
	  添加了部分支持
	- Enhanced CSS for a better effect on Webkit Browsers
	  修正了CSS使得在Webkit系浏览器上显示更好且速度更流畅！
	- Added CORSPRoxy to aid Cross-Domain Resource Requests (to fetch comment lists)
	  添加了CORS代理程序（PHP）来支援跨域资源请求（如从A/B站获取弹幕列表）
	- Some code revisions
	  修正一些性能问题
* Ver 1.00.20111208 : Initial Release
	首次发布
	
# Browser Support 浏览器支持

*IE 4-5* : None - 不支持
	Lack of support for DHTML
	
*IE 6* : Maybe - 不清楚
	Some functionality _might_ be supported by IE 6 if _you are lucky_.
	IE6 is not supported and we will be making no efforts to support it.
	
*IE 7/8* : Minimal - 欠支持
	Supported: scroll, top, bottom, reverse, positioned
	Unsupported: effects, opacity, rotation, highlighting
	
*IE 9+* : Many - 较多
	Supported: scroll, top, bottom, reverse, positioned, effects, opacity, rotation
	Unsupported: highlighting, shadows
	Also lacks some other functions.
	
*Webkit (Chrome/Safari)* : Most - 最多
	Webkit series supports the biggest set of functionality and better enhancements.
	
*Gecko (Firefox)* : A lot - 很多
	Basic and extended functions, though not enhanced. No support for H.264 Videos so please be warned.
	
*Presto (Opera)* : A lot
	Basic and extended but few enhancements. Lack of testing done here.
