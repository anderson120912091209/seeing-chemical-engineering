import React from 'react'

interface NavProgressButtonProps {
  stage: string
  stages: string[]
  onPrevious: () => void
  onNext: () => void
  onReset: () => void
  padding?: { left: number; right: number }
  nextButtonText?: string
  disabled?: boolean
  variant?: 'absolute' | 'relative'
}

const NavProgressButton: React.FC<NavProgressButtonProps> = ({
  stage,
  stages,
  onPrevious,
  onNext,
  onReset,
  padding = { left: 20, right: 20 },
  nextButtonText,
  disabled = false,
  variant = 'absolute'
}) => {
  const currentStageIndex = stages.indexOf(stage)
  const isFirstStage = currentStageIndex === 0
  const isLastStage = currentStageIndex === stages.length - 1

  const getStageDisplayName = (stageName: string) => {
    const stageMap: Record<string, string> = {
      'intro': 'Start Collecting Data',
      'grouped': 'Group Students',
      'scored': 'Show Scores',
      'analysis': 'Statistical Analysis',
      'variance-setup': 'Calculate Group Means',
      'within-variance': 'Within-Group Sum of Squares',
      'between-variance': 'Between-Group Sum of Squares',
      'f-test': 'F-Statistic Calculation',
      'conclusion': 'Final Results'
    }
    return stageMap[stageName] || stageName.charAt(0).toUpperCase() + stageName.slice(1)
  }

  const getStageDescription = (stageName: string) => {
    const descMap: Record<string, string> = {
      'intro': 'Meet the students',
      'grouped': 'Organize by teaching method',
      'scored': 'Reveal exam scores',
      'analysis': 'Calculate group statistics',
      'variance-setup': 'Draw group mean lines',
      'within-variance': 'Measure variation within groups',
      'between-variance': 'Measure variation between groups',
      'f-test': 'Calculate final test statistic',
      'conclusion': 'Interpret the results'
    }
    return descMap[stageName] || ''
  }

  const getNextButtonText = () => {
    if (nextButtonText) return nextButtonText
    if (isFirstStage) return 'Begin'
    if (isLastStage) return 'Complete'
    return 'Continue'
  }

  const nextStage = !isLastStage ? stages[currentStageIndex + 1] : null
  const previousStage = !isFirstStage ? stages[currentStageIndex - 1] : null

  const containerClasses = variant === 'absolute' 
    ? "absolute bottom-6"
    : "relative w-full"

  const containerStyle = variant === 'absolute' 
    ? {
        left: `${padding.left}px`,
        right: `${padding.right}px`,
      }
    : {}

  return (
    <div
      className={containerClasses}
      style={containerStyle}
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 lg:p-5 w-fit min-w-full mx-auto">
        
        {/* Top Row: Current Stage & Progress */}
        <div className="flex items-center justify-between mb-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="text-white text-lg font-semibold whitespace-nowrap">
              {getStageDisplayName(stage)}
            </div>
            <div className="text-white/50 text-sm whitespace-nowrap">
              Step {currentStageIndex + 1} of {stages.length}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[#81a8e7] text-sm font-medium whitespace-nowrap">
              {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
            </span>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#81a8e7] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={isFirstStage || disabled}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 
            hover:bg-white/10 disabled:bg-white/5 disabled:opacity-40 border 
            border-white/10 hover:border-white/20 disabled:border-white/5 rounded-lg 
            text-white/70 hover:text-white disabled:text-white/30 text-sm transition-all 
            duration-200 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div>Previous</div>
              {previousStage && (
                <div className="text-xs text-white/40 whitespace-nowrap">
                  {getStageDisplayName(previousStage)}
                </div>
              )}
            </div>
          </button>

          {/* Stage Dots */}
          <div className="flex items-center gap-2">
            {stages.map((s, index) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index <= currentStageIndex 
                    ? 'bg-[#81a8e7] scale-110' 
                    : 'bg-white/20'
                }`}
                title={getStageDisplayName(s)}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={isLastStage || disabled}
            className="flex items-center gap-2 px-4 py-2 bg-[#81a8e7] 
            hover:bg-[#6b94d9] disabled:bg-white/5 disabled:opacity-40 
            border border-[#81a8e7]/50 hover:border-[#6b94d9] disabled:border-white/5 
            rounded-lg text-white disabled:text-white/30 text-sm font-medium transition-all
             duration-200 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <div className="text-right">
              <div>{getNextButtonText()}</div>
              {nextStage && (
                <div className="text-xs text-white/80 whitespace-nowrap">
                  {getStageDisplayName(nextStage)}
                </div>
              )}
            </div>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={disabled}
          className="absolute top-2 right-2 flex items-center gap-1 
          px-2 py-1 text-white/30 hover:text-white/50 text-xs transition-colors 
          duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 
            2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  )
}

export default NavProgressButton