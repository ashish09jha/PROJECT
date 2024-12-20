import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Calendar, Instructors, Stacked, Pyramid, Learners, Todo, Line, Area, Bar, Pie, Financial, Recorded_courses, Live_Classes, ColorMapping } from './pages';
import Signup from './pages/signup'; // Import Signup component
import './App.css';
import { useStateContext } from './contexts/ContextProvider'; 

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode'); 
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const [stackedChartData, setStackedChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/income/2024');
        if (response.data && response.data.data) {
          const studentIncome = response.data.data.student_income;
          const teacherIncome = response.data.data.teacher_income;

          const calculateTotalIncome = (data) => {
            const incomeByMonth = data.reduce((acc, curr) => {
              const { month, income } = curr;
              if (!acc[month]) {
                acc[month] = 0;
              }
              acc[month] += income;
              return acc;
            }, {});

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames.map((month) => ({
              x: month,
              y: incomeByMonth[month] || 0,
            }));
          };

          const updatedStudentGraphData = calculateTotalIncome(studentIncome);
          const updatedTeacherGraphData = calculateTotalIncome(teacherIncome);

          setStackedChartData([updatedStudentGraphData, updatedTeacherGraphData]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          
          <Route path="*" element={<MainLayout stackedChartData={stackedChartData} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const MainLayout = ({ stackedChartData }) => {
  const { currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  return (
    <div className={`flex relative dark:bg-main-dark-bg`}>
      <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            onClick={() => setThemeSettings(true)}
            style={{ background: currentColor, borderRadius: '50%' }}
            className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>

      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}

      <div
        className={
          activeMenu
            ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
            : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>

        {themeSettings && <ThemeSettings />}

        <Routes>
          <Route path="/e-learning" element={<Ecommerce />} />
          <Route path="/instructors" element={<Instructors />} /> 
          <Route path="/learners" element={<Learners />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="Recorded%20Courses" element={<Recorded_courses />} />
          <Route path="Live%20Classes" element={<Live_Classes />} />
          <Route path="/line" element={<Line />} />
          <Route path="/area" element={<Area />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/color-mapping" element={<ColorMapping />} />
          <Route path="/pyramid" element={<Pyramid />} />
          <Route path="/stacked" element={<Stacked stackedChartData={stackedChartData} />} />
        </Routes>

        <Footer />
      </div>
    </div>
  );
};

export default App;
