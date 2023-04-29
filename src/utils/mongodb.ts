import { MongoClient } from "mongodb"
// eslint-disable-next-line @typescript-eslint/naming-convention
const MONGODB_URI = "mongodb://0.0.0.0:27017"
// eslint-disable-next-line @typescript-eslint/naming-convention
const DB_NAME = "userDB"
// if (!import.meta.env.MONGODB_URI) {
//   throw new Error('Invalid environment variable: "MONGODB_URI"')
// }

const uri = MONGODB_URI//import.meta.env.MONGODB_URI

const options = {}

global.initDB = parseInt(import.meta.env.IS_FIRST_INIT_MONGODB)

const connectToDB = async () => {
  const mongo = await new MongoClient(uri, options).connect()
  // Change this to your own DB name of course.
  // Or better yet, put it in your .env
  return mongo.db(DB_NAME)
}

export const getDB = async () => {
  const mongo = await connectToDB()
  return mongo
  
}

export const Users = async () => {
  const db = await getDB()
  console.info(`is first initdb?${global.initDB === 0?"first":"many"}`)
  if(global.initDB === 0) {
    process.env.IS_FIRST_INIT_MONGODB = 1
    global.initDB = 1
    console.info(global.initDB)
    return db.collection("users").createIndex({pwd:1},{unique:true})
  } else 
    return db.collection("users")
  
}