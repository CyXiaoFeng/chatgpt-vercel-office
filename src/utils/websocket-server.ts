import { WebSocketServer,WebSocket } from "ws"
import { platform } from 'node:process'
import { createServer } from 'https'
import { readFileSync } from 'fs'

if (platform === 'win32') {
  console.log('init websocket for Windows')
  const server = createServer({
    cert: readFileSync('G:\\ssl\\localhost.crt'),
    key: readFileSync('G:\\ssl\\localhost.key')

  })
  const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(msg) {
    console.log(msg.toString())
  })
})
server.listen(3232,function listening() {
  const url = `wss://192.168.3.211:${server.address().port}`
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

} else {
  console.log('init websocket for linux')
  const server = createServer({
    cert: readFileSync('/etc/ssl/aichut/certificate.pem'),
    key: readFileSync('/etc/ssl/aichut/private.pem')

  })
  
const wss = new WebSocketServer({ server })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(msg) {
    console.log(msg.toString())
  })
})
server.listen(3232,function listening() {
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
  if (ws !== null) {
    console.info(`send msg=${msg}`)
    ws.send(msg)
  }
}