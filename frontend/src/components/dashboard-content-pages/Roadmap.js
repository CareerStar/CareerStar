import React from 'react';
import editIcon from '../../assets/images/edit-icon.png';
import starEmpty from '../../assets/images/star-empty.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
function Roadmap() {
    return (
        <div className='roadmap-container'>
            <p className='roadmap-title'>My Roadmap</p>
            <div className='roadmap-goals-container flex-row'>
                <div className='roadmap-goal-card flex-column'>
                    <img src={editIcon} alt='Edit icon' />
                    <p className='roadmap-goal-card-heading'>Where you’re at</p>
                    <p className='roadmap-goal-card-answer'>I’m a recent grad</p>
                </div>
                <div className='roadmap-goal-card flex-column'>
                    <img src={editIcon} alt='Edit icon' />
                    <p className='roadmap-goal-card-heading'>The goal</p>
                    <p className='roadmap-goal-card-answer'>To get my first full-time role as a software engineer</p>
                </div>
            </div>

            <div className='roadmap-phases-container'>
                <div className='roadmap-phase flex-column'>
                    <p className='roadmap-phase-title'>Phase 1: Values & Goals</p>
                    <div>
                        <div className='roadmap-sub-phase flex-row'>
                            <div className='roadmap-phase-card'>
                                <input
                                    type="checkbox"
                                />
                                <p>Looking back <span className='bold'>1 year</span> from now, what do you want to have accomplished professionally?</p>
                                <img src={downArrow} alt='Down arrow icon' />
                            </div>
                            <div className='roadmap-phase-star-count flex-row'>
                                <p>5</p>
                                <img src={starEmpty} alt='Star icon' />
                            </div>
                        </div>

                        <div className='roadmap-sub-phase flex-row'>
                            <div className='roadmap-phase-card'>
                                <input
                                    type="checkbox"
                                />
                                <p>Let’s identify your <span className='bold'>Values</span></p>
                                <img src={downArrow} alt='Down arrow icon' />
                            </div>
                            <div className='roadmap-phase-star-count flex-row'>
                                <p>5</p>
                                <img src={starEmpty} alt='Star icon' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;