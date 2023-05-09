import { WebSocketServer } from "ws"
import { PreviewServer } from 'astro'
const WSS = new WebSocketServer({ noServer :true })
let ws: WebSocket | null = null
const wsc = (socket:WebSocket) => {
  console.log('we are connected')
  socket.on('message', (message:string)=> {
    console.log('received: %s', message)
    // ws.send(`You said: ${message}`)
  })
  socket.on('close', function close() {
    console.log('client disconnected')
  })
  ws = socket
}
WSS.on('connection', wsc)

export const send=(msg:string)=>{
  console.info(msg)
  if(ws !==null) ws.send(msg)
  // const arrIterator = WSS.clients.values()
  // const arr = Array.from(arrIterator)
  // console.log(arr.length)
}