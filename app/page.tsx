import Image from "next/image";
import NavigationBar from "@/app/components/navigation-bar";
import Link from "next/link";
import { StarsBackground } from "@/app/components/ui/stars-background";
import { ShootingStars } from "@/app/components/ui/shooting-stars";

export default function Home() {
  return (
    <div className="h-screen bg-background text-foreground relative overflow-hidden">
      {/* Navigation Bar*/}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background">
        <NavigationBar />
      </header>
      
      {/* Grid Layout */}
      <main className="relative z-20 h-screen pt-20">
        
        {/* Main Grid Container */}
        <div className="h-full grid grid-cols-12 grid-rows-8 gap-4 p-4">
          
          {/* Header Block - Made Much Bigger */}
          <div className="col-span-8 row-span-4 bg-foreground text-background p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="space-y-8 relative z-10">
              <div className="text-sm font-mono text-background/60 tracking-widest uppercase">
                INTERACTIVE EDUCATION PLATFORM
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tighter">
                SEEING<br />MATHEMATICS
              </h1>
              <div className="text-base font-mono text-background/70 tracking-wide uppercase">
                mathematics • statistics • visualization
              </div>
            </div>
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(90deg,transparent_98%,theme(colors.background)_100%),linear-gradient(0deg,transparent_98%,theme(colors.background)_100%)] bg-[length:20px_20px]"></div>
          </div>

          {/* Info Block */}
          <div className="col-span-4 row-span-4 border-2 border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="text-xs font-mono text-muted-foreground/60 tracking-widest uppercase">
                SYSTEM OVERVIEW
              </div>
              <p className="text-base leading-relaxed text-muted-foreground/80">
                Transform complex mathematical and statistical concepts into intuitive visual experiences through interactive modeling and dynamic simulation.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground/70">
                Our platform bridges the gap between abstract mathematical concepts and practical understanding through immersive visualizations designed for advanced statistics education.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                <span className="text-xs font-mono text-muted-foreground/50">
                  VERSION 2024.1 • ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Inferential Statistics Module */}
          <Link href="/advanced-statistics" className="col-span-6 row-span-3 group">
            <div className="h-full bg-muted-foreground/10 hover:bg-muted-foreground/20 transition-all duration-300 p-6 border-l-4 border-muted-foreground/50 hover:border-foreground group-hover:translate-x-1">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-muted-foreground/60 mb-3 tracking-widest">MODULE_01</div>
                  <h3 className="text-2xl font-black mb-3 group-hover:text-foreground transition-colors leading-tight">
                    INFERENTIAL<br />STATISTICS
                  </h3>
                  <p className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors mb-4">
                    Hypothesis Testing • Confidence Intervals • ANOVA • Regression Analysis
                  </p>
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      • Hypothesis Testing Frameworks
                    </div>
                    <div className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      • ANOVA Visualizations
                    </div>
                    <div className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      • Confidence Interval Simulations
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-mono text-muted-foreground/60 font-bold tracking-widest">
                    AVAILABLE
                  </span>
                  <div className="w-8 h-px bg-muted-foreground/30 group-hover:bg-foreground group-hover:w-16 transition-all"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* Bayesian Statistics Module */}
          <Link href="/bayesian-statistics" className="col-span-6 row-span-3 group">
            <div className="h-full bg-muted-foreground/10 hover:bg-muted-foreground/20 transition-all duration-300 p-6 border-l-4 border-muted-foreground/50 hover:border-foreground group-hover:translate-x-1">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-muted-foreground/60 mb-3 tracking-widest">MODULE_02</div>
                  <h3 className="text-2xl font-black mb-3 group-hover:text-foreground transition-colors leading-tight">
                    BAYESIAN<br />STATISTICS
                  </h3>
                  <p className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors mb-4">
                    Prior & Posterior Distributions • Bayes' Theorem • MCMC • Probabilistic Modeling
                  </p>
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      • Interactive Bayes' Theorem
                    </div>
                    <div className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      • Prior/Posterior Visualization
                    </div>
                    <div className="text-xs font-mono text-muted-foreground/60 tracking-wide">
                      • MCMC Sampling Methods
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-mono text-muted-foreground/60 font-bold tracking-widest">
                    AVAILABLE
                  </span>
                  <div className="w-8 h-px bg-muted-foreground/30 group-hover:bg-foreground group-hover:w-16 transition-all"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* Action Block */}
          <div className="col-span-6 row-span-1 border-2 border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors p-4 flex items-center justify-between group">
            <div>
              <div className="text-xs font-mono text-muted-foreground/60 tracking-widest">INITIALIZE SYSTEM</div>
              <div className="text-sm font-bold group-hover:text-foreground transition-colors">Launch Interactive Learning Platform</div>
            </div>
            <Link 
              href="/advanced-statistics"
              className="bg-foreground text-background px-8 py-3 hover:bg-muted-foreground hover:scale-105 transition-all duration-300 font-mono text-sm font-bold tracking-wider shadow-lg hover:shadow-xl"
            >
              START
            </Link>
          </div>

          {/* Status Block */}
          <div className="col-span-6 row-span-1 bg-muted-foreground/5 hover:bg-muted-foreground/10 transition-colors p-4 flex items-center justify-between border border-muted-foreground/20">
            <div>
              <div className="text-xs font-mono text-muted-foreground/60 tracking-widest">SYSTEM STATUS</div>
              <div className="text-sm font-bold text-muted-foreground/80">Statistics Module Online & Operational</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
              <span className="text-xs font-mono text-muted-foreground/60 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Credits Block */}
          <div className="col-span-12 row-span-1 border-t-2 border-muted-foreground/30 p-4 flex items-center justify-between bg-muted-foreground/5">
            <div className="text-xs font-mono text-muted-foreground/60 tracking-wider">
              INSPIRED_BY: <Link href="https://www.youtube.com/@3blue1brown" className="hover:text-muted-foreground/90 transition-colors underline">GRANT_SANDERSON</Link> • <Link href="https://seeingtheory.org/" className="hover:text-muted-foreground/90 transition-colors underline">DANIEL_KUNIN</Link>
            </div>
            <div className="text-xs font-mono text-muted-foreground/50 tracking-wider">
              MATH_STATS_VIZ_PLATFORM_v2024.1
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
