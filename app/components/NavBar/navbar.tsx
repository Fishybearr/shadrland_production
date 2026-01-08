// components/Navbar.tsx
import { auth } from "@/auth"
import { SignOutButton } from "../../actions/SignOut"
import Link from "next/link"
import Image from "next/image"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="flex justify-between p-4 bg-blue-600">
      <Link href="/">Shadrland</Link>
      
      <div className="flex justify-between">
         
        {session ? (
          <div className="flex items-center gap-4">
               <Link href={'/createshader'}>
        <Image src={'/assets/icons/add.png'} alt="create shader Icon" width={24} height={24} priority></Image>
        </Link>
            <Link href={`/profile/${session.user?.name}`}>{session.user?.name}</Link>
            <SignOutButton />
          </div>
        ) : (
            <div className="flex item-center gap-4">
              <Link href={'/createshader'}>
        <Image src={'/assets/icons/add.png'} alt="create shader Icon" width={24} height={24} priority></Image>
        </Link>
                <Link href="/login">Login</Link>|<Link href="/signup">Sign Up</Link>
            </div>
          
        )}
      </div>
    </nav>
  )
}