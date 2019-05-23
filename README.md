# ABPlayerHTML5

*ABPlayerHTML5* is a spinoff of the original ABPlayer. 
It is intended as a reference implementation of an HTML5 Danmaku Video Player 
that uses CommentCoreLibrary as a backing implementation.

Feel free to try out our [demo](http://jabbany.github.io/ABPlayerHTML5/demo).
If you find any bugs, please open an issue in the issue tracker.

## Support

We use the latest stable source of CommentCoreLibrary by using `npm` as a package
manager. This means we are able to support high complexity moving danmaku and 
both Acfun and Bilibili file formats natively. ABPlayerHTML5 is built to be 
compatible across multiple browsers and supports current versions of 
Chrome (25+), Firefox (24+), Safari and Internet Explorer (9+). 

We do not include scripting danmaku support in ABPlayerHTML5 as it is less common
and significantly adds difficulty to deployment.

The deprecated interfaces and creator interfaces are no longer maintained, you 
can check them out by navigating to previous commits.

### Building

Please use `npm install` to install the needed libraries and then use `grunt` to
compile the project.

### Mobile

ABPlayerHTML5 is designed to work with mobile devices allowing swipe gestures 
and enhanced space allocation. However please note that when using in iOS 
versions for iPhone & iPod, embedded playback is not supported so there will be 
no comments displayed as the video is played in the system's player. 

For iPad and OS X, Safari allows inline videos so there should be no problem.

## CommentCoreLibrary

ABPlayerHTML5 employs a compiled version of CommentCoreLibrary. If you are only 
interested in the implementation for danmaku comments, please move on to 
[CommentCoreLibrary](https://github.com/jabbany/CommentCoreLibrary), our sister
project.

## License

Copyright (c) 2014 Jim Chen (http://kanoha.org/), under the 
[MIT license](http://www.opensource.org/licenses/mit-license.php).

# 中文

ABPlayerHTML5是一个ABPlayer的子项目。通过把ABPlayer的核心弹幕类重写成JS来实现一个简单但是能
高度整合HTML5的原生弹幕播放控件。目前我们支持大部分的移动端和桌面端。

如果你对项目的效果感兴趣，请 **[戳这里](http://jabbany.github.io/ABPlayerHTML5/demo)** 来观
看本项目在你浏览器下的效果。我们欢迎有关项目呈现BUG的报告。请使用Github自带的issues发布新的Issue。

## 项目状态

本项目目前采取 CommentCoreLibrary 稳定版作为弹幕的后端支持库。这样我们就可以高效的还原高级弹幕
同时也有自建的Acfun和Bilibili格式解析器。本项目兼容大部分最新版本的浏览器，包括Chrome，Firefox
Safari和IE。项目中不包括对脚本弹幕的支持，因为脚本弹幕的使用率并不很高，而添加支持代码则会让维护
变得困难。

以前版本的旧文件在新版下不会保留，如果需要使用旧的界面，请checkout更早的commit。

### 移动终端
本播放器自带对大部分支持HTML5的移动终端的支持，包括简单的手势支持和界面优化。不过值得注意的是iPhone
和iPod很可能无法正确还原弹幕，因为这些设备上视频由设备接管，不能内嵌在浏览器中。

### 弹幕核心通用构件
ABPlayerHTML5用 CommentCoreLibrary 作为播放器的弹幕支持后端。采用的是 CCL 的发行稳定版（即
有版本号的在 npm 上注册的版本）。CCL由于还在未成熟阶段，所以开发中可能出现API变动，ABPlayerHTML5
只会在这些API变动正式化后才跟进，所以采取自行编译版本的CCL可能会与ABP产生衔接问题，需要开发者注意。

# 许可
版权所有 (c) 2014 Jim Chen (http://kanoha.org/), 项目遵循 
[MIT许可协议](http://www.opensource.org/licenses/mit-license.php).
