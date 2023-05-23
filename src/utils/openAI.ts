import { createParser } from "eventsource-parser"
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser"
import type { ChatMessage } from "@/types"
import jieba from "./jieba/index.ts"
import { filterMessage } from "@/utils/sensitive"
const model = import.meta.env.OPENAI_API_MODEL || "gpt-3.5-turbo"

export const generatePayload = (
  apiKey: string,
  messages: ChatMessage[]
): RequestInit & { dispatcher?: any } => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  },
  method: "POST",
  body: JSON.stringify({
    model: model || "gpt-3.5-turbo",
    messages: messages.map(k => ({ role: k.role, content: k.content })),
    temperature: 0.6,
    // max_tokens: 4096 - tokens,
    stream: true
  })
})

//流式输出
export const parseOpenAIStream = (rawResponse: Response) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const streamParser = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data
          if (data === "[DONE]") {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta?.content || ""
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }
      const parser = createParser(streamParser)
      for await (const chunk of rawResponse.body as any) {
        const chukValue = decoder.decode(chunk)
        parser.feed(chukValue)
      }
    }
  })
  return new Response(stream)
}

//流式输出结束后再展现给前端
export const parseOpenAIContent = async (rawResponse: Response) => {
  if (!rawResponse.ok) {
    return new Response(rawResponse.body, {
      status: rawResponse.status,
      statusText: rawResponse.statusText
    })
  }
  const msgAry: any[] = []
  const decoder = new TextDecoder()
  const getStreamContent = async (): Promise<string> => {
    const streamParser = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data
        if (data === "[DONE]") {
          // console.info(`完整的响应=${msgAry.join("")}`)
          return
        }
        try {
          const json = JSON.parse(data)
          const text = json.choices[0].delta?.content || ""
          msgAry.push(...text)
        } catch (e) {
          console.info(e)
        }
      } else {
        console.info(event.type)
      }
    }
    const reader = rawResponse.body?.getReader()
    return await reader
      ?.read()
      .then(async function processText({ done, value }) {
        // Result 对象包含了两个属性：
        // done  - 当 stream 传完所有数据时则变成 true
        // value - 数据片段。当 done 为 true 时始终为 undefined
        if (done) {
          const rltContent = msgAry.join("")
          console.log(`Stream complete->${rltContent}`)
          const iterator = filterMessage(rltContent, true)[Symbol.iterator]()
          return iteratorToStream(iterator) //await jieba(rltContent)
        }
        const chunk = decoder.decode(value)
        const parser = createParser(streamParser)
        parser.feed(chunk)
        return reader.read().then(processText)
      })
  }
  return new Response(await getStreamContent())
}

function iteratorToStream(iterator) {
  let interval
  return new ReadableStream({
    start(controller) {
      interval = setInterval(() => {
        const { value, done } = iterator.next()
        if (done) {
          clearInterval(interval)
          controller.close()
          console.info("done")
        } else {
          // console.info(value)
          controller.enqueue(value)
        }
      }, 100)
    }
  })
}
