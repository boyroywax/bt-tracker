import { Server } from "bittorrent-tracker"


const server = new Server({
    udp: true, // enable udp server? [default=true]
    http: true, // enable http server? [default=true]
    ws: true, // enable websocket server? [default=true]
    stats: true, // enable web-based statistics? [default=true]
    // trustProxy: false, // enable trusting x-forwarded-for header for remote IP [default=false]
    // filter: function (infoHash: any, params: any, cb: any) {
    //     // Blacklist/whitelist function for allowing/disallowing torrents. If this option is
    //     // omitted, all torrents are allowed. It is possible to interface with a database or
    //     // external system before deciding to allow/deny, because this function is async.

    //     // It is possible to block by peer id (whitelisting torrent clients) or by secret
    //     // key (private trackers). Full access to the original HTTP/UDP request parameters
    //     // are available in `params`.

    //     // This example only allows one torrent.

    //     const allowed: any = (infoHash === 'aaa67059ed6bd08362da625b3ae77f6f4a075aaa')
    //     if (allowed) {
    //     // If the callback is passed `null`, the torrent will be allowed.
    //     cb(null)
    //     } else {
    //     // If the callback is passed an `Error` object, the torrent will be disallowed
    //     // and the error's `message` property will be given as the reason.
    //     cb(new Error('disallowed torrent'))
    //     }
    // }
})

// Internal http, udp, and websocket servers exposed as public properties.
server.http
server.udp
server.ws

server.on('error', function (err: any) {
    // fatal server error!
    console.log(err.message)
})

server.on('warning', function (err: any) {
    // client sent bad data. probably not a problem, just a buggy client.
    console.log(err.message)
})

server.on('listening', function () {
    // fired when all requested servers are listening

    // HTTP
    const httpAddr = server.http.address()
    const httpHost = httpAddr.address !== '::' ? httpAddr.address : 'localhost'
    const httpPort = httpAddr.port
    console.log(`HTTP tracker: http://${httpHost}:${httpPort}/announce`)

    // UDP
    const udpAddr = server.udp.address()
    const udpHost = udpAddr.address
    const udpPort = udpAddr.port
    console.log(`UDP tracker: udp://${udpHost}:${udpPort}`)

    // WS
    const wsAddr = server.ws.address()
    const wsHost = wsAddr.address !== '::' ? wsAddr.address : 'localhost'
    const wsPort = wsAddr.port
    console.log(`WebSocket tracker: ws://${wsHost}:${wsPort}`)

})


// start tracker server listening! Use 0 to listen on a random free port.
const port = 9987
const hostname = "69.10.44.212"
server.listen(port, hostname, () => {
    // Do something on listening...
    // get info hashes for all torrents in the tracker server
    console.log(Object.keys(server.torrents))
})

// listen for individual tracker messages from peers:

server.on('start', function (addr: any) {
    console.log('got start message from ' + addr)
})

server.on('complete', function (addr: any) {
    console.log( `update: ` + Object.keys(server.torrents) )
})
server.on('update', function (addr: any) {})
server.on('stop', function (addr: any) {})


// // get info hashes for all torrents in the tracker server
// Object.keys(server.torrents)

// // get the number of seeders for a particular torrent
// server.torrents[infoHash].complete

// // get the number of leechers for a particular torrent
// server.torrents[infoHash].incomplete

// // get the peers who are in a particular torrent swarm
// server.torrents[infoHash].peers
