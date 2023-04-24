import type { APIRoute } from "astro"
import {Users} from "@/utils/mongodb"
import  {MongoClient} from "mongodb"
export const get: APIRoute = async ({ params, request }) => {
    const pwd = params.id || undefined
    const apikey = await getApiKeyByPWD(pwd)
    console.error(`apikey=${apikey}`)
    return new Response(JSON.stringify({ code: 200, message: "success", apikey: apikey }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
async function getApiKeyByPWD(pwd:any) {
    const apiKey = await (await Users()).findOne({ pwd: pwd })
    console.error(`apikey from db=${apiKey}`)
    return apiKey===null?apiKey:"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"
}

export const post: APIRoute = async ({ params, request }) => {
    const pwd =  params.id || undefined
    const body = request.json()
    const apikey = await getApiKeyByPWD(pwd)
    console.error(`apikey=${apikey}`)
    return new Response(JSON.stringify({ code: 200, message: "success", apikey: apikey }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
}
