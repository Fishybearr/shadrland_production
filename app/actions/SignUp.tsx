"use server"

import prisma from '@/lib/prisma'
//import bycrypt or some hashing lib
import { redirect } from "next/navigation"
import { pass } from 'three/tsl';
import bcrypt from "bcryptjs"

export default async function SignUp(prevState: any, formData: FormData)
{
   const email = formData.get("email") as string;
   const password = formData.get("password") as string;
   const name = formData.get("name") as string;
   const confirm_password = formData.get("confirm_password") as string;
   
   //hash password
   const hashedPassword = await bcrypt.hash(password,12);

   //console.log(email + password + name)

   //check if username or email are in use
   const registeredUser = await prisma.user.findFirst({
    where: {OR : [{email: email},{name: name}]},
   })

   try
   {

        //Add a check for valid email regex here
        
        if(password !== confirm_password)
        {
            throw new Error("Failed to Create Account: Passwords don't match");
        } 

        //throw an error for now if we try to make a user with a registered username or email
        if(registeredUser)
        {
            throw new Error("Failed to Create Account: Username or email already registered");
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

   //return the error message to the page
   catch(e)
   {

    //print generic error message if we don't have one
    if(e === null || e === "" )
        {
            return "An Unexpected Error has Occured";
        }
    
    
    else
        {
            return `${e}`;
        }
    
   }

   
}