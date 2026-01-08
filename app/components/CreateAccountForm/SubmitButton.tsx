"use client"
import { useFormStatus} from "react-dom"

export default function SubmitButton()
{
    const { pending } = useFormStatus()

    return (
    <button className="bg-amber-700 rounded-sm p-0.5" type="submit" disabled={pending}>
        {pending ? "Creating Account..." : "Sign Up"}
    </button>)
}