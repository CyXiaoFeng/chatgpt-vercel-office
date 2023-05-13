// #vercel-disable-blocks
import { ProxyAgent, fetch } from "undici"
// #vercel-end
import { generatePayload, parseOpenAIStream } from "@/utils/openAI"
import { verifySignature } from "@/utils/auth"
import type { APIRoute } from "astro"
const httpsProxy = import.meta.env.HTTPS_PROXY
import { Users } from "@/utils/mongodb"
import moment from 'moment'
const baseUrl = (
  import.meta.env.OPENAI_API_BASE_URL || "https://api.openai.com"
)
  .trim()
  .replace(/\/$/, "")
const sitePassword = import.meta.env.SITE_PASSWORD || ""
const passList = sitePassword.split(",") || []
import {verifyMessage} from "@/utils/sensitive"

export const post: APIRoute = async context => {
  const body = await context.request.json()
  const { sign, time, messages, password, key } = body
  const curMsg = messages[messages.length-1].content
  const verRslt = verifyMessage(curMsg)
  console.info(`${curMsg}：${verRslt?"不是敏感词":"是敏感词"} `)
  if(!verRslt) {
    return new Response(
      JSON.stringify({
        error: {
          message: "请勿输入敏感信息"
        }
      }),
      { status: 400 }
    )
  }
  if (!messages) {
    return new Response(
      JSON.stringify({
        error: {
          message: "No input text."
        }
      }),
      { status: 400 }
    )
  }

  if (
    import.meta.env.PROD &&
    !(await verifySignature(
      { t: time, m: messages?.[messages.length - 1]?.content || "" },
      sign
    ))
  ) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Invalid signature."
        }
      }),
      { status: 401 }
    )
  }
  /*if (sitePassword && !(sitePassword === pass || passList.includes(pass))) {
   return new Response(
     JSON.stringify({
       error: {
         message: "Invalid password."
       }
     }),
     { status: 401 }
   )
 }
 */
  let newKey = key
  if (password !== null && password !== undefined && password.trim().length > 0) {
    console.info(`pwd->${password}`)
    const user = await (await Users()).findOne({ pwd: password })
    const now = moment()
    //未查到用户，或者用户已过期
    console.error(`apikey from db=${user?.apikey}`)
    if ((user === null || now.isAfter(moment(user.expireTime,"YYYY/MM/DD HH:mm:ss")))) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Password expired."
          }
        }),
        { status: 403 }
      )
    }
    newKey = user.apikey
  }
  const initOptions = generatePayload(newKey, messages)
  // #vercel-disable-blocks
  if (httpsProxy) initOptions.dispatcher = new ProxyAgent(httpsProxy)
  // #vercel-end

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const response = (await fetch(
    `${baseUrl}/v1/chat/completions`,
    initOptions
  ).catch((err: Error) => {
    console.error(err)
    return new Response(
      JSON.stringify({
        error: {
          code: err.name,
          message: err.message
        }
      }),
      { status: 500 }
    )
  })) as Response

  return parseOpenAIStream(response) as Response
}
