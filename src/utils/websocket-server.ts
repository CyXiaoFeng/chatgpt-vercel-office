import { WebSocketServer,WebSocket } from "ws"
import { platform } from 'node:process'
import { createServer } from 'http'
import { readFileSync } from 'fs'
let ws: WebSocket | null = null
let wss: WebSocketServer

if (platform === 'win32') {
  console.log('init websocket for Windows')
  const server = createServer()
  const wss = new WebSocketServer({ noServer: true })

  wss.on('connection', function connection(ws, request) {
    ws.on('error', console.error)

    ws.on('message', function message(data) {
      console.log(`Received message ${data} from user `)
      ws.send("Have already received the message")
    })
  })
  server.on('upgrade', function upgrade(request, socket, head) {

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request)
    })
  })
  server.listen(8080)

} else {
  console.log('init websocket for linux')
  const server = createServer({
    cert: readFileSync('/etc/ssl/aichut/certificate.crt'),
    key: readFileSync('/etc/ssl/aichut/private.key')

  })
  
const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(msg) {
    console.log(msg.toString())
  })
})
server.listen(function listening() {
  const url = `wss://localhost:${server.address().port}`
  console.info(url)
  const ws = new WebSocket(url, {
    rejectUnauthorized: false
  })

  ws.on('error', console.error)

  ws.on('open', function open() {
    ws.send('All glory to WebSockets!')
  })

})

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