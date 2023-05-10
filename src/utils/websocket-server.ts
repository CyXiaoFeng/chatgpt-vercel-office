import { WebSocketServer, WebSocket } from "ws"
import { platform } from 'node:process'
import { createServer } from 'https'
import type { Server } from 'https'
import { readFileSync } from 'fs'
let ows
let server:Server
export const initsocket = () => {
  if (platform === 'win32') {
    console.log('init websocket for Windows')
     server = createServer({
      cert: readFileSync('G:\\ssl\\localhost.crt'),
      key: readFileSync('G:\\ssl\\localhost.key')
    })

  } else {
    console.log('init websocket for linux')
     server = createServer({
      cert: readFileSync('/etc/ssl/aichut/certificate.pem'),
      key: readFileSync('/etc/ssl/aichut/private.pem')

    })
  }
    const wss = new WebSocketServer({ server })
    wss.on('connection', function connection(ws) {
      ows = ws
      ws.on('error', console.error)

      ws.on('message', function message(msg) {
        console.log(msg.toString())
      })
    })
    server.listen(3232, function listening() {
      const url = `wss://localhost:${server.address().port}`
      console.info(url)
      const ws = new WebSocket(url, {
        rejectUnauthorized: false,
        perMessageDeflate: false,
        secureProtocol: 'TLSv1_2_method'
      })
      ows = ws
      ws.on('error', console.error)
      ws.on('open', function open() {
        ws.send('All glory to WebSockets!')
      })
    })

}
export const send = (msg: string) => {
  if (ows !== null) {
    console.info(`send msg=${msg}`)
    console.info
    ows.send(msg)
  }
}



