(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["js/util.js", "lib/EventEmitter.js", "js/ftp.js"], function(Utils, EventEmitter, FTP) {
    var FTPClient;
    FTPClient = (function() {

      FTPClient.name = 'FTPClient';

      function FTPClient(options) {
        this.ls = __bind(this.ls, this);

        this.connect = __bind(this.connect, this);
        this.options = {
          host: "127.0.0.1",
          port: 21
        };
        _.extend(this.options, options);
        EventEmitter.call(this);
      }

      FTPClient.prototype.connect = function(callback) {
        var _this = this;
        this.conn = new FTP({
          host: this.options.host,
          port: this.options.port
        });
        this.conn.on('connect', function() {
          var args, password, username;
          args = [];
          if (username = _this.options.username) {
            args.push(username);
          }
          if (password = _this.options.password) {
            args.push(password);
          }
          args.push(function(err) {
            return callback(err);
          });
          return _this.conn.auth.apply(_this.conn, args);
        });
        this.conn.on("error", function(err) {
          return this.emit("error", err);
        });
        console.log("connecting to ", this.options.host, ":", this.options.port);
        return this.conn.connect();
      };

      FTPClient.prototype.ls = function(path, callback) {
        var _this = this;
        if (_.isFunction(path)) {
          callback = path;
          path = void 0;
        }
        return this.conn.list(path, function(e, iter) {
          var files;
          if (e) {
            return callback(e);
          }
          files = [];
          iter.on('raw', function(s) {
            return console.log('<raw entry>: ' + s);
          });
          iter.on('end', function() {
            return console.log("end of file transfer");
          });
          iter.on('error', function(e) {
            callback(e);
            return _this.conn.end();
          });
          iter.on('entry', function(entry) {
            return files.push(entry);
          });
          return iter.on('success', function() {
            return callback(false, files);
          });
        });
      };

      return FTPClient;

    })();
    Utils.inherits(FTPClient, EventEmitter);
    return FTPClient;
  });

}).call(this);
