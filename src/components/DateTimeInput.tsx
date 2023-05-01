import 'bootstrap/dist/css/bootstrap.css'
import moment from 'moment'
interface Props {
  value: () => string
  onInput:(message:string)=>void
  onBlur:(reg,vlu)=>void
  index:number
}
export default function DateTimeInput(props:Props
) {
  const now = moment()
  const formattedDate = now.format('YYYY/MM/DD HH:mm:ss')
  const pattern = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/ // 定义输入的格式
  const checkVaile = (e)=> {
    const regExp = /^\d{4}\/([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
    const inputValue = e.target.value
    if (regExp.test(inputValue)) {
      props.onInput(inputValue)
      
    } 
    props.onBlur(regExp,inputValue,props.index)
  }
  return (
    <input type="text" class="form-control" value={props.value()} onBlur={checkVaile} placeholder={formattedDate}/>
  )
}