import Hero from "../components/Hero/Hero"
//import Navbar from "../components/Navbar/Navbar.tsx";
import { JSX } from "react"

export default function Page(): JSX.Element {
  return (
    <div className="bg-kewti-dark selection:bg-kewti-orange min-h-screen text-white selection:text-white">
      <Hero />
    </div>
  )
}
