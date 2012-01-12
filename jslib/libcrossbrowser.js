/*********************
*	Cross Browser Support Libraries
*
* This tries to make all browsers behave similarly
* And HOPEFULLY might fix some IE compat issues though
* it is strongly un-recommended that any hacks here 
* are actually used.
*
* And please drop support for lower versions of IE as
* even if the script works, they will not be able to
* handle such graphics intensive/processing intensive
* work
*
* The hacks in this file come from the Internet and 
* are assumed to be snippets that arent covered by
* copyright (eg. no licensing terms specified). 
* If you feel a method used here is in violation of
* your licensing, please contact:
*     https://github.com/jabbany 
* for removal of offending code.
* 
* No rights reserved - Jim Chen
* 
*********************/
/** A very basic hack to solve array problems in IE 7/8 **/
if (!Array.prototype.indexOf)
{Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}