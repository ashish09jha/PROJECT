import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components for modal and form
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(SubmitButton)`
  background-color: #f44336;

  &:hover {
    background-color: #e53935;
  }
`;

// Loader Component
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 16px;
  color: #4CAF50;
`;

// Modal form for adding a live class
const LiveClasses = ({ onClose, fetchClasses }) => {
  const [meetLink, setMeetLink] = useState('');
  const [StartTime, setStartTime] = useState('');
  const [EndTime, setEndTime] = useState('');
  const [Course, setCourse] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append('meetLink', meetLink);
    formData.append('StartTime', StartTime);
    formData.append('EndTime', EndTime);
    formData.append('Course', Course);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      await axios.post('http://localhost:8000/api/v1/users/liveCourses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Live class added successfully');
      fetchClasses(); // Fetch updated list after adding a class
      onClose(); // Close modal
    } catch (error) {
      console.error('Error adding live class:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2 className="text-xl font-semibold mb-4">Add Live Class</h2>
        {isLoading ? ( // Show loader while loading
          <Loader>Uploading...</Loader>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Meet Link</label>
              <Input
                type="text"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Start Time</label>
              <Input
                type="datetime-local"
                value={StartTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">End Time</label>
              <Input
                type="datetime-local"
                value={EndTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Course/Syllabus</label>
              <Input
                type="text"
                value={Course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload Thumbnail</label>
              <Input
                type="file"
                onChange={(e) => setThumbnail(e.target.files[0])}
                accept="image/*"
                required
              />
            </div>
            <ButtonContainer>
              <SubmitButton type="submit" disabled={isLoading}>Add Class</SubmitButton>
              <CancelButton type="button" onClick={onClose} disabled={isLoading}>
                Cancel
              </CancelButton>
            </ButtonContainer>
          </form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

// Main live classes container component
const LiveClassesContainer = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [liveClasses, setLiveClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/liveCourses');
      setLiveClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    }
  };

  // Fetch live classes when the component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  // Format the start and end time in the desired format
  const formatDateTime = (StartTime, EndTime) => {
    const date = new Date(StartTime).toLocaleDateString(); // Get only the date
    const start = new Date(StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format to HH:MM
    const end = new Date(EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format to HH:MM
    return (
      <>
        <p>{date}</p>
        <p>{start} - {end}</p>
      </>
    );
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl relative">
      <div className="absolute top-4 right-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setIsFormOpen(true)}
        >
          Add Live Class
        </button>
      </div>
      {isFormOpen && <LiveClasses onClose={() => setIsFormOpen(false)} fetchClasses={fetchClasses} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {liveClasses.length > 0 ? (
          liveClasses.map((liveClass) => (
            <div key={liveClass._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <a href={liveClass.meetLink} target="_blank" rel="noopener noreferrer">
                <img src={liveClass.thumbnail} alt={liveClass.Course} className="w-full h-48 object-cover" />
              </a>
              <div className="p-4 flex justify-between items-center">
                <div className="text-gray-600">
                  {formatDateTime(liveClass.StartTime, liveClass.EndTime)}
                </div>
                <a
                  href={liveClass.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Join
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No live classes available</p>
        )}
      </div>
    </div>
  );
};

export default LiveClassesContainer;
