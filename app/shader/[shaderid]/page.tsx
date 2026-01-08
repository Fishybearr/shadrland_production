import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import Navbar from '@/app/components/NavBar/navbar'
import EditShaderClientSide from './EditShaderClientSide'

interface EditPageProps
{
    params: Promise<{shaderid: string}>
}

export default async function EditShader({params}: EditPageProps)
{
    const session = await auth();
    const { shaderid } = await params;

    const shader = await prisma.shader.findFirst({
        where: {
            id: shaderid,
        }
    });

    //if the shader doesn't exist then redirect to 404
    if(!shader)
        {
            notFound();
        }


    const isOwner = session?.user?.id === shader.authorId;

        
    //if this is private and user is not owner, reroute them
    if(!isOwner && shader.public == false)
        {
            notFound();
        }

        
    return(<>
    <Navbar />
    {/*<h1>Edit Shader page, {session?.user?.name}</h1>*/}

        {/*TODO: Make sure that Fork Shader validate if user is logged in
        OR just remove the Fork Shader button if user is not logged in*/}
    {/*isOwner? (<button>Save Shader</button>) : (<button>Fork Shader</button>) */}
    {/*<p>{shader.title}</p> */}

    { /*if user owns shader we can let them save it,
     otherwise they can just compile and fork */}

     <main className="flex min-h-screen w-full items-center justify-center">
        <EditShaderClientSide shader={shader}/>
     </main>
    </>)

}