"use client"; // Required for real-time keystroke tracking

import { useState, useActionState } from 'react';
import Form from 'next/form';
import signUp from "../../actions/SignUp";
import SubmitButton from './SubmitButton';
import Link from 'next/link';
import SignUp from '../../actions/SignUp';

export default function CreateAccount() {
    const [password, setPassword] = useState("");

    //gets form state to check for error creating account
    const [state, formAction] = useActionState(SignUp, null);


    //Email test regex
    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Define requirements
    const requirements = [
        { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
        { label: "Contains a number", test: (pw: string) => /\d/.test(pw) },
        { label: "Contains a special character", test: (pw: string) => /[!@#$%^&*]/.test(pw) },
        { label: "Contains uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
    ];

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl">
                
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-neutral-400 text-sm">Join the Shadrland community of creators.</p>
                </div>

                <Form action={formAction} className="space-y-5">
                    {/* Username and Email fields remain the same */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Username</label>
                        <input name="name" type="text" placeholder="shader_wizard" required className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Email Address</label>
                    <input 
                    name="email" 
                    type="email" 
                    onChange={(e) => {
                    // Optional: could track this in state to show a little green checkmark
                    }}
                    className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-blue-500 invalid:border-red-500 transition-all" 
                    />
                    </div>

                    {/* Password Field with State tracking */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            required 
                            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition-all"
                        />
                        
                        {/* Dynamic Requirements Menu */}
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {requirements.map((req, index) => {
                                const isMet = req.test(password);
                                return (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${isMet ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-neutral-700'}`} />
                                        <span className={`text-[10px] uppercase tracking-tight transition-colors duration-300 ${isMet ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                            {req.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase tracking-wider">Confirm Password</label>
                        <input name="confirm_password" type="password" placeholder="••••••••" required className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    {/* 3. Display the error message from the server action */}
                    {state && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-1">
                            <p className="text-sm text-red-500 text-center font-medium">{state}</p>
                        </div>
                    )}

                    

                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                </Form>

                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                    <p className="text-sm text-neutral-500">
                        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}