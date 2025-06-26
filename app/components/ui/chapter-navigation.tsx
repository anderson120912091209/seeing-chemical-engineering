import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Chapter {
  id: string
  title: string
  number: string
  subchapters?: Subchapter[]
}

interface Subchapter { 
  id: string;
  title: string;
  number: string;
}

interface ChapterNavigationProps {
  chapters: Chapter[]
  activeSection: string
  onSectionClick: (section: string) => void
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  activeSection,
  onSectionClick
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId)
    setIsMobileMenuOpen(false)
    setIsSidebarOpen(false) // Close desktop sidebar when section is clicked
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  return (
    <>
      {/* Desktop Sidebar Toggle Button - Now in top left corner */}
      <button
        onClick={handleSidebarToggle}
        className="hidden lg:block fixed left-4 top-24 z-40 
        bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-3 
        text-white/80 hover:text-white hover:bg-black/70 hover:border-white/30 shadow-lg transition-all duration-300"
      >
        <div className="w-5 h-5 flex flex-col justify-center items-center">
          <motion.div
            animate={isSidebarOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-current mb-1 origin-center transition-colors"
          />
          <motion.div
            animate={isSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-0.5 bg-current mb-1"
          />
          <motion.div
            animate={isSidebarOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-current origin-center"
          />
        </div>
      </button>

      {/* Desktop Full-Height Sidebar - Now overlay with backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSidebarToggle}
              className="hidden lg:block fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="hidden lg:block fixed left-0 top-0 h-full w-80 bg-black/60 backdrop-blur-xl border-r border-white/20 shadow-lg z-40 pt-20"
            >
              <div className="p-8 h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-12">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-light mb-4 select-none">Contents</h3>
                  <div className="w-8 h-[1px] bg-white/20"></div>
                </div>
                
                {/* Chapters */}
                <div className="space-y-6">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="group">
                      {/* Main Chapter Button */}
                      <button
                        onClick={() => {
                          if (chapter.subchapters) {
                            toggleChapter(chapter.id)
                          } else {
                            handleSectionClick(chapter.id)
                          }
                        }}
                        className={`w-full text-left transition-all duration-300 p-4 border-l-2 ${
                          activeSection === chapter.id 
                            ? 'border-l-white bg-white/5 text-white' 
                            : 'border-l-white/10 hover:border-l-white/30 hover:bg-white/[0.02] text-white/70 hover:text-white/90'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Chapter Number */}
                            <span className={`text-xs font-light tracking-wider transition-colors duration-300 ${
                              activeSection === chapter.id 
                                ? 'text-white/60' 
                                : 'text-white/30 group-hover:text-white/50'
                            }`}>
                              {chapter.number.padStart(2, '0')}
                            </span>
                            
                            {/* Chapter Title */}
                            <div className="flex-1">
                              <h4 className={`text-sm font-light tracking-wide leading-relaxed transition-colors duration-300 ${
                                activeSection === chapter.id ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                              }`}>
                                {chapter.title}
                              </h4>
                            </div>
                          </div>
                          
                          {/* Expand/Collapse Icon */}
                          {chapter.subchapters && (
                            <div className={`transition-all duration-300 ${
                              expandedChapters.has(chapter.id) ? 'rotate-90 text-white/60' : 'text-white/20 group-hover:text-white/40'
                            }`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Subchapters */}
                      <AnimatePresence>
                        {chapter.subchapters && expandedChapters.has(chapter.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 ml-8 space-y-3">
                              {chapter.subchapters.map((subchapter, subIndex) => (
                                <button
                                  key={subchapter.id}
                                  onClick={() => handleSectionClick(subchapter.id)}
                                  className={`w-full text-left group/sub transition-all duration-300 py-2 ${
                                    activeSection === subchapter.id 
                                      ? 'text-white' 
                                      : 'text-white/50 hover:text-white/80'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-light tracking-wider transition-colors duration-300 ${
                                      activeSection === subchapter.id 
                                        ? 'text-white/40' 
                                        : 'text-white/20 group-hover/sub:text-white/30'
                                    }`}>
                                      {subchapter.number}
                                    </span>
                                    <span className={`text-xs font-light tracking-wide transition-colors duration-300 ${
                                      activeSection === subchapter.id ? 'text-white' : 'text-white/50 group-hover/sub:text-white/80'
                                    }`}>
                                      {subchapter.title}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed left-4 top-24 z-40 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white/80 hover:text-white hover:bg-black/70 hover:border-white/30 shadow-lg transition-all duration-200"
        aria-label="Toggle chapter menu"
      >
        <div className="w-5 h-5 flex flex-col justify-center items-center">
          <motion.div
            animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-current mb-1 origin-center transition-colors"
          />
          <motion.div
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-0.5 bg-current mb-1"
          />
          <motion.div
            animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-current origin-center"
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
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-black/60 backdrop-blur-xl border-r border-white/20 shadow-lg z-40 pt-20"
            >
              <div className="p-8 h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-12">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-light mb-4 select-none">Contents</h3>
                  <div className="w-8 h-[1px] bg-white/20"></div>
                </div>
                
                {/* Chapters */}
                <div className="space-y-6">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="group">
                      {/* Main Chapter Button */}
                      <button
                        onClick={() => {
                          if (chapter.subchapters) {
                            toggleChapter(chapter.id)
                          } else {
                            handleSectionClick(chapter.id)
                          }
                        }}
                        className={`w-full text-left transition-all duration-300 p-4 border-l-2 ${
                          activeSection === chapter.id 
                            ? 'border-l-white bg-white/5 text-white' 
                            : 'border-l-white/10 hover:border-l-white/30 hover:bg-white/[0.02] text-white/70 hover:text-white/90'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Chapter Number */}
                            <span className={`text-xs font-light tracking-wider transition-colors duration-300 ${
                              activeSection === chapter.id 
                                ? 'text-white/60' 
                                : 'text-white/30 group-hover:text-white/50'
                            }`}>
                              {chapter.number.padStart(2, '0')}
                            </span>
                            
                            {/* Chapter Title */}
                            <div className="flex-1">
                              <h4 className={`text-sm font-light tracking-wide leading-relaxed transition-colors duration-300 ${
                                activeSection === chapter.id ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                              }`}>
                                {chapter.title}
                              </h4>
                            </div>
                          </div>
                          
                          {/* Expand/Collapse Icon */}
                          {chapter.subchapters && (
                            <div className={`transition-all duration-300 ${
                              expandedChapters.has(chapter.id) ? 'rotate-90 text-white/60' : 'text-white/20 group-hover:text-white/40'
                            }`}>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Subchapters */}
                      <AnimatePresence>
                        {chapter.subchapters && expandedChapters.has(chapter.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 ml-8 space-y-3">
                              {chapter.subchapters.map((subchapter, subIndex) => (
                                <button
                                  key={subchapter.id}
                                  onClick={() => handleSectionClick(subchapter.id)}
                                  className={`w-full text-left group/sub transition-all duration-300 py-2 ${
                                    activeSection === subchapter.id 
                                      ? 'text-white' 
                                      : 'text-white/50 hover:text-white/80'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-light tracking-wider transition-colors duration-300 ${
                                      activeSection === subchapter.id 
                                        ? 'text-white/40' 
                                        : 'text-white/20 group-hover/sub:text-white/30'
                                    }`}>
                                      {subchapter.number}
                                    </span>
                                    <span className={`text-xs font-light tracking-wide transition-colors duration-300 ${
                                      activeSection === subchapter.id ? 'text-white' : 'text-white/50 group-hover/sub:text-white/80'
                                    }`}>
                                      {subchapter.title}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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