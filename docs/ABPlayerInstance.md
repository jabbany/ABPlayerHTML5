ABP Instance
==========================
You will get an ABPlayerHTML5 Instance object when you bind to a new player using
either `ABP.bind()` or `ABP.create`. This instance object allows you to fine tune the
inner runnings of ABPlayerHTML5.

Properties
--------------------------
Depending on whether the bind was successful you may or may not have gotten some properties.
It is **strongly recommended** that you check for existance before invoking.

- btnPlay
    This is the `div` element for the play/pause button.
- barTime
    This is the `div` element for the playtime progress.
- barLoad
    This is the `div` element for the loading progress.
- btnFull
    This is the `div` element for the fullscreen button.
- btnDm
    This is the `div` element for the danmaku on/off button. (Also overridable as settings button)
- video
    This is the `video` element underlying the player.
- txtText
    This is the `input` element for the danmaku text.
- cmManager
    This is the `CommentManager` object for controlling danmaku comments. For details see documentation for CommentCoreLibrary.
- divComment
    This is the `div` element for comments layer. 


Methods
---------------------------
These methods are defined in the instance too. However they may fail if the instance was not 
correctly initialized.

- createPopup(text, delay)
    Creates a popup with the text values that will vanish after delay (ms)
    Will remove any currently displaying popup. Only one popup may be displayed at a
    time.
- removePopup()
    Forces removal of a popup if it exists. Does nothing if it doesn't.


