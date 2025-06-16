import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Chapter {
  id: string
  title: string
  number: string
}

interface ChapterNavigationProps {
  chapters: Chapter[]
  activeSection: string
  onSectionClick: (section: string) => void
  onSidebarToggle?: (isOpen: boolean) => void
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  activeSection,
  onSectionClick,
  onSidebarToggle
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSidebarToggle = () => {
    const newState = !isSidebarOpen
    setIsSidebarOpen(newState)
    if (onSidebarToggle) {
      onSidebarToggle(newState)
    }
  }

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={handleSidebarToggle}
        className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-40 
        bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 
        text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
        style={{ 
          left: isSidebarOpen ? '238px' : '12px',
          transition: 'left 0.3s ease-in-out, background-color 0.2s, color 0.2s'
        }}
      >
        <motion.div
          animate={{ rotate: isSidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </motion.div>
      </button>

      {/* Desktop Full-Height Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -256,
          opacity: isSidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 z-30 pt-20"
      >
        <div className="p-8">
          <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium mb-8">Chapters</h3>
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleSectionClick(chapter.id)}
                className={`w-full text-left group transition-all duration-300 ${
                  activeSection === chapter.id ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono transition-all duration-300 ${
                    activeSection === chapter.id 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/5 text-white/60 border border-white/10 group-hover:bg-white/10'
                  }`}>
                    {chapter.number}
                  </div>
                  <div>
                    <div className={`font-medium transition-colors duration-300 ${
                      activeSection === chapter.id ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {chapter.title}
                    </div>
                  </div>
                </div>
                {/* Progress indicator */}
                <div className="mt-3 ml-14">
                  <div className="w-full h-px bg-white/10">
                    <div 
                      className={`h-full bg-gradient-to-r from-white/40 to-white/20 transition-all duration-500 ${
                        activeSection === chapter.id ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed left-4 top-24 z-40 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label="Toggle chapter menu"
      >
        <div className="w-5 h-5 flex flex-col justify-center items-center">
          <motion.div
            animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current mb-1 origin-center transition-colors"
          />
          <motion.div
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-4 h-0.5 bg-current mb-1"
          />
          <motion.div
            animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current origin-center"
          />
        </div>
      </button>

      {/* Mobile Chapter Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-35"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 z-40 pt-20"
            >
              <div className="p-8">
                <h3 className="text-white/60 text-xs uppercase tracking-wider font-medium mb-8">Chapters</h3>
                <div className="space-y-6">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleSectionClick(chapter.id)}
                      className={`w-full text-left group transition-all duration-300 ${
                        activeSection === chapter.id ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono transition-all duration-300 ${
                          activeSection === chapter.id 
                            ? 'bg-white/20 text-white border border-white/30' 
                            : 'bg-white/5 text-white/60 border border-white/10 group-hover:bg-white/10'
                        }`}>
                          {chapter.number}
                        </div>
                        <div>
                          <div className={`font-medium transition-colors duration-300 ${
                            activeSection === chapter.id ? 'text-white' : 'text-white/80 group-hover:text-white'
                          }`}>
                            {chapter.title}
                          </div>
                        </div>
                      </div>
                      {/* Progress indicator */}
                      <div className="mt-3 ml-14">
                        <div className="w-full h-px bg-white/10">
                          <div 
                            className={`h-full bg-gradient-to-r from-white/40 to-white/20 transition-all duration-500 ${
                              activeSection === chapter.id ? 'w-full' : 'w-0'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChapterNavigation 