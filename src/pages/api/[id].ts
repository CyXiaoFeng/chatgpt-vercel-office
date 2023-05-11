import type { APIRoute } from "astro"
import { Users } from "@/utils/mongodb"
import { ObjectId } from 'mongodb'
import moment from 'moment'
import { execSync, spawn } from "child_process"
import * as iconv from 'iconv-lite'
import { send } from "@/utils/websocket-server"
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
  let response: Response | undefined
  if ((response = isAuth(request)) !== undefined) return response
  let rslt, msg = "success"
  console.info(`param id->${params.id}, host = ${request.headers.get("host")}`)
  let _id, action:string, wechat, key
  try {
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
    } else if (params.id === "del" && (_id = request.headers.get("_id") || undefined) !== undefined) {
      console.info(`delete user name id->${_id}`)
      rslt = await (await Users()).deleteOne({ _id: new ObjectId(_id) })
      return new Response(JSON.stringify({ code: 200, message: "success", result: rslt }), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      })
      //执行shell命令
    } else if (params.id === "shell" && (wechat = request.headers.get("wechatName") || undefined) !== undefined
      && (key = request.headers.get("key") || undefined) !== undefined && 
      (action = request.headers.get("action") || "") !== undefined) {
      const command = action==="start"?`./webchat.sh ${wechat} ${key}`:`./script.sh stop app-${wechat}`
      const cwd = '/usr/local/webchat/'
      key = request.headers.get("key") || undefined
      try {
        const subprocess = spawn(command, {
          cwd: cwd,
          detached: true
          // stdio: ['ignore', out, err],
        })
        subprocess.unref()
        subprocess.stdout.on('data', (data:string) => {
          console.log(`stdout: ${data}`)
          if(data.includes("QR") && (action==="start"))
            send(data)
        })
        subprocess.on('close', (code) => {
          console.log(`child process exited with code ${code}`)
        })
      } catch (error) {
        msg = "fail"
        rslt = iconv.decode(Buffer.from(error.message, 'binary'), 'cp936')
        console.error(`exec error:${rslt}`
        )
      }
      return new Response(JSON.stringify({ code: 200, message: msg, result: rslt }), {
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
  } catch (error) {
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
  const response: Response | undefined = isAuth(request)
  if (response !== undefined) return response
  try {
    if (params.id === "add") {//新增用户
      const newuser = await request.json()
      if (!checkUser(newuser)) {
        code = 400
        message = "parameter error"
      } else {
        const now = moment()
        const formattedDate = now.format('YYYY/MM/DD HH:mm:ss')
        newuser.createTime = formattedDate
        if (newuser.apikey === undefined || newuser.apikey.trim().length === 0)
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

//验证管理员的身份信息
function isAuth(request: any) {
  const authCode = import.meta.env.AUTH_CODE
  console.info(`local authCode = ${authCode}`)
  if (request.headers.get("Authorization") !== authCode) {
    return new Response(JSON.stringify({ code: 401, message: "no permission" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  return undefined
}
