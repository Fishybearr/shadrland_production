import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth"
import Navbar from "@/app/components/NavBar/navbar";
import ShadersGrid from "@/app/components/ShadersGrid/ShadersGrid";


interface ProfilePageProps
{
    params: Promise<{userid: string}>;
}

export default async function ProfilePage({params}: ProfilePageProps)
{

    const session = await auth();
    const { userid } = await params;

    {/*Check if id in url is linked to a user */}
    const user = await prisma.user.findFirst({
        where: {
            name: userid,
        },
        include: {
            shaders: {
                orderBy: {createdAt: 'asc'}
            }
        }
    });

    {/*If the user account isn't found then 404 */}
    if(!user)
        {
            notFound();
        }

    {/*Check if logged in user is the owner of this page */}
    const isOwner = session?.user?.id === user.id;

    //Shaders Array
    const shaders = user.shaders.reverse();

    return(<>
    <Navbar />
    
    <p>Email: {user.email}</p>
    <p>Name: {user.name}</p>
    {/*<p>First Shader: {user.shaders[0].title}</p> */}
    {/*<ul>
    {user.shaders.map((shader) => (
        <li key={shader.id}>{shader.title},{shader.id}</li>
    ))}
    </ul> */}
    

    {/*show an edit page button if the owner of the
    page is logged in*/}
    {isOwner && (<button>Edit Page</button>)}

    <main>
        <ShadersGrid shaders={shaders}></ShadersGrid>
    </main>

{/*
    <pre>
  Session ID: {JSON.stringify(session?.user?.id)} {"\n"}
  User ID: {JSON.stringify(user.id)} {"\n"}
  Match: {isOwner ? "YES" : "NO"}
</pre>
*/}
    
    </>)
}