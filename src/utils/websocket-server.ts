import { WebSocketServer, WebSocket } from "ws"
import { platform } from 'node:process'
import { createServer } from 'https'
import type { Server } from 'https'
import { readFileSync } from 'fs'
import * as dotenv from 'dotenv'
declare global {
  let ws:WebSocket
  let server:Server
  let wss:WebSocketServer
}

export const initsocket = () => {
  if (platform === 'win32') {
    console.log('init websocket for Windows')
    global.server = createServer({
      cert: readFileSync('G:\\ssl\\localhost.crt'),
      key: readFileSync('G:\\ssl\\localhost.key')
    })

  } else {
    console.log('init websocket for linux')
    global.server = createServer({
      cert: readFileSync('/etc/ssl/aichut/certificate.pem'),
      key: readFileSync('/etc/ssl/aichut/private.pem')

    })
  }
    global.wss = new WebSocketServer({ server })
    wss.on('connection', function connection(ws) {
      global.ws = ws
      ws.on('error', console.error)
      ws.on('message', function message(msg) {
        console.log(msg.toString())
      })
    })
    const DomainName = import.meta.env.WEBSOCKET_SSL_URI
    server.listen(3232, function listening() {
      dotenv.config()
      const url = process.env.WEBSOCKET_SSL_URI
      console.info(url)
      global.ws = new WebSocket(url, {
        rejectUnauthorized: false,
        perMessageDeflate: false,
        secureProtocol: 'TLSv1_2_method'
      })
      ws.on('error', console.error)
      ws.on('open', function open() {
        ws.send('All glory to WebSockets!')
      })
    })

}
export const send = (msg: string) => {
  if (global.ws !== null || global.ws !== undefined) {
    console.info(`send msg=${msg}`)
    global.ws.send(msg)
  }
}



