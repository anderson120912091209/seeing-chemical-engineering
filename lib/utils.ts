import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useRef, useState } from "react"
import { StringToBoolean } from "class-variance-authority/types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ======= CHAPTER CONFIGURATIOn TYPES =======
export interface ChapterConfig {
  id: string;
  title: string; 
  number: string;
  hasStages: boolean;
  content: React.ComponentType<any>;
  animation?: React.ComponentType<any>;
  stages?: readonly string[];
  defaultStage?: string;
  infoPanel?: React.ComponentType<any>;
}

export interface SectionRef {
  id: string;
  ref:React.RefObject<HTMLDivElement>;
}

// ======== CHAPTER OBSERVER HOOK ==========
export const useChapterObserver = (
  sectionRefs: SectionRef[],
  chapters: ChapterConfig[],
  options?: IntersectionObserverInit
) => {
  const [currentChapter, setCurrentChapter] = useState<ChapterConfig | null>(
    chapters[0] || null
  );
  const [activeSection, setActiveSection] = useState<string>(
    chapters[0]?.id || ''
  );

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
    ...options
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          
          // Find the corresponding chapter
          const chapter = chapters.find(ch => ch.id === sectionId);
          if (chapter) {
            setCurrentChapter(chapter);
          }
        }
      });
    }, defaultOptions);

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs, chapters, defaultOptions]);

  return {
    currentChapter,
    activeSection,
    setActiveSection: (sectionId: string) => {
      setActiveSection(sectionId);
      const chapter = chapters.find(ch => ch.id === sectionId);
      if (chapter) {
        setCurrentChapter(chapter);
      }
    }
  };
};

//Helper Functions 
/* ---------------------------------------------------------------------------
1. createStageControls(STAGES, currentStage, setCurrentStage, 'default stage')
----------------------------------------------------------------------------*/

/*CREATE STAGE CONTROLS FOR ANIMATIONS WITH SECTIONS 
專門用來控制有階段性的動畫，這個是用來連接 NavProgressButton 的控制系統
含有 Next, Prev and Reset 功能並控制動畫的階段*/

export const createStageControls = <T extends readonly string[]>(
  stages: T,
  currentStage: T[number],
  setCurrentStage: (stage: T[number]) => void,
  initialStage: T[number]
) => ({
  next: () => {
    const currentIndex = stages.indexOf(currentStage)
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1])
    }
  },
  prev: () => {
    const currentIndex = stages.indexOf(currentStage)
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1])
    }
  },
  reset: () => setCurrentStage(initialStage)
})

