import { Mint } from "./mint/index"
import * as sensitives from "./sensitive-array"
const mint = new Mint(sensitives.default, sensitives.whiteSensitives)

export const verifyMessage = (msg: string): boolean => {
  try {
    console.info(`msg = ${msg}`)
    return mint.verify(msg)
  } catch (error) {
    console.info(`过滤问题：${error}`)
  }
  return true
}
export const filterMessage = (msg: string, replace?: boolean): string => {
  try {
    console.info(`msg = ${msg}`)
    const msgData = replace
      ? mint.filter(msg)
      : mint.filter(msg, { replace: false })
    const words = msgData.words.filter(
      (item, index, array) => array.indexOf(item) === index
    )
    const changeMsg = msgData.text
    console.info(
      `txt length =${changeMsg.length}, sensitive-> ${words}-> length=${
        words.join("").length
      }`
    )
    return changeMsg
  } catch (error) {
    console.info(`过滤问题：${error}`)
  }
  return ""
}
