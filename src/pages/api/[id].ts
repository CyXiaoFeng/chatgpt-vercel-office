import type { APIRoute } from "astro"
export const get: APIRoute = ({ params, request }) => {
    const id = params.id || undefined
    // const url = new URL(request.url)
    // const pms = new URLSearchParams(url.search)
  
    return new Response(JSON.stringify({code:200,message:"ok",id:id}), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }