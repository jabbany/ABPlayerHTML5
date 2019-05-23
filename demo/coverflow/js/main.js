window.addEventListener("load",function(){
  var inst1 = ABP.create(document.getElementById("video1"), {
    "src":document.getElementById("v1"),
    "width":672,
    "height":510,
    "mobile":true
  });
  var inst2 = ABP.create(document.getElementById("video2"), {
    "src":document.getElementById("v2"),
    "width":672,
    "height":510,
    "mobile":true
  });
  var inst3 = ABP.create(document.getElementById("video3"), {
    "src":document.getElementById("v3"),
    "width":672,
    "height":510,
    "mobile":true
  });
  var inst4 = ABP.create(document.getElementById("video4"), {
    "src":document.getElementById("v4"),
    "width":672,
    "height":510,
    "mobile":true
  });
  (new CommentLoader(inst1.cmManager)).setParser(
    new BilibiliFormat.XMLParser()).load("GET", "../assets/comment-science.xml");
  (new CommentLoader(inst2.cmManager)).setParser(
    new BilibiliFormat.XMLParser()).load("GET", "../assets/comment-otsukimi.xml");
  (new CommentLoader(inst4.cmManager)).setParser(
    new BilibiliFormat.XMLParser()).load("GET", "../assets/hanabi.xml");
  $('.coverflow').coverflow();
});