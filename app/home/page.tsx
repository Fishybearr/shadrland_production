import { auth } from "@/auth"
import { redirect } from "next/navigation"
import NavBar from "../components/NavBar/navbar"
import prisma from "@/lib/prisma"
import ShadersGrid from "../components/ShadersGrid/ShadersGrid"


export default async function HomePage()
{
    const session = await auth()
    const user = session?.user?.name || null
    /*if(!session)
        {
            redirect("/login")
        }*/

    //Currently just getting all public shaders

    /////////////////////////////////////////////////////////
    //-------------DO NOT DO THIS IN THE FUTURE------------//
    /////////////////////////////////////////////////////////
    const pubShaders = await prisma.shader.findMany({
        where: {public: true},

        include: {
            author: true,
        },
    })

    const shadersList = pubShaders.reverse();
    
    return(<>
    <NavBar />
    {/*user !== null ? (<p>Hi {user}</p>) : (<p>Welcome!</p>)*/
    <br></br>}

    <main>
        <ShadersGrid shaders={shadersList}></ShadersGrid>
    </main>
    
    </>)
}