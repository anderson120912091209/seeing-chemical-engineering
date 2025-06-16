import React from 'react'
import ClickableUnderline from '../ui/clickable-underline'
import { Button } from '@/components/ui/button'

interface AnovaDescriptionProps {
  onBetweenClick: () => void;
  onWithinClick: () => void;
}

const AnovaDescription = ({ onBetweenClick, onWithinClick }: AnovaDescriptionProps) => {
  return (
    <>
      <p>
        Analysis of Variance (ANOVA) helps us understand if there are{' '}
        <ClickableUnderline color="blue" onClick={onBetweenClick}>
          significant differences
        </ClickableUnderline>{' '}
        between the means of several groups. 
        The core concept is to compare the variation{' '}
        <ClickableUnderline color="blue" onClick={onBetweenClick}>
          between
        </ClickableUnderline>{' '}
        the groups to the variation{' '}
        <ClickableUnderline color="blue" onClick={onWithinClick}>
          within
        </ClickableUnderline>{' '}
        each group.
      </p>
      <p>
        Imagine you're an educational researcher comparing <span className="font-bold"> three teaching methods </span> (A, B, C) to see 
        which yields the best <span className="font-bold"> exam scores.</span>
      </p>
      <p>
        <span className="font-bold underline-blue"> KEY QUESTION</span>: the measured average score differ, but is that due a real "
        <span className="font-bold underline-blue">method effect</span>" in teaching methods or is it just random chance? 
        <br/> How can we possibly test this out?
      </p>
      
      <p>
        Well, if the <span className="font-bold underline-blue">variation</span> {" "}
        <span className="font-bold underline-blue">between</span> groups is much larger than {" "}
        <span className="font-bold underline-blue">within</span> them, {" "}
        it's a strong indicator that the groups are genuinely different. 
         Let's collect some data first! 
      </p>
      <p className="text-lg font-bold ">
        Start the experiment! 
      </p>
    </>
  )
}

export default AnovaDescription