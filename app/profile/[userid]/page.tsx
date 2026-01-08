import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth"
import Navbar from "@/app/components/NavBar/navbar";
import ShadersGrid from "@/app/components/ShadersGrid/ShadersGrid";
import { Prisma } from "@/prisma/app/generated/prisma/client";

type ShaderWithAuthor = Prisma.ShaderGetPayload<{
  include: { author: true }
}>;

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
                orderBy: {createdAt: 'asc'},
                include: {author: true}
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

    //Need to only display private shaders if logged in user
    // is shader owner

    //Shaders Array
    const shaders = user.shaders.reverse();

    let shaderList: ShaderWithAuthor[] = [];

    //If this is true then we can show private shaders
    if(shaders.length > 0)
        {
            if(shaders[0].authorId === session?.user?.id)
                {
                    shaderList = shaders;
                }

            else
                {
                    for(let i = 0; i < shaders.length; i++)
                    {

                        if(shaders[i].public)
                            {
                                shaderList.push(shaders[i])
                            }
                    }
                }
        }

    

    return(<>
    <Navbar />

    <br></br>
    
    <main>
        <ShadersGrid shaders={shaderList}></ShadersGrid>
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