import 'bootstrap/dist/css/bootstrap.css'
import moment from 'moment'
interface Props {
  onInput:(message:string)=>void
  onBlur:(reg,vlu)=>void
  index:number
}
export default function DateTimeInput(props:Props
) {
  const now = moment()
  const formattedDate = now.format('YYYY/MM/DD HH:mm:ss')
  const pattern = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/ // 定义输入的格式
  const handleBeforeInput = (event) => {
    const newChar = event.data
    const value = event.target.value
    const currentValue = `${value}${newChar}`
    console.info(`value=${value},newChar=${newChar},cvalue=${currentValue}`)
    const newValue = value.slice(0, event.target.selectionStart) + newChar + value.slice(event.target.selectionEnd)
    if (!pattern.test(newValue)) { // 判断输入的值是否符合格式
    //   event.preventDefault() // 阻止输入非法字符
    }
  }
  const checkVaile = (e)=> {
   
    const regExp = /^\d{4}\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/

    const inputValue = e.target.value

    if (regExp.test(inputValue)) {
      // console.error(inputValue +　"correct")
      props.onInput(inputValue)
      
    } 
    props.onBlur(regExp,inputValue,props.index)
  }
  return (
    <input type="text" onbeforeinput={handleBeforeInput} class="form-control" onBlur={checkVaile} placeholder={formattedDate}/>
  )
}