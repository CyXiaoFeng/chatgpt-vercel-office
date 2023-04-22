import { MongoClient} from "mongodb"
import type{ Db, Document, WithId } from "mongodb"
import type { APIRoute } from "astro"
// eslint-disable-next-line @typescript-eslint/naming-convention
const MONGODB_URI = "mongodb://localhost:27017"
// eslint-disable-next-line @typescript-eslint/naming-convention
const DB_NAME = "mydatabase"

let db: Db

async function connect() {
  const client = await MongoClient.connect(MONGODB_URI)
  db = client.db(DB_NAME)
}

export const get: APIRoute = ({ params, request }) => {
  const id = params.id || undefined
  const url = new URL(request.url)
  const pms = new URLSearchParams(url.search)

  return new Response(JSON.stringify({code:200,message:"ok",id:pms.get("id")}), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  })
}
  
  // async post(req: { body: { name: any; message: any } }, res: { sendStatus: (arg0: number) => void; }) {
  //   const { name, message } = req.body
  //   await db.collection("messages").insertOne({ name, message })
  //   res.sendStatus(201)
  // },

  // async put(req: { body: { id: any; name: any; message: any; }; }, res: { sendStatus: (arg0: number) => void; }) {
  //   const { id, name, message } = req.body
  //   await db.collection("messages").updateOne({ _id: id }, { $set: { name, message } })
  //   res.sendStatus(200)
  // },


// connect()
