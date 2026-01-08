'use server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function SaveShader(shaderText: string, shaderTitle: string, isPublic: boolean)
{
    const session = await auth();

    if(!session?.user?.id)
        {
            throw new Error("You must be logged in to save a shader");
        }

    try
    {
        const newShader = await prisma.shader.create({
            data: {
                title: shaderTitle || "Untitled Shader",
                shaderText: shaderText,
                authorId: session.user.id,
                public: isPublic
            },
        })

        //refresh pages showing the list of shaders
        revalidatePath("/profile");
        revalidatePath("/home");

        return {success: true, shaderId: newShader.id};
    
    } 
    catch (error)
    {
        console.error("Save Error",error)
        return {success: false, error: "Failed to save shader"};
    }
}