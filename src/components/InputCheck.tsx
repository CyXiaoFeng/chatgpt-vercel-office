import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import DateTimeInput from './DateTimeInput'
import { Match, Switch, Show } from 'solid-js'
interface Props {
    labelName: string
    value: () => string
    onInput: (value: string) => void
    type: string
    reg: RegExp
    childIndex: number
    tip: string
}
export default function (props: Props) {
    /*
    根据正则检查输出的值是否有效
    */
    const checkVail = (reg, value, index) => {
        const btnC = "btnCorrect" + index
        const btnI = "btnIncorrect" + index
        if (reg === undefined || reg.test(value)) {
            // console.info(e.currentTarget)
            document.getElementById(btnC).style.display = "inline-block"
            document.getElementById(btnI).style.display = "none"

        } else {
            document.getElementById(btnI).style.display = "inline-block"
            document.getElementById(btnC).style.display = "none"
        }
    }
    return (
        <div class="row mb-3">
            <label for="inputUserName" class="col-sm-2 col-form-label">{props.labelName}</label>
            <div class="col-sm-7">
                <Show
                    when={props.type === "text"}
                    fallback={<DateTimeInput value={props.value} onInput={props.onInput} onBlur={checkVail} index={props.childIndex} />}
                >
                    <input type="text" value={props.value()} onInput={(e) => props.onInput(e.currentTarget.value)}
                        class="form-control" id={`input${props.childIndex}`} onblur={(e) => checkVail(props.reg,
                            e.currentTarget.value, props.childIndex)} placeholder={props.tip} />
                </Show>
            </div>
            <div class="col-sm-3">
                <button type="button" class="btn btn-primary" style="display :none" id={`btnCorrect${props.childIndex}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20"
                        height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                    </svg>
                </button>
                <button type="button" class="btn btn-outline-danger" style="display :none" id={`btnIncorrect${props.childIndex}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}
