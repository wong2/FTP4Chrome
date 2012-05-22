(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  define(["js/util"], function(Utils) {
    var Socket;
    Socket = (function() {

      Socket.name = 'Socket';

      function Socket() {
        this._onRead = __bind(this._onRead, this);

        this._onConnect = __bind(this._onConnect, this);
        this.listeners = {};
      }

      Socket.prototype.on = function(ev, cb) {
        var _base, _ref;
        return ((_ref = (_base = this.listeners)[ev]) != null ? _ref : _base[ev] = []).push(cb);
      };

      Socket.prototype.removeListener = function(ev, cb) {
        var l;
        if (!(this.listeners && this.listeners[ev] && (cb != null))) {
          return;
        }
        return this.listeners[ev] = (function() {
          var _i, _len, _ref, _results;
          _ref = this.listeners[ev];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
            if (l !== cb && l.listener !== cb) {
              _results.push(l);
            }
          }
          return _results;
        }).call(this);
      };

      Socket.prototype.once = function(ev, cb) {
        var f,
          _this = this;
        this.on(ev, f = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          _this.removeListener(ev, f);
          return cb.apply(null, args);
        });
        return f.listener = cb;
      };

      Socket.prototype.emit = function() {
        var args, ev, l, _i, _len, _ref, _ref1, _results;
        ev = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        _ref1 = (_ref = this.listeners[ev]) != null ? _ref : [];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          l = _ref1[_i];
          _results.push(l.apply(null, args));
        }
        return _results;
      };

      Socket.prototype.connect = function(port, host) {
        var go,
          _this = this;
        if (host == null) {
          host = 'localhost';
        }
        this._active();
        go = function(err, addr) {
          if (err) {
            return _this.emit('error', "couldn't resolve: " + err);
          }
          _this._active();
          return chrome.experimental.socket.create('tcp', {}, function(si) {
            _this.socketId = si.socketId;
            if (_this.socketId > 0) {
              return chrome.experimental.socket.connect(_this.socketId, addr, port, _this._onConnect);
            } else {
              return _this.emit('error', "couldn't create socket");
            }
          });
        };
        if (/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/.test(host)) {
          return go(null, host);
        } else {
          return Socket.resolve(host, go);
        }
      };

      Socket.prototype._onConnect = function(rc) {
        if (rc < 0) {
          return this.emit('error', rc);
        } else {
          this.emit('connect');
          this.writable = true;
          return chrome.experimental.socket.read(this.socketId, this._onRead);
        }
      };

      Socket.prototype._onRead = function(readInfo) {
        if (readInfo.resultCode === -1) {
          console.error("Bad assumption: got -1 in _onRead");
        }
        this._active();
        if (readInfo.resultCode < 0) {
          this.emit('error', readInfo.resultCode);
        } else if (readInfo.resultCode === 0) {
          this.emit('end');
          this.destroy();
        }
        if (readInfo.data.byteLength) {
          this.emit('data', Utils.bufferToRawString(readInfo.data));
          return chrome.experimental.socket.read(this.socketId, this._onRead);
        }
      };

      Socket.prototype.write = function(data) {
        var _this = this;
        data = Utils.rawStringToBuffer(data);
        this._active();
        return chrome.experimental.socket.write(this.socketId, data, function(writeInfo) {
          if (writeInfo.resultCode < 0) {
            console.error("SOCKET ERROR on write: ", writeInfo.resultCode);
          }
          if (writeInfo.bytesWritten === data.byteLength) {
            return _this.emit('drain');
          } else {
            return console.error("Waaah can't handle non-complete writes");
          }
        });
      };

      Socket.prototype.destroy = function() {
        chrome.experimental.socket.disconnect(this.socketId);
        return this.emit('close');
      };

      Socket.prototype.end = function() {
        chrome.experimental.socket.disconnect(this.socketId);
        return this.emit('close');
      };

      Socket.prototype._active = function() {
        var _this = this;
        if (this.timeout) {
          clearTimeout(this.timeout);
          return this.timeout = setTimeout((function() {
            return _this.emit('timeout');
          }), this.timeout_ms);
        }
      };

      Socket.prototype.setTimeout = function(ms, cb) {
        var _this = this;
        if (ms > 0) {
          this.timeout = setTimeout((function() {
            return _this.emit('timeout');
          }), ms);
          this.timeout_ms = ms;
          if (cb) {
            return this.once('timeout', cb);
          }
        } else if (ms === 0) {
          clearTimeout(this.timeout);
          if (cb) {
            this.removeListener('timeout', cb);
          }
          this.timeout = null;
          return this.timeout_ms = 0;
        }
      };

      Socket.resolve = function(host, cb) {
        return chrome.experimental.dns.resolve(host, function(res) {
          if (res.resultCode === 0) {
            return cb(null, res.address);
          } else {
            return cb(res.resultCode);
          }
        });
      };

      Socket.prototype.setEncoding = function(encoding) {
        return encoding;
      };

      return Socket;

    })();
    return {
      Socket: Socket,
      createConnection: function(port, host) {
        var socket;
        socket = new Socket;
        socket.connect(port, host);
        return socket;
      }
    };
  });

}).call(this);
