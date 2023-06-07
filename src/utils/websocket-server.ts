import { WebSocketServer, WebSocket } from "ws"
import { platform } from "node:process"
import { createServer } from "https"
import { readFileSync } from "fs"
let lws: WebSocket
global.listnerServer
// export const initsocket = ()=>{
const server = createServer({
  cert: readFileSync(
    platform === "win32"
      ? "G:\\ssl\\localhost.crt"
      : "/usr/local/chatgpt-vercel-office/aichut.com/certificate.pem"
  ),
  key: readFileSync(
    platform === "win32"
      ? "G:\\ssl\\localhost.key"
      : "/usr/local/chatgpt-vercel-office/aichut.com/private.pem"
  )
})
const wss = new WebSocketServer({ server })
wss.on("connection", function connection(ws) {
  lws = ws
  ws.on("error", console.error)

  ws.on("message", function message(msg) {
    console.log(msg.toString())
  })
})
if (!global.listnerServer) {
  global.listnerServer = server.listen(3232, function listening() {
    const url = `wss://localhost:${server.address().port}`
    console.info(url)
    const ws = new WebSocket(url, {
      rejectUnauthorized: false,
      perMessageDeflate: false,
      secureProtocol: "TLSv1_2_method"
    })

    ws.on("error", console.error)

    ws.on("open", function open() {
      ws.send("All glory to WebSockets!")
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
    // initsocket()
  }
}
