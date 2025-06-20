import Image from "next/image";
import NavigationBar from "@/app/components/navigation-bar";
import Link from "next/link";
import { StarsBackground } from "@/app/components/ui/stars-background";
import { ShootingStars } from "@/app/components/ui/shooting-stars";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <StarsBackground 
        starDensity={0.0003}
        className="absolute inset-0 z-0"
      />
      <ShootingStars 
        minSpeed={15}
        maxSpeed={35}
        minDelay={800}
        maxDelay={3000}
        starColor="#81a8e7"
        trailColor="#a5c4f3"
        className="absolute inset-0 z-10"
      />
      
      {/* Navigation Bar*/}
      <header className="fixed top-0 left-0 right-0 z-40 p-6 md:p-4">
        <NavigationBar />
      </header>
      
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-20 relative z-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight">
            Seeing Science
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-[#81a8e7] mb-8">
            Chemical Engineering Edition
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Welcome to Seeing Science, an interactive visualization platform designed to make complex chemical engineering concepts intuitive and accessible.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/advanced-statistics" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2"></div>
                <h3 className="text-lg font-medium text-white mb-2">Advanced Statistics (ANOVA)</h3>
                <p className="text-white/60 text-sm">Visually understand Analysis of Variance, a key statistical tool for engineers.</p>
              </div>
            </Link>
            
            <Link href="/mass-diffusion" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2"></div>
                <h3 className="text-lg font-medium text-white mb-2">Mass & Diffusion</h3>
                <p className="text-white/60 text-sm">Explore the principles of mass transfer and diffusion through interactive models.</p>
              </div>
            </Link>
            
            <Link href="/thermodynamics" className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2"></div>
                <h3 className="text-lg font-medium text-white mb-2">Thermodynamics</h3>
                <p className="text-white/60 text-sm">Grasp the laws of thermodynamics with dynamic visualizations of energy and entropy.</p>
              </div>
            </Link>
          </div>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/advanced-statistics" className="bg-[#81a8e7] hover:bg-[#6b94d9] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Start Learning
            </Link>
            <Link href="/about-the-author" className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              About the Project
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 text-center text-white/40 text-sm">
        <p>
          Inspired by the work of <Link href="https://www.youtube.com/@3blue1brown" className="font-bold underline-blue text-white/80">Grant Sanderson</Link> (3Blue1Brown & Manim) and 
          <Link href="https://seeingtheory.org/" className="font-bold underline-blue text-white/80"> Daniel Kunin</Link>. (Seeing Theory)
        </p>
        <p className="mt-2">This project aims to bring similar clarity to chemical engineering education.</p>
      </footer>
    </div>
  );
}
