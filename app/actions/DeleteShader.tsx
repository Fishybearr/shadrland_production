'use server'

import prisma from "@/lib/prisma";
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function DeletShader(shaderID: string)
{
    const session = await auth();

    if(!session?.user?.id)
    {
        throw new Error("Must be logged in to delete");
    }

    try 
    {
        const deletedShader = await prisma.shader.delete(
            {
                where: {id: shaderID, authorId: session.user.id},
            })

        revalidatePath("/profile");
        revalidatePath("/home");

        return {success: true, shaderId: deletedShader.id}
    }

    catch(error)
    {
        console.error("Error",error);
        return {success: false, error: "Failed to update shader"};
    }
}