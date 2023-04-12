import type { Model } from "./types"

export const defaultSetting = {
  continuousDialogue: true,
  archiveSession: false,
  openaiAPIKey: "",
  openaiAPITemperature: 60,
  password: "",
  systemRule: "",
  model: "gpt-3.5-turbo" as Model
}

export const defaultMessage = `
Powered by OpenAI 
本站由 ChatGPT中国服务中心 基于 OpenAI GPT-3.5 Turbo API 接口搭建。
如果你想和它聊天，请先联系ChatGPT中国服务中心，购买 OpenAI API Key 密钥并填写 (用户密钥均保存在用户本地，不涉及任何上传功能)。
购买步骤：
1，关注公众号：未来人工智能AI
2，回复 APIKey 
3，获取购买方式
4，付款后收到APIKey 
5，回到本站输入APIKey 后即可使用
- [[Shift]] + [[Enter]] 换行。开头输入 [[/]] 或者 [[空格]] 搜索 Prompt 预设。[[↑]] 可编辑最近一次提问。点击顶部名称滚动到顶部，点击输入框滚动到底部。`

export type Setting = typeof defaultSetting

export const defaultResetContinuousDialogue = false

export const defaultMaxInputTokens: Record<Model, number> = {
  "gpt-3.5-turbo": 3072,
  "gpt-4": 6144,
  "gpt-4-32k": 24576
}

export const defaultModel: Model = "gpt-3.5-turbo"
