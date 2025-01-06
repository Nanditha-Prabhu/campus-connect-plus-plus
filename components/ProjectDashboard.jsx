import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const ProjectDashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const urlParams = useParams();
    
    // const project = {
    //     title: "Project Title",
    //     description: "This is a brief description of the project.",
    //     status: "yet to start",
    //     teamMembers: ["Member 1", "Member 2", "Member 3"],
    //     mentors: ["Mentor 1", "Mentor 2"],
    //     kanbanLink: "/kanban",
    //     calendarLink: "/calendar"
    // };
    const [project, setProjectDetails] = useState({
        title: "",
        description: "",
        status: "yet to start",
        teamMembers: [],
        mentors: [],
        kanbanLink: `/projects/${urlParams.project_name}/kanban`,
        calendarLink: `/projects/${urlParams.project_name}/calendar`
    })

    useEffect(() => {
        async function fetchData() {
            // Fetch project details
            console.log(urlParams.project_name)
            await axios.get(`${BACKEND_URL}/projects/${urlParams.project_name}`)
                .then(response => {
                    console.log(response);
                    setProjectDetails({...project, ...response.data})
                })
                .catch(error => console.error('Error fetching project details:', error));
        }
        fetchData();
    }, []);

    return (
        <div className="p-10 pt-24 font-sans bg-white dark:bg-gray-900 dark:text-white ">
            <h1 className="text-3xl font-bold mb-4 border-b-2 pb-2 border-gray-300 dark:border-gray-700">{project.title}</h1>
            <p className="mb-6 text-lg">{project.description}</p>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Project Status</h2>
                <p className={`text-lg p-2 rounded-md ${project.status?.toLowerCase() === "completed" ? "bg-green-100 dark:bg-green-800" : project.status?.toLowerCase() === "yet to start" ? "bg-yellow-100 dark:bg-yellow-300" : "bg-blue-100 dark:bg-blue-600"}`}>In Progress</p>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <h2 className="text-2xl font-semibold mb-2">Team Members</h2>
                    <ul className="space-y-1">
                        {project.teamMembers?.map((member, index) => (
                            <li key={index} className=" pl-5 bg-gray-200 dark:bg-gray-800 p-2 rounded-md">{member}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                    <h2 className="text-2xl font-semibold mb-2">Mentors</h2>
                    <ul className="space-y-1">
                        {project.mentors?.map((mentor, index) => (
                            <li key={index} className=" pl-5 bg-gray-200 dark:bg-gray-800 p-2 rounded-md">{mentor}</li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-md'>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-gray-200 dark:bg-gray-800 p-4 rounded-md">
                    <p>To know about the task assignments and their status, visit: </p>
                    <a href={project.kanbanLink} target="_blank" rel="noopener noreferrer" className=" mt-4 md:m-0 rounded border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-green-700">Kanban Page</a>
                </div>
                <div className='flex flex-col md:flex-row justify-between items-center bg-gray-200 dark:bg-gray-800 p-4 rounded-md'>
                    <p>To know about the meetings and deadlines, visit: </p>
                    <a href={project.calendarLink} target="_blank" rel="noopener noreferrer" className="mt-4 md:m-0 rounded border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-green-700">Calendar</a>
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard;
