"use client"
import { useFormStatus} from "react-dom"

export default function SubmitButton()
{
    const { pending } = useFormStatus()

    return (
    <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]" type="submit" disabled={pending}>
        {pending ? "Creating Account..." : "Sign Up"}
    </button>)
}