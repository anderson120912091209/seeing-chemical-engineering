import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/app/contexts/theme-context'


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
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  const { theme } = useTheme();

  const sidebarBg = theme === 'dark'
    ? 'rgba(0, 0, 0, 0.3)'
    : 'rgba(255, 255, 255, 0.92)';
  const sidebarStyle = {
    background: sidebarBg,
    WebkitBackdropFilter: 'blur(18px)',
    backdropFilter: 'blur(18px)',
    backgroundColor: sidebarBg,
    borderRight: theme === 'dark' ? '1px solid rgba(255,255,255,0.10)' : '1px solid #e5e7eb',
  };

  const textColor = theme === 'dark' ? '#fff' : '#222';
  const textColorMuted = theme === 'dark' ? '#bbb' : '#444';
  const textColorActive = theme === 'dark' ? '#e0eaff' : '#2563eb';
  const textColorNumber = theme === 'dark' ? '#b5b5b5' : '#666';
  
  // Theme-aware hover colors
  const hoverBg = theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.04)' 
    : '#f5f5f5'; // light grey for light mode

  // Theme-aware colors for active/selected state
  const activeBg = theme === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : '#f0f0f0'; // light grey for active background in light mode
  const activeTextColor = theme === 'dark' ? '#60a5fa' : '#2d2d2d'; // darker text for light mode
  const activeBorderColor = theme === 'dark' ? '#fff' : '#5a5a5a'; // lighter dark color for border in light mode

  
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
        className="hidden lg:block fixed left-4 top-20 z-40 
        bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-2 
        text-white/50 hover:text-white/70 hover:bg-black/70 hover:border-white/30 shadow-lg transition-all duration-300"
      >
        <div className="w-4 h-4 flex flex-col justify-center items-center">
          <motion.div
            animate={isSidebarOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current mb-0.5 origin-center transition-colors"
          />
          <motion.div
            animate={isSidebarOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-4 h-0.5 bg-current mb-0.5"
          />
          <motion.div
            animate={isSidebarOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current origin-center"
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
              className="hidden lg:block fixed left-0 top-0 h-full w-80 border-r shadow-lg z-40 pt-20"
              style={sidebarStyle}
            >
              <div className="p-8 h-full overflow-y-auto">
                {/* Header */}
                <div className="mb-12">
                  <h3 className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-light mb-4 select-none"
                  style={{ color: textColorMuted }}>Contents</h3>
                  <div className="w-8 h-[1px]" style={{ backgroundColor: textColorMuted }}></div>
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
                        onMouseEnter={() => setHoveredChapter(chapter.id)}
                        onMouseLeave={() => setHoveredChapter(null)}
                        className="w-full text-left transition-all duration-300 p-4"
                        style={{
                          backgroundColor: activeSection === chapter.id 
                            ? activeBg
                            : (hoveredChapter === chapter.id ? hoverBg : 'transparent'),
                          color: activeSection === chapter.id ? activeTextColor : textColor,
                          borderLeft: activeSection === chapter.id 
                            ? `2px solid ${activeBorderColor}`
                            : (theme === 'dark' ? '2px solid rgba(255,255,255,0.10)' : '2px solid #e5e7eb'),
                          borderRadius: '0px',
                          marginBottom: '2px',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Chapter Number */}
                            <span
                              className="text-xs font-light tracking-wider transition-colors duration-300"
                              style={{ color: activeSection === chapter.id ? textColorNumber : textColorMuted }}
                            >
                              {chapter.number.padStart(2, '0')}
                            </span>
                            
                            {/* Chapter Title */}
                            <div className="flex-1">
                              <h4
                                className="text-sm font-light tracking-wide leading-relaxed transition-colors duration-300"
                                style={{ color: activeSection === chapter.id ? textColor : textColorMuted }}
                              >
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
                                    <span
                                      className="text-[10px] font-light tracking-wider transition-colors duration-300"
                                      style={{ color: activeSection === subchapter.id ? textColorNumber : textColorMuted }}
                                    >
                                      {subchapter.number}
                                    </span>
                                    <span
                                      className="text-xs font-light tracking-wide transition-colors duration-300"
                                      style={{ color: activeSection === subchapter.id ? textColor : textColorMuted }}
                                    >
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
        className="lg:hidden fixed left-4 top-20 z-40 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white/50 hover:text-white/70 hover:bg-black/70 hover:border-white/30 shadow-lg transition-all duration-200"
        aria-label="Toggle chapter menu"
      >
        <div className="w-4 h-4 flex flex-col justify-center items-center">
          <motion.div
            animate={isMobileMenuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
            className="w-4 h-0.5 bg-current mb-0.5 origin-center transition-colors"
          />
          <motion.div
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-4 h-0.5 bg-current mb-0.5"
          />
          <motion.div
            animate={isMobileMenuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
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
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 border-r shadow-lg z-40 pt-20"
              style={sidebarStyle}
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
                        onMouseEnter={() => setHoveredChapter(chapter.id)}
                        onMouseLeave={() => setHoveredChapter(null)}
                        className="w-full text-left transition-all duration-300 p-4"
                        style={{
                          backgroundColor: activeSection === chapter.id 
                            ? activeBg
                            : (hoveredChapter === chapter.id ? hoverBg : 'transparent'),
                          color: activeSection === chapter.id ? activeTextColor : textColor,
                          borderLeft: activeSection === chapter.id 
                            ? `2px solid ${activeBorderColor}`
                            : (theme === 'dark' ? '2px solid rgba(255,255,255,0.10)' : '2px solid #e5e7eb'),
                          borderRadius: '0px',
                          marginBottom: '2px',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Chapter Number */}
                            <span
                              className="text-xs font-light tracking-wider transition-colors duration-300"
                              style={{ color: activeSection === chapter.id ? textColorNumber : textColorMuted }}
                            >
                              {chapter.number.padStart(2, '0')}
                            </span>
                            
                            {/* Chapter Title */}
                            <div className="flex-1">
                              <h4
                                className="text-sm font-light tracking-wide leading-relaxed transition-colors duration-300"
                                style={{ color: activeSection === chapter.id ? textColor : textColorMuted }}
                              >
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
                                    <span
                                      className="text-[10px] font-light tracking-wider transition-colors duration-300"
                                      style={{ color: activeSection === subchapter.id ? textColorNumber : textColorMuted }}
                                    >
                                      {subchapter.number}
                                    </span>
                                    <span
                                      className="text-xs font-light tracking-wide transition-colors duration-300"
                                      style={{ color: activeSection === subchapter.id ? textColor : textColorMuted }}
                                    >
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