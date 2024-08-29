import React from 'react';
import ActivityCard from './ActivityCard';
import activity1 from '../assets/images/activity-1.png';
import activity2 from '../assets/images/activity-2.png';
import activity3 from '../assets/images/activity-3.png';
import activity4 from '../assets/images/activity-4.png';

function Activities() {
    const cards =
        [
            {
                image: activity1,
                tags: ['Profile', 'Event'],
                title: 'Complete your LinkedIn profile',
                description: 'Enhance your professional presence with a fully optimized LinkedIn profile. This step-by-step guide will walk you through the process, ensuring you showcase your skills and experience effectively.',
                starCount: 7
            },
            {
                image: activity2,
                tags: ['Event'],
                title: 'TechWalk - Brooklyn',
                description: 'This is a chance to network, share ideas, and build relationships in a healthy and refreshing alternative to the average happy hour.',
                starCount: 15
            },
            {
                image: activity3,
                tags: ['Upskill', 'Community'],
                title: 'Flushing Tech Meetup at TIQC',
                description: 'Get ready to dive into the world of innovation and collaboration at the Tech Incubator at Queens College, where the Flushing Tech Meetup is hosting an electrifying hackathon just for you!',
                starCount: 20
            },
            {
                image: activity4,
                tags: ['Tip of the day'],
                title: 'Showing confidence in job interviews',
                description: 'Watch our tip of the day: How to show confidence in job interviews. It’s easier than you think!',
                starCount: 3
            }
        ];
    return (
        <div className='activites-container'>
            <h1>Top Activities For You This Week</h1>
            <div className='activity-cards'>
                {cards.map(card => <ActivityCard image={card.image} tags={card.tags} title={card.title} description={card.description} starCount={card.starCount} />)}
            </div>
        </div>
    );
}

export default Activities;