import Mint from '@celebi/mint-filter'
import sensitives from "./sensitive-array"
const mint = new Mint(sensitives)
export const verifyMessage = (msg:string):boolean=> {
    console.info(`msg = ${msg}`)
    return  mint.validator(msg)
}