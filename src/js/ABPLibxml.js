/**
 * XMLParser
 *
 * @licence MIT License
 * @author Jim Chen (jabbany)
 */
 
/**
 * Class for representing a delayed XML loader
 * @class
 */
var CommentLoader = (function () {

    var Loader = function Loader(commentManager) {
        this._commentManager = commentManager;
        this._parser = function () {
            throw new Error("Format parser undefined.");
        };
        this._type = "XML";
        this._data = null;
    };
    
    Loader.prototype.setParser = function (parser) {
        if (typeof parser !== "function") {
            throw new Error("Parser expected to be a function.");
        }
        this._parser = parser;
        return this;
    };
    
    Loader.prototype.setType = function (type) {
        if (type === "XML" || type === "JSON" || type === "RAW") {
            this._type = type;
        } else {
            throw new Error("Unrecognized type : " + type);
        }
        return this;
    };
    
    Loader.prototype.download = function (method, url) {
        return new Promise((function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status !== 200) {
                        reject();
                    } else {
                        if (this._type === "XML") {
                            this._data = this._parser(xhr.responseXML);
                        } else if (this._type === "JSON") {
                            this._data = this._parser(JSON.parse(xhr.responseText));
                        } else {
                            this._data = this._parser(xhr.responseText);
                        }
                        resolve(this._data);
                    }
                }
            }).bind(this);
            xhr.open(method, url, true);
            xhr.send();
        }).bind(this));
    };
    
    Loader.prototype.load = function (method, url) {
        return this.download(method, url).then((function (data) {
            this._commentManager.load(data);
        }).bind(this)); 
    };

	return Loader;
})();
