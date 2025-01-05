import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';

const Kanban = () => {
    // Variables
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const urlParams = useParams();

    // States
    const [tasks, setTasks] = useState({
        todo: [{
            "item": "",
        }],
        inProgress: [{
            "item": ""
        }],
        done: [{
            "item": ""
        }]
    });

    // Make API calls
    useEffect(() => {
        async function fetchData() {
            await axios.get(`${BACKEND_URL}/projects/${urlParams.project_name}/kanban`)
                .then((res) => {
                    const data = res.data;
                    console.log(data)
                    setTasks({ ...data });
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    console.log('API call finished');
                })
        }
        fetchData()
    }, []);

    //add task function
    const addTask = async (column, task) => {
        if (!task) return;
        setTasks({
            ...tasks,
            [column]: [...tasks[column], {'item': task}]
        });
        await axios.get(`${BACKEND_URL}/projects/${urlParams.project_name}/kanban/${column}/add?item=${task}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                console.log('API call finished');
            })
    };

    //remove task function
    const removeTask = async (column, index) => {
        const item = tasks[column][index];
        console.log(item)
        const newTasks = tasks[column].filter((_, i) => i !== index);
        setTasks({
            ...tasks,
            [column]: newTasks
        });
        await axios.get(`${BACKEND_URL}/projects/${urlParams.project_name}/kanban/${column}/remove?item=${item['item']}`)
            .then((res) => {
                console.log("Removed", res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    };

    // function to move to the next column
    const moveTask = async (from, to, index) => {
        const task = tasks[from][index];
        console.log(from, to, task);
        const newTasks = tasks[from].filter((_, i) => i !== index);
        setTasks({
            ...tasks,
            [from]: newTasks,
            [to]: [...tasks[to], task]
        });
        await axios.get(`${BACKEND_URL}/projects/${urlParams.project_name}/kanban/${from}/to/${to}/move?item=${task['item']}`)
            .then((res) => {
                console.log("Moved", res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    };

    return (
        <div className=" p-16 pt-24 dark:bg-gray-900 dark:text-white bg-white text-black">
            <h1 className="text-3xl text-center font-bold mb-4">Kanban Board</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['todo', 'inProgress', 'done'].map((column) => (
                    <div key={column} className="p-4 rounded-lg dark:bg-gray-800 bg-gray-200">
                        <h2 className="text-xl text-center font-semibold mb-2 capitalize">{column}</h2>
                        <ul>
                            {tasks[column].map((task, index) => {
                                if (task["item"] === "") 
                                    return null;
                                return <li key={index} className="p-2 rounded mb-2 dark:bg-gray-700 bg-gray-300 flex justify-between items-center">
                                    {task["item"]}
                                    <div>
                                        {column !== 'done' && (
                                            <button
                                                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2 mb-2 md:mb-0"
                                                onClick={() => moveTask(column, column === 'todo' ? 'inProgress' : 'done', index)}
                                            >
                                                {column === 'todo' ? 'Start' : 'Finish'}
                                            </button>
                                        )}
                                        {column !== 'todo' && (
                                            <button
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded mr-2 mb-2 md:mb-0"
                                                onClick={() => moveTask(column, column === 'done' ? 'inProgress' : 'todo', index)}
                                            >
                                                {column === 'done' ? 'Undo' : 'Back'}
                                            </button>
                                        )}
                                        <button
                                            className="bg-red-400 hover:bg-red-500 text-white font-bold py-1 px-2 rounded"
                                            onClick={() => removeTask(column, index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            })}
                        </ul>
                        <button
                            className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 w-full rounded"
                            onClick={() => addTask(column, prompt(`Add a new task to ${column}`))}
                        >
                            + Add Task
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kanban;
