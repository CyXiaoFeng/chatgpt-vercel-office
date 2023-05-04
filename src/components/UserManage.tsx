import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { createSignal, useContext, createContext } from "solid-js"
import AddUser from '@/components/AddUser'
import ListUser from '@/components/ListUser'


export const MyContext = createContext()
export default function () {
    const [bRef, setBRef] = createSignal(null)
    const handleListUser = (author: string) => {
        if (author.trim().length === 0) return
        bRef()?.handleQuery(author)
    }
    return (
        <div >
            <main class="before py-2em">
                <AddUser handleListUser={handleListUser} />
            </main>
                <ListUser ref={setBRef} />
        </div>
    )
}