import { WebSocketServer, WebSocket } from "ws"
import { platform } from 'node:process'
import { createServer } from 'https'
import { readFileSync } from 'fs'
declare global {
  let wss:WebSocketServer
  let ws:WebSocket
}
export const initsocket = ()=>{
  const server = createServer({
    cert: readFileSync(platform === 'win32'?'G:\\ssl\\localhost.crt':'/etc/ssl/aichut/certificate.pem'),
    key: readFileSync(platform === 'win32'?'G:\\ssl\\localhost.key':'/etc/ssl/aichut/private.pem')
  })
    wss = new WebSocketServer({ server })
    wss.on('connection', function connection(ws) {
      global.ws = ws
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
      ws.on('error', console.error)
      ws.on('open', function open() {
        ws.send('All glory to WebSockets!')
      })
    })
}
export const send = (msg: string) => {
  if (global.ws !== null) {
    console.info(`send msg=${msg}`)
    ws.send(msg)
  }

}