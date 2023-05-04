import type { APIRoute } from "astro"
import { Users } from "@/utils/mongodb"
import { ObjectId } from 'mongodb'   
import moment from 'moment'
interface User {
  name: string,
  pwd: string,
  createTime: string,
  expireTime: string
}
const AUTH_CODE = import.meta.env.AUTH_CODE
async function getApiKeyByPWD(pwd: any) {
  const apiKey = await (await Users()).findOne({ pwd: pwd })
  console.error(`apikey from db=${apiKey}`)
  return apiKey === null ? apiKey : "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"
}


export const get: APIRoute = async ({ params, request }) => {
  const response:Response|undefined = isAuth(request)
  if(response !== undefined) return response
  let rslt
  console.info(`param id->${params.id}, host = ${request.headers.get("host")}，_id = ${request.headers.get("_id")}`)
  const _id = request.headers.get("_id") || undefined
  //用户列表
  if (params.id === "all") {
    console.info("all result")
    rslt = await (await Users()).find({}).toArray()
    return new Response(JSON.stringify({ code: 200, message: "success", result: rslt }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
    //删除一个用户
  } else if (params.id === "del" && _id !== undefined) {
    console.info(`delete user name id->${_id}`)
    rslt = await (await Users()).deleteOne({ _id: new ObjectId(_id) })
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

//验收用户信息是否完整
const checkUser = (user: { name: string | any[]; pwd: string | any[]; expireTime: string }) => {
  const regExp = /^\d{4}\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
  return user.name.length > 0 && user.pwd.length > 0 && regExp.test(user.expireTime)
}

export const post: APIRoute = async ({ params, request }) => {
  let user
  let code = 200, message
  const response:Response|undefined = isAuth(request)
  if(response !== undefined) return response
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

function isAuth(request:any) {
  if (request.headers.get("Authorization") !== AUTH_CODE) {
    return new Response(JSON.stringify({ code: 401, message: "no permission" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } 
  return undefined
}
