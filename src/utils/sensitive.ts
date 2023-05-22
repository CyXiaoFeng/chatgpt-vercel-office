import Mint from "./mint"
import sensitives from "./sensitive-array"
const mint = new Mint(sensitives)
export const verifyMessage = (msg: string): boolean => {
  try {
    console.info(`msg = ${msg}`)
    return mint.verify(msg)
  } catch (error) {
    console.info(`过滤问题：${error}`)
  }
  return true
}
