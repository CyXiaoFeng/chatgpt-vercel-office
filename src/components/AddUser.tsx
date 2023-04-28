import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { createEffect, createSignal } from "solid-js"
import DateTimeInput from './DateTimeInput'


export default function() {
  async function sendMessage() {
    console.log("sendmsg")
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'ohmygod',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:inputName(),
        pwd:inputPwd(),
        expireTime:inputExpireTime()
      })
    }
    const response = await fetch("/api/add",
    options)
    console.log(response)
     
    
  }
  async function setValue(expireTime:string) {
    console.info(`expireTime from child comp = ${expireTime}`)
    setInputExpireTime(expireTime)
    setIsdisabled(false)
  }
  const [inputName, setInputName] = createSignal("")
  const [inputPwd, setInputPwd] = createSignal("")
  const [inputExpireTime, setInputExpireTime] = createSignal("")
  const [isdisabled, setIsdisabled] = createSignal(true)
  function handleChange(event) {
    const inputValue = event.target.value
    // console.info(inputValue)
    // 使用正则表达式验证输入值是否为"YYYY/MM/DD HH:mm:ss"格式
    const regex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/
    if (regex.test(inputValue)) {
      setInputExpireTime(inputValue)
     
    } else {
      setInputExpireTime("")
    }
  }
    return(
       <div>
        <div class="row mb-3">
          <label for="inputUserName"  class="col-sm-2 col-form-label">用户名</label>
          <div class="col-sm-8">
            <input type="text" value = {inputName()} onInput={(e)=>setInputName(e.currentTarget.value)}
             class="form-control" id="inputUserName"/>
          </div>
          <div class="col-sm-2">
            <button type="button" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" 
            height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
</svg>
</button></div>
        </div>
        <div class="row mb-3">
          <label for="inputPwd" class="col-sm-2 col-form-label">密码</label>
          <div class="col-sm-8">
            <input type="text" value = {inputPwd()} onInput={(e)=>setInputPwd(e.currentTarget.value)}  
            class="form-control" id="inputPwd"/>
          </div>
          <div class="col-sm-2"><button type="button" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" 
            height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
</svg>
</button></div>
        </div>
        
        <div class="row mb-3">
        <label for="inputExpireTime" class="col-sm-2 col-form-label">过期时间</label>
          <div class="col-sm-8">
            <DateTimeInput setValue={setValue}/>
          </div>
          <div class="col-sm-2"><button type="button" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" 
            height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
</svg>
</button></div>
        </div>
        <button class="btn btn-primary" onClick={() => sendMessage()} disabled={isdisabled()}>提交</button>
        </div>
    )
}