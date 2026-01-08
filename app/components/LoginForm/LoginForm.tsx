"use client"

import Form from 'next/form'
import { loginAction } from "@/app/actions/login"
import { useActionState } from 'react'

export default function LoginForm()
{
    const [state,formAction] = useActionState(loginAction,null);
    return(<>
    <div className="flex min-h-screen items-center justify-center">
        <div className="p-8 bg-gray-500 shadow-xl rounded-lg">
            <Form action={formAction}> {/* Will set the route here for login with auth.js or a function that does the routing for us*/}
                <input name='email' type='text' placeholder='email'></input>
                <br></br>
                <input name='password' type='password' placeholder='password'></input>
                <br></br>

                {/* Display the error message from the server action */}
      {state && <p style={{ color: "red" }}>{state}</p>}
                <button type='submit'>Login</button>
            </Form>
            
        </div>
    </div>


    </>)
}