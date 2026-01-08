'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function UpdateShader(shaderText: string, shaderTitle: string, isPublic: boolean, shaderId: string)
{
    const session = await auth();

    if(!session?.user?.id)
    {
        throw new Error("Must be logged in to save");
    }

    try
    {
        const updatedShader = await prisma.shader.update({
            where: {id: shaderId, authorId: session.user.id},
            data:{
                shaderText: shaderText,
                title: shaderTitle,
                authorId: session.user?.id,
                public: isPublic
            }
        })

        revalidatePath("/profile");
        revalidatePath("/home");

        return {success: true, shaderId: updatedShader.id}
    }
    catch (error)
    {
        console.error("Update Error",error);
        return {success: false, error: "Failed to update shader"};
    }
}