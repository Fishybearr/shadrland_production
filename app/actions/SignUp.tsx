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

   //console.log(email + password + name)

   //check if username or email are in use
   const registeredUser = await prisma.user.findFirst({
    where: {OR : [{email: email},{name: name}]},
   })

   //throw an error for now if we try to make a user with a registered username or email
   if(registeredUser)
    {
        throw new Error("Username or email already registered");
    }

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