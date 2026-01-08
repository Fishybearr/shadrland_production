import { auth } from "@/auth"
import { redirect } from "next/navigation"
import NavBar from "../components/NavBar/navbar"


export default async function HomePage()
{
    const session = await auth()
    const user = session?.user?.name || null
    /*if(!session)
        {
            redirect("/login")
        }*/
    return(<>
    <NavBar />
    {user !== null ? (<p>Hi {user}</p>) : (<p>Welcome!</p>)}
    
    </>)
}