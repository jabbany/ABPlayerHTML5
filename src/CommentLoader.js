/**
 * CommentLoader - Alternative to comment provider
 *
 * @licence MIT License
 * @author Jim Chen (jabbany)
 */

var CommentLoader = (function () {
  var NullParser = function () {
    this.parseOne = function () { throw new Error('Not Implemented'); };
    this.parseMany = function () { throw new Error('Not Implemented'); };
  };
  var ACCEPTABLE_TYPES = [
    "text/xml",
    "text/plain",
    "application/json"
  ];

  var CommentLoader = function CommentLoader(commentManager) {
    this._commentManager = commentManager;
    this._responseType = "text/xml";
    this._parser = new NullParser();
  };

  CommentLoader.prototype.setParser = function (parser) {
    this._parser = parser;
    return this;
  };

  CommentLoader.prototype.setType = function (type) {
    if (ACCEPTABLE_TYPES.indexOf(type) < 0) {
      throw new Error('Unknown type: ' + type);
    }
    this._responseType = type;
    return this;
  };

  CommentLoader.prototype._fetch = function (method, url) {
    return fetch(url, {
      'method': method
    }).then((function (resp) {
      if (!resp.ok) {
        throw new Error('HTTP error, status = ' + resp.status);
      }
      if (this._responseType === 'application/json') {
        return resp.json();
      } else if (this._responseType === 'text/plain') {
        return resp.text();
      } else if (this._responseType === 'text/xml'){
        return resp.text().then((function (text) {
          // We know this works since we're in a browser!
          return (new DOMParser()).parseFromString(text, this._responseType);
        }).bind(this));
      } else {
        throw new Error('Unrecognized response type');
      }
    }).bind(this));
  };

  CommentLoader.prototype.load = function (method, url) {
    return this._fetch(method, url).then((function (data) {
      return this._parser.parseMany(data);
    }).bind(this)).then((function (comments) {
        this._commentManager.load(comments);
    }).bind(this)).catch(function (err) {
      alert(err);
    }); 
  };

	return CommentLoader;
})();
