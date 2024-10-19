import Footer from "../components/Footer"
import Header from "../components/Header"

function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 ">
      <Header/>
      <div className=' text-3xl flex-1'>About</div>
      <Footer />
    </div>
  )
}

export default About