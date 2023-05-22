import Mint from "./mint"
import sensitives from "./sensitive-array"
const mint = new Mint(sensitives)
export const verifyMessage = (msg: string): boolean => {
  try {
    console.info(`msg = ${msg}`)
    console.info(mint.filter(msg))
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
    console.info(msgData)
    const changeMsg = msgData.text
    return changeMsg
  } catch (error) {
    console.info(`过滤问题：${error}`)
  }
  return ""
}
