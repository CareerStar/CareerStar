import React from 'react';
import editIcon from '../../assets/images/edit-icon.png';
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
        </div>
    );
};

export default Roadmap;