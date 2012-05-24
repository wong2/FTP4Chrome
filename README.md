### FTP4Chrome

#### What
用 [chrome.experimental.socket](http://code.google.com/chrome/extensions/experimental.socket.html) api实现一个Chrome里的FTP客户端

#### How
没有从0开始实现一个FTP客户端，而是把node.js的FTP客户端 [mscdex/node-ftp](https://github.com/mscdex/node-ftp) 移植到Chrome里，在 ·[RequireJS](http://requirejs.org) 和 nornagon 的 [net.coffee](https://github.com/nornagon/ircv/blob/master/net.coffee) 的帮助下，现在至少可以连接、认证、读取目录了，(还没界面)。

#### Todo
* 写界面

#### Note
* 这个项目还处于很早期, 求fork
* 请用最新版的Chromium测试
