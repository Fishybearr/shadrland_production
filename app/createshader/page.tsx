import ShaderClientSide from "./ShaderClientSide";
import Navbar from "../components/NavBar/navbar";

export default function ShaderCreatePage() {

  return (
    <>
    <Navbar />
    <main className="flex min-h-screen w-full items-center justify-center">
    <ShaderClientSide />
    </main>
    </>
  );
}