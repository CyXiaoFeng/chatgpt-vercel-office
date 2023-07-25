import { WebSocketServer, WebSocket } from "ws"
import { platform } from "node:process"
import { createServer } from "http"
import { readFileSync } from "fs"
const wssip = import.meta.env.WSSIP
console.info(wssip)
let lws: WebSocket
global.listnerServer
// export const initsocket = ()=>{
//注意：此处只能用于SSL的WEBSOCKET
// const server = createServer({
//   cert: readFileSync(
//     platform === "win32"
//       ? "G:\\ssl\\localhost.crt"
//       : "/usr/local/chatgpt-vercel-office/aichut.com/certificate.pem"
//   ),
//   key: readFileSync(
//     platform === "win32"
//       ? "G:\\ssl\\localhost.key"
//       : "/usr/local/chatgpt-vercel-office/aichut.com/private.pem"
//   )
// })
const server = createServer()
const wss = new WebSocketServer({ server })

wss.on("connection", function connection(ws) {
  lws = ws
  ws.on("error", console.error)

  ws.on("message", function message(msg) {
    console.log(`receive msg->${msg.toString()}`)
  })
})
if (!global.listnerServer) {
  global.listnerServer = server.listen(8080, function listening() {
    const url = `ws://localhost:${server.address().port}`
    console.info(`wss url ->${url}`)
    const ws = new WebSocket(url, {
      rejectUnauthorized: false,
      perMessageDeflate: false
      // secureProtocol: "TLSv1_2_method"
    })

    ws.on("error", console.error)

    ws.on("open", function open() {
      ws.send("init websocket and send init msg!")
    })
  })
}
// }
export const send = (msg: string) => {
  if (lws !== null && lws !== undefined) {
    console.info(`send msg=${msg}`)
    lws.send(msg.toString())
  } else {
    console.info("web socket not ready")
    //add following code when pnpm start
    // initsocket()
  }
}
