import prisma from '@/lib/prisma'

import { User } from '@/prisma/app/generated/prisma/client';

import Form from 'next/form'

import signUp from "../../actions/SignUp";
import SubmitButton from './SubmitButton';

export default async function CreateAccount() {
    const users: User[] = await prisma.user.findMany()

    return (
        <>
        {/*}
        <p>Remove this list obviously</p>
        <ul>
            {users.map((user:User) => (
                <li key={user.id}>{user.email}</li>
            ))}
        </ul> */}
        

            <div className='flex min-h-screen items-center justify-center'>
            <div className='p-5 bg-gray-500 shadow-xl rounded-lg'>
            <h3>Create An Account</h3>
            <Form className='text-xl' action={signUp}>
            <input className='border-2 rounded-md m-0.5 pl-0.5' type='text' name="name" placeholder='username' required></input>
            <br></br>
           
            <input className='border-2 rounded-md m-0.5 pl-0.5' type='text' name="email" placeholder='email' required></input>
            <br></br>

            <input className='border-2 rounded-md m-0.5 pl-0.5' type='password' name="password" placeholder='password' required></input>
            <br></br>

            <SubmitButton />
        </Form>
        </div>
        </div>

        </>
    )
}