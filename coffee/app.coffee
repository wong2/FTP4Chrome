require ["js/ftpro.js"], (FTPClient) ->

    ftp = new FTPClient
        host: '202.141.160.110'
        port: 21

    ftp.connect (error) ->
        return  console.log(error) if error

        console.log "connected. now will list files in /ubuntu/ "

        ftp.ls "ubuntu", (err, entries) ->
            if err
                console.log err
            else
                console.log entries
