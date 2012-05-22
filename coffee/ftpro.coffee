define ["js/util.js", "lib/EventEmitter.js", "js/ftp.js"], (Utils, EventEmitter, FTP) ->

    class FTPClient

        constructor: (options) ->
            @options =
                host: "127.0.0.1"
                port: 21

            _.extend @options, options

            EventEmitter.call this

        connect: (callback) =>
            @conn = new FTP
                host: @options.host
                port: @options.port

            @conn.on 'connect', =>
                args = []
                if username = @options.username
                    args.push username
                if password = @options.password
                    args.push password
                args.push (err) ->
                    callback err

                @conn.auth.apply @conn, args

            @conn.on "error", (err) ->
                @emit "error", err

            console.log "connecting to ", @options.host, ":", @options.port
            @conn.connect()

        ls: (path, callback) =>

            if _.isFunction path
                callback = path
                path = undefined

            @conn.list path, (e, iter) =>
                return callback e if e

                files = []

                iter.on 'raw', (s) ->
                    console.log '<raw entry>: ' + s
                iter.on 'end', ->
                    console.log "end of file transfer"
                iter.on 'error', (e) =>
                    callback e
                    @conn.end()

                iter.on 'entry', (entry) ->
                    files.push entry

                iter.on 'success', ->
                    callback false, files

    Utils.inherits FTPClient, EventEmitter

    return FTPClient
