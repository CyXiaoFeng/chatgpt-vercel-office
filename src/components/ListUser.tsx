import { createSignal, onMount } from "solid-js"
import 'bootstrap/dist/css/bootstrap.css'
import "~/styles/listUser.css"
export default function (props) {
    const [items, setItems] = createSignal<Item[]>([])
    const [author, setAuthor] = createSignal("")
    onMount(() => {
        props.ref({ handleQuery })

    })
    interface Item {
        _id: string
        name: string
        expireTime: string
        createTime: string
        pwd: string
        wechat: string
        apikey: string
    }

    const handleQuery = async (author: string) => {
        setAuthor(author)
        const options = {
            method: 'GET',
            headers: {
                'Authorization': author,
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch("/api/all", options)
        if (response.status === 200) {
            const data = await response.json()
            console.info(data.result)
            setItems(data.result)
        }
    }
    //启动微信
    const starWechat = async (wechatName: string, key: string) => {
        console.info(`wechatName=${wechatName}`)
        const options = {
            method: 'GET',
            headers: {
                'Authorization': author(),
                'Content-Type': 'application/json',
                'wechatName': wechatName,
                'key': key
            }
        }
        const ws = new WebSocket('wss://www.aichut.com')
        ws.onopen = function() {
            console.log('WebSocket connected')
        }
        ws.onmessage = function(event) {
            console.log('received: %s', event.data)
        }
        const response = await fetch("/api/shell", options)
        if (response.status === 200) {
            const data = await response.json()
            console.info(data.result)

        }
    }
    const delUserById = (id: string) => {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': author(),
                'Content-Type': 'application/json',
                '_id': id
            }
        }
        fetch("/api/del", options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                console.info(response.json())
            })
            .then((data) => {
                console.info(data)
                setItems(items().filter((item) => item._id !== id))
            })
            .catch((error) => {
                // handle error
                console.error("Fetch Error: ", error)
            })


    }

    return (
        <div class="container">
            <table class="table table-bordered table-sm">

                <thead>
                    <tr>
                        <th class="col-sm-1">姓名</th>
                        <th class="col-sm-1">密码</th>
                        <th class="col-sm-1.5">创建时间</th>
                        <th class="col-sm-1.5">过期时间</th>
                        <th class="col-sm-4">OPENAI KEY</th>
                        <th class="col-sm-2">微信名称</th>
                        <th class="col-sm-2">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {items().map((item) => (
                        <tr>
                            <td class="col-sm-1">{item.name}</td>
                            <td class="col-sm-1">{item.pwd}</td>
                            <td class="col-sm-1.5" style="word-wrap:break-word; word-break:break-all">{item.createTime}</td>
                            <td class="col-sm-1.5" style="word-wrap:break-word; word-break:break-all">{item.expireTime}</td>
                            <td class="col-sm-4" style="word-wrap:break-word; word-break:break-all">{item.apikey}</td>
                            <td class="col-sm-2">{item.wechat}</td>
                            <td class="col-sm-2">
                                <button type="button" onclick={() => delUserById(item._id)} class="btn btn-primary">删除</button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <button type="button" onclick={() => starWechat(item.wechat, item.apikey)} class="btn btn-primary">启动微信</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
