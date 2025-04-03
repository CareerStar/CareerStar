import React, { useState } from 'react';
import RoadmapActivityBar from './RoadmapActivityBar';
import MentimeterPlugin from '../module-items/MentimeterPlugin';
import CanvaSlidesPlugin from '../module-items/CanvaSlidesPlugin';
import JeopardyPlugin from '../module-items/JeopardyPlugin';

function Modules() {
    const [loading, setLoading] = useState(false);

    return (
        <div className='roadmap-container'>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className='roadmap-phases-container'>
                <div className='roadmap-phase flex-column'>
                    <p className='roadmap-phase-title'>Cold to Gold: Your Professional Connection Blueprint</p>
                    <CanvaSlidesPlugin activityName='Workshop presentation' url='https://www.canva.com/design/DAGecsQG1Zs/ZFVtG0oaPYKQzLL0GxebAQ/view?embed'/>
                    <MentimeterPlugin activityName=' Ice breaker' url='https://www.menti.com/alpntzfaofi4'/>
                    <MentimeterPlugin activityName=' Cold Call Messages' url='https://www.menti.com/alrcdjk8ccyq' />
                    <MentimeterPlugin activityName=' Workshop feedback' url='https://www.menti.com/al5oj1os25oo' />
                    <RoadmapActivityBar activityName='Offline Activity: Better Cold Call LinkedIn Messages' activityId='3' showStatus = {false} showStar = {false} />
                    <RoadmapActivityBar activityName='Offline Activity: Reaching Out To More Than Recruiters' activityId='1' showStatus = {false} showStar = {false}/>
                    <RoadmapActivityBar activityName='Offline Activity: Career Acronym Challenge' activityId='2' showStatus = {false} showStar = {false}/>
                    
                    <p className='roadmap-phase-title'>Perfect Your Pitch - Crafting Your 60-Second Story</p>
                    <CanvaSlidesPlugin activityName='Workshop presentation' url='https://www.canva.com/design/DAGYHOxOd78/ewUztoW9L7NgpKHckBbqCA/view?embed'/>
                    <MentimeterPlugin activityName=' Ice breaker' url='https://www.menti.com/alpntzfaofi4'/>
                    <MentimeterPlugin activityName=' Workshop feedback' url='https://www.menti.com/al5oj1os25oo' />
                    <RoadmapActivityBar activityName='Offline Activity: Let’s Network Before We Network' activityId='5' showStatus = {false} showStar = {false}/>

                    <p className='roadmap-phase-title'>Hard Questions, Better Answers</p>
                    <CanvaSlidesPlugin activityName='Workshop presentation' url='https://www.canva.com/design/DAGYHOxOd78/ewUztoW9L7NgpKHckBbqCA/view?embed'/>
                    <MentimeterPlugin activityName=' Ice breaker' url='https://www.menti.com/al14wx9gcdgu'/>
                    {/* <JeopardyPlugin activityName='Jeopardy Game' url='https://jeopardylabs.com/play/hello-2033?embed=1'/> */}
                    <JeopardyPlugin activityName='Jeopardy Game' url='https://jeopardylabs.com/play/mock-interview-jeopardy-5?embed=1'/>
                    <MentimeterPlugin activityName=' Workshop feedback' url='https://www.menti.com/al5oj1os25oo' />
                    <RoadmapActivityBar activityName='Offline Activity: The Dreaded Salary Talk' activityId='7' showStatus = {false} showStar = {false}/>

                    <p className='roadmap-phase-title'>Navigating Career Success Beyond Borders</p>
                    <RoadmapActivityBar activityName='Quiz: Test your knowledge' activityId='6' showStatus = {false} showStar = {false} />
                </div>
            </div>
        </div>
    );
}

export default Modules;