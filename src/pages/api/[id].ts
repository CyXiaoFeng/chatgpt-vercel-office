import type { APIRoute } from "astro"
import {Users} from "@/utils/mongodb"
import  {MongoClient} from "mongodb"

interface user {
  name:string,
  pwd:string,
  createTime:string,
  expireTime:string
}

async function getApiKeyByPWD(pwd:any) {
  const apiKey = await (await Users()).findOne({ pwd: pwd })
  console.error(`apikey from db=${apiKey}`)
  return apiKey===null?apiKey:"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"
}


export const get: APIRoute = async ({ params, request }) => {
    let rslt
    console.info(request.headers.get("host"))
    console.info(`param id->${params.id}`)
    if(params.id === "all") {
      console.info("all result")
       rslt = await (await Users()).find({}).toArray()
       return new Response(JSON.stringify({ code: 200, message: "success", result:  rslt}), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      })
    } else {
      return new Response(JSON.stringify({ code: 400, message: "request error"}), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      })
    }
}


export const post: APIRoute = async ({ params, request }) => {
  let user
  if(request.headers.get("Authorization") !== "ohmygod") {
    return new Response(JSON.stringify({ code: 401, message: "no permission"}), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  try {
    if(params.id === "add") {
      const newuser = await request.json()
      console.info(`new user->${JSON.stringify(newuser)}`)
      newuser.apikey = "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"
      user = await (await Users()).insertOne(newuser)
    }
    return new Response(JSON.stringify({ code: 200, message: "success", user: JSON.stringify(user)}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch(error) {
    return new Response(JSON.stringify({ code: 200, message: "fail", error:JSON.stringify(error)}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
    
}

