import { WebSocketServer } from "ws"
import { platform } from 'node:process'
import { createServer } from 'https'
import { readFileSync } from 'fs'
let ws: WebSocket | null = null
const wsc = (socket: WebSocket) => {
  console.log('we are connected')
  socket.on('message', (message: string) => {
    console.log('received: %s', message)
    // ws.send(`You said: ${message}`)
  })
  socket.on('close', function close() {
    console.log('client disconnected')
  })
  ws = socket
}
let WSS: WebSocketServer//= new WebSocketServer({ server })
if (platform === 'Linux') {
  console.log('Linux')
  const server = createServer({
    cert: readFileSync('/etc/ssl/aichut/certificate.crt'),
    key: readFileSync('/etc/ssl/aichut/private.key')

  })
  WSS = new WebSocketServer({ server })
  WSS.on('connection', wsc)
  server.listen(8080)
} else {
  console.log('Windows')
   WSS = new WebSocketServer({ port: 8080 })
  WSS.on('connection', wsc)
}
export const send = (msg: string) => {
  if (ws !== null) {
    console.info(`send msg=${msg}`)
    ws.send(msg)
  }
  // const arrIterator = WSS.clients.values()
  // const arr = Array.from(arrIterator)
  // console.log(arr.length)
}