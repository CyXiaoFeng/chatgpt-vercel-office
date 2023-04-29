import type { APIRoute } from "astro"
import { Users } from "@/utils/mongodb"
import { MongoClient } from "mongodb"
import moment from 'moment'
interface User {
  name: string,
  pwd: string,
  createTime: string,
  expireTime: string
}

async function getApiKeyByPWD(pwd: any) {
  const apiKey = await (await Users()).findOne({ pwd: pwd })
  console.error(`apikey from db=${apiKey}`)
  return apiKey === null ? apiKey : "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"
}


export const get: APIRoute = async ({ params, request }) => {
  let rslt
  console.info(`param id->${params.id}, host = ${request.headers.get("host")}，username = ${request.headers.get("username")}`)
  const delName = request.headers.get("username") || undefined
  if (params.id === "all") {
    console.info("all result")
    rslt = await (await Users()).find({}).toArray()
    return new Response(JSON.stringify({ code: 200, message: "success", result: rslt }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } else if (params.id === "del" && delName !== undefined) {
    console.info(`delete user name->${delName}`)
    rslt = await (await Users()).deleteOne({ name: delName })
    return new Response(JSON.stringify({ code: 200, message: "success", result: rslt }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } else {
    return new Response(JSON.stringify({ code: 400, message: "request error" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
}

const checkUser = (user) => {
  const regExp = /^\d{4}\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
  return user.name.length > 0 && user.pwd.length > 0 && regExp.test(user.expireTime)
}

export const post: APIRoute = async ({ params, request }) => {
  let user
  let code = 200, message
  if (request.headers.get("Authorization") !== "ohmygod") {
    return new Response(JSON.stringify({ code: 401, message: "no permission" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  try {
    if (params.id === "add") {
      const newuser = await request.json()
      if (!checkUser(newuser)) {
        code = 400
        message = "parameter error"
      } else {
        const now = moment()
        const formattedDate = now.format('YYYY/MM/DD HH:mm:ss')
        newuser.createTime = formattedDate
        newuser.apikey = import.meta.env.FIX_API_KEY
        console.info(`new user->${JSON.stringify(newuser)}`)
        user = await (await Users()).insertOne(newuser)
        code = 200
        message = "success"
      }
    }
    return new Response(JSON.stringify({ code: code, message: message, user: JSON.stringify(user) }), {
      status: code,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    code = 400
    return new Response(JSON.stringify({ code: code, message: "fail", error: JSON.stringify(error) }), {
      status: code,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

}

