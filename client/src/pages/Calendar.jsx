// Calendar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScheduleComponent, ViewsDirective, ViewDirective, Inject, Day, Week, Month } from '@syncfusion/ej2-react-schedule';

const Calendar = () => {
    const [events, setEvents] = useState([]);

    // Function to fetch classes
    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/users/liveCourses');
            console.log(response.data.data); // Log the data to check the structure
            const data = response.data.data;

            const formattedEvents = data.map((liveClass) => ({
                Id: liveClass._id,
                Subject: liveClass.Course,
                StartTime: new Date(liveClass.StartTime),
                EndTime: new Date(new Date(liveClass.StartTime).getTime() + 60 * 60 * 1000), // 1-hour duration
                Location: 'Online', // Set location to 'Online' by default
                Description: `Join via: ${liveClass.meetLink}`,
                Thumbnail: liveClass.thumbnail,
            }));

            console.log("Formatted Events:", formattedEvents); // Check the formatted events
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching classes:", error); 
        }
    };

    // Call fetchClasses when the component mounts
    useEffect(() => {
        fetchClasses();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <ScheduleComponent
            height='650px'
            selectedDate={new Date('2024-10-02')} // Set this to the date of your classes
            eventSettings={{ dataSource: events }}
        >
            <ViewsDirective>
                <ViewDirective option='Day' />
                <ViewDirective option='Week' />
                <ViewDirective option='Month' />
            </ViewsDirective>
            <Inject services={[Day, Week, Month]} />
        </ScheduleComponent>
    );
};

export default Calendar;
