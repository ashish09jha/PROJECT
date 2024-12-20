import React, { useState, useEffect } from 'react';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { Header } from '../components';
import axios from 'axios';

const kanbanGrid = [
  { headerText: 'To Do', keyField: 'To Do', allowToggle: true },
  { headerText: 'In Progress', keyField: 'In Progress', allowToggle: true },
  { headerText: 'Done', keyField: 'Done', allowToggle: true },
];

const Kanban = () => {
  const [kanbanData, setKanbanData] = useState([]);
  const [newTask, setNewTask] = useState({ task: '', summary: '', status: 'To Do' });

  // Fetch Kanban data from the backend
  const fetchKanbanData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/todos');
      setKanbanData(response.data.data);
    } catch (error) {
      console.error('Error fetching Kanban data:', error);
    }
  };

  // Add a new task to the database
  const addTask = async (task) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/todos', task);
      setKanbanData((prevKanbanData) => [...prevKanbanData, response.data.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskDetails = async (taskId, updatedDetails) => {
    console.log(1);
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/users/todos/${taskId}`, updatedDetails);
      const updatedTasks = kanbanData.map((task) => 
        task._id === taskId ? { ...task, ...response.data.data } : task
      );
      setKanbanData(updatedTasks);
    } catch (error) {
      console.error('Error updating task details:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/users/todos/${taskId}`);
      setKanbanData(kanbanData.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTask);
    setNewTask({ task: '', summary: '', status: 'To Do' });
  };

  const handleActionComplete = (args) => {
    console.log(args)
    if (args.requestType === 'cardChanged') {
      const updatedTask = {
        task: args.changedRecords[0].task,
        summary: args.changedRecords[0].summary,
        status: args.changedRecords[0].status,
      };
      updateTaskDetails(args.changedRecords[0]._id, updatedTask);
    } else if (args.requestType === 'cardRemoved') {
      const taskId = args.deletedRecords[0]._id;
      deleteTask(taskId);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="ToDo" />
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          name="task" 
          value={newTask.task} 
          onChange={handleInputChange} 
          placeholder="Task Name" 
          required 
          className="mr-2 p-2 border rounded" 
        />
        <input 
          name="summary" 
          value={newTask.summary} 
          onChange={handleInputChange} 
          placeholder="Task Summary" 
          required 
          className="mr-2 p-2 border rounded" 
        />
        <select 
          name="status" 
          value={newTask.status} 
          onChange={handleInputChange} 
          className="mr-2 p-2 border rounded"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button 
          type="submit" 
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Task
        </button>
      </form>
      <KanbanComponent
        id="kanban"
        keyField="status"
        dataSource={kanbanData}
        cardSettings={{ contentField: 'summary', headerField: 'task' }}
        actionComplete={handleActionComplete}
      > 
        <ColumnsDirective>
          {kanbanGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default Kanban;
