(function() {

  require(["js/ftpro.js"], function(FTPClient) {
    var ftp;
    ftp = new FTPClient({
      host: '202.141.160.110',
      port: 21
    });
    return ftp.connect(function(error) {
      if (error) {
        return console.log(error);
      }
      console.log("connected. now will list files in /ubuntu/ ");
      return ftp.ls("ubuntu", function(err, entries) {
        if (err) {
          return console.log(err);
        } else {
          return console.log(entries);
        }
      });
    });
  });

}).call(this);
