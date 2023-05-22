import { execFile } from "child_process"
import { promisify } from "util"
export default async function (msg: string) {
  try {
    console.info(`param->${msg}`)
    const para = `jiebTools.py`
    const { stdout } = await promisify(execFile)("python", [para, msg], {
      encoding: "utf-8"
    })
    console.info(`output->${stdout}`)
    return stdout
  } catch (e) {
    console.info(`exec occur error->${e}`)
  }
  return ""
}
