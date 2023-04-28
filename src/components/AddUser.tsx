import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { createEffect, createSignal } from "solid-js"
import DateTimeInput from './DateTimeInput'
import InputCheck from './InputCheck'



export default function () {
  async function sendMessage() {
    console.log("sendmsg")
    if(isdisabled()) return
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'ohmygod',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: inputName(),
        pwd: inputPwd(),
        expireTime: inputExpireTime()
      })
    }
    const response = await fetch("/api/add",
      options)
    console.log(response)


  }
  async function setValue(expireTime: string) {
    console.info(`expireTime from child comp = ${expireTime}`)
    setInputExpireTime(expireTime)
    setIsdisabled(false)
  }
  const regex = /^.{4,}$/ // This regular expression matches any string with length greater than 3.
  const regExp = /^\d{4}\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
  const [inputName, setInputName] = createSignal("")
  const [inputPwd, setInputPwd] = createSignal("")
  const [inputExpireTime, setInputExpireTime] = createSignal("")
  const [isdisabled, setIsdisabled] = createSignal(true)
  const [items, setItems] = createSignal([{name:"用户名",initValue:inputName,onValue:setInputName, type:"text",reg:regex},
                              {name:"密码",initValue:inputPwd,onValue:setInputPwd, type:"text",reg:regex},
                              {name:"过期时间",initValue:inputExpireTime,onValue:setInputExpireTime, type:"expireTime",reg:regex}])
  function handleChange(event) {
    const inputValue = event.target.value
    // 使用正则表达式验证输入值是否为"YYYY/MM/DD HH:mm:ss"格式
    if (regex.test(inputValue)) {
      setInputExpireTime(inputValue)

    } else {
      setInputExpireTime("")
    }
  }
  return (
    <div>
     {items().map((item, index) => (
       <InputCheck labelName={item.name} value={item.initValue}
        onInput={item.onValue} type={item.type} childIndex={index} reg={item.reg}/>
      ))}
      <button class="btn btn-primary" onClick={() => sendMessage()}>提交</button>
    </div>
  )
}