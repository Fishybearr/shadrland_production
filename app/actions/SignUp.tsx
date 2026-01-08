"use server"

import prisma from '@/lib/prisma'
//import bycrypt or some hashing lib
import { redirect } from "next/navigation"
import { pass } from 'three/tsl';
import bcrypt from "bcryptjs"

export default async function SignUp(formData: FormData)
{
   const email = formData.get("email") as string;
   const password = formData.get("password") as string;
   const name = formData.get("name") as string;
   
   //hash password
   const hashedPassword = await bcrypt.hash(password,12);

   console.log(email + password + name)

   //add a new user to the db
   await prisma.user.create({
    data: {
        email,
        name,
        password: hashedPassword,
    },
   })

   redirect("/login")
}