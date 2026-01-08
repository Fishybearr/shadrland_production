"use server"


import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData)
{
    try
    {
        await signIn("credentials",{
            email: formData.get("email"),
            password: formData.get("password"),
            redirectTo: "/home",
        })
    }
    catch (error)
    {
        if(error instanceof AuthError)
            {
                return "Invalid credentials"
            }
            throw error
    }
}