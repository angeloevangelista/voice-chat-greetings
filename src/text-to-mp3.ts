"use strict";

var DEBUGNAME = __filename.slice(__dirname.length + 1, -3);

//var debug = require("debug")(DEBUGNAME);
var fs = require("fs");

const BASE_URL = "http://translate.google.com/translate_tts?";

class TextToMp3 {
  /**
   *
   * @type {{ie: string Cherset of text we are providing,
   * client: string this must be tw-ob otherways google API will fail the call,
   * tl: string this is the language of generated speech}}
   */
  queryParams: { [key: string]: string } = {
    ie: "UTF-8",
    client: "tw-ob",
    tl: "Pt-br",
  };

  _parseURL(path: string, text: string) {
    var keysAtt = Object.keys(this.queryParams);

    for (var i = 0; i < keysAtt.length; i++) {
      path += keysAtt[i] + "=" + this.queryParams[keysAtt[i]] + "&";
    }
    path += "q=" + encodeURIComponent(text) + "&";
    path += "textLen=" + text.length;

    return path;
  }

  _writeFile(fn: string, data: any) {
    if (fn.substring(fn.length - 4, fn.length) !== ".mp3") {
      // if name is not well formatted, I add the mp3 extention
      fn += ".mp3";
    }

    fn = `temp/${fn}`;

    var file = fs.createWriteStream(fn); // write it down the file
    file.write(data);
    file.end();
    return file.path;
  }

  async saveMP3(text: string, fileName: string, callback: Function) {
    var optionsModel = {
      tl: "it",
    };
    var options: object;

    if (typeof arguments[2] == "object") {
      options = arguments[2];
      callback = arguments[3];
    } else {
      options = {};
      callback = arguments[2];
    }
    options = Object.assign(optionsModel, options);

    if (typeof callback !== "undefined" && typeof callback == "function") {
      this.getMp3(text, (err: any, data: any) => {
        if (err) return callback(err);

        // var file =
        this._writeFile(fileName, data);
        // return callback(null, fs.realpathSync(file));
      });
    } else {
      return new Promise((resolve, reject) => {
        this.getMp3(text, () => {})
          ?.then((data: any) => {
            var file = this._writeFile(fileName, data);
            resolve(fs.realpathSync(file));
          })
          .catch(function (err: any) {
            reject(err);
          });
      });
    }
  }

  getMp3(text: string, callback: Function): Promise<any> | undefined {
    var fs = require("fs"),
      request = require("request");

    var optionsModel = {
      tl: "pt-br",
    };
    var options;

    if (typeof arguments[1] == "object") {
      options = arguments[1];
      callback = arguments[2];
    } else {
      options = {};
      callback = arguments[1];
    }

    options = Object.assign(optionsModel, options);

    this.queryParams.tl = options.tl;

    var data: any[] = [];

    if (typeof callback !== "undefined" && typeof callback == "function") {
      if (typeof text === "undefined" || text === "") {
        callback("missing required params");
      }
      var path = this._parseURL(BASE_URL, text);
      //debug("PATH", path);
      request
        .get({
          headers: {
            "Accept-Encoding": "identity;q=1, *;q=0",
            Range: "bytes=0-",
          },
          uri: path,
          method: "GET",
        })
        .on("data", function (chunk: any) {
          data.push(chunk);
        })
        .on("end", function () {
          callback(null, Buffer.concat(data));
        })
        .on("error", function (err: any) {
          // handle error
          callback(err);
        });
    } else {
      return new Promise((resolve, reject) => {
        if (typeof text === "undefined" || text === "") {
          reject("missing required params");
        }
        var path = this._parseURL(BASE_URL, text);
        //debug("PATH", path);
        request
          .get({
            headers: {
              "Accept-Encoding": "identity;q=1, *;q=0",
              Range: "bytes=0-",
            },
            uri: path,
            method: "GET",
          })
          .on("data", function (chunk: any) {
            data.push(chunk);
          })
          .on("end", function () {
            resolve(Buffer.concat(data));
          })
          .on("error", function (err: any) {
            // handle error
            reject(err);
          });
      });
    }
  }
}

export default new TextToMp3();
