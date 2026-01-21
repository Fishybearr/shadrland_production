"use client"

import Form from 'next/form'
import { loginAction } from "@/app/actions/login"
import { useActionState } from 'react'
import Link from 'next/link'

export default function LoginForm() {
    const [state, formAction] = useActionState(loginAction, null);

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-neutral-400 text-sm">Sign in to Shadrland to start creating.</p>
                </div>

                <Form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Email Address</label>
                        <input 
                            name='email' 
                            type='email' 
                            placeholder='name@example.com'
                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Password</label>
                        <input 
                            name='password' 
                            type='password' 
                            placeholder='••••••••'
                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {state && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-500 text-center font-medium">{state}</p>
                        </div>
                    )}

                    <button 
                        type='submit'
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </Form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <p className="text-sm text-neutral-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-500 hover:underline">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}