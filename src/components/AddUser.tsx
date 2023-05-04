import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { createSignal, useContext } from "solid-js"
import InputCheck from './InputCheck'
export default function (props) {
  async function sendMessage() {
    console.log("sendmsg")
    if (!vaildData()) return
    const options = {
      method: 'POST',
      headers: {
        'Authorization': inputManagerPwd(),
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
    if (response.status === 200) {
      setInputName("")
      // setInputManagerPwd("")
      setInputExpireTime("")
      setInputPwd("")
      setInputKey("")
      props.handleListUser(inputManagerPwd())
    }
  }
  
  const handleListUser = async ()=> {
    props.handleListUser(inputManagerPwd())
  }
  /*
   校验输入的数据是否正确
  */
  function vaildData() {
    const initialValue = true
    const andWithInitial = items().reduce(
      (accumulator, currentValue) => accumulator && (currentValue.reg === undefined ? true :
        currentValue.reg.test(currentValue.initValue())),
      initialValue
    )
    return andWithInitial
  }
  const regex = /^.{4,}$/ // This regular expression matches any string with length greater than 3.
  const [inputName, setInputName] = createSignal("")
  const [inputManagerPwd, setInputManagerPwd] = createSignal("")
  const [inputPwd, setInputPwd] = createSignal("")
  const [inputExpireTime, setInputExpireTime] = createSignal("")
  const [inputKey, setInputKey] = createSignal("")
  const [items, setItems] = createSignal([
    { name: "管理员密码", initValue: inputManagerPwd, onValue: setInputManagerPwd, type: "text", reg: regex, tip: "默认的管理员密码" },
    { name: "用户名", initValue: inputName, onValue: setInputName, type: "text", reg: regex, tip: "不能为空且大于4个字符" },
    { name: "密码", initValue: inputPwd, onValue: setInputPwd, type: "text", reg: regex, tip: "不能为空且大于6个字符" },
    { name: "过期时间", initValue: inputExpireTime, onValue: setInputExpireTime, type: "expireTime", reg: regex, tip: "" },
    { name: "KEY", initValue: inputKey, onValue: setInputKey, type: "text", reg: undefined, tip: "openai key,不输入则默认为系统的" }])

  return (
    <div>
      {items().map((item, index) => (
        <InputCheck labelName={item.name} value={item.initValue}
          onInput={item.onValue} type={item.type} childIndex={index} reg={item.reg} tip={item.tip} />
      ))}
      <button class="btn btn-primary" onClick={() => sendMessage()}>新增</button>
      &nbsp;&nbsp;&nbsp;
      <button class="btn btn-primary" onClick={()=>handleListUser()}>查询</button>
    </div>
    
  )
}