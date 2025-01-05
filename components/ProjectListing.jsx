//A page that allows to search all the available projects as well as the projects that the user is working on. The user can also apply for the projects that are available. The user can also view the details of the project and submit the proposal if they are interested to work for it. The faculty incharge will review the proposal and get back to the user.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ProjectListing = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userProjects, setUserProjects] = useState([]);

    // The problem is that you are calling setProjects directly inside the component body, which causes an infinite re-render loop. To fix this, move the dummy project initialization inside a useEffect hook.
    useEffect(() => {
        // get projects
        axios.get(`${BACKEND_URL}/projects/`)
            .then((res) => {
                if (res.status === 200) {
                    setProjects(res.data.projects);
                }
            })
            .catch(error => console.error('Error fetching projects:', error));
        
            // get user projects
            axios.get(`${BACKEND_URL}/projects/`)
            .then(res => {
                if (res.status === 200) {
                    setUserProjects(res.data.projects);
                }
            })
            .catch(error => console.error('Error fetching projects:', error));            
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleApply = (projectId) => {
        // Logic to apply for a project
        axios.post(`/api/projects/${projectId}/apply`)
            .then(response => alert('Applied successfully!'))
            .catch(error => console.error('Error applying for project:', error));
    };

    const handleViewDetails = async (event, project_name) => {
        // Logic to view project details
        event.preventDefault();
        
        await axios.get(`${BACKEND_URL}/projects/${project_name}`)
            .then((res) => {
                console.log(res.data);
                if (res.status === 200)
                    navigate(`/project/${project_name}`);
            })
            .catch((err) => {
                console.error(err);
            })
        // alert(`Viewing details for project: ${project_name}`);
    }
    const filteredProjects = projects?.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-5 pt-24 bg-white dark:bg-gray-900 dark:text-white">
            <h1 className="text-2xl dark:text-white font-bold sm:text-3xl text-center mb-5">Project Listing</h1>
            <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 mb-5 rounded border border-gray-300 text-black"
            />
            <h2 className="text-lg dark:text-white font-semibold sm:text-2xl text-center mb-5">Available Projects</h2>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, idx) => (
                    <li key={idx} className=" border border-gray-300 mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <h3 className="m-0 mb-2 text-lg font-semibold">{project.title}</h3>
                        <p className="m-0 mb-2 text-gray-800 dark:text-gray-300">{project.description}</p>
                        <button
                            onClick={(e) => handleViewDetails(e, project.title)}
                            className="cursor-pointer rounded border border-gray-800 dark:border-yellow-200 bg-yellow-400 hover:bg-yellow-500 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-yellow-700 mr-2 mb-2 sm:mb-0"
                        >
                            View Details
                        </button>
                        <button
                            onClick={() => handleApply(project.id)}
                            className=" cursor-pointer rounded border border-gray-800 dark:border-green-200 bg-green-400 hover:bg-green-500 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-green-700"
                        >
                            Submit Proposal
                        </button>
                    </li>
                ))}
            </ul>
            <h2 className="text-lg dark:text-white font-semibold sm:text-2xl text-center mb-5">Your Projects</h2>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userProjects.map((project, idx) => (
                    <li key={idx} className="border border-gray-300 mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                        <h3 className="m-0 mb-2 text-lg font-semibold">{project.title}</h3>
                        <p className="m-0 mb-2 text-gray-800 dark:text-gray-300">{project.description}</p>
                        <button
                            onClick={(e) => handleViewDetails(e, project.title)}
                            href={project.calendarLink} target="_blank" rel="noopener noreferrer"
                            className="mt-4 rounded border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-green-700 mr-2 mb-2 sm:mb-0"
                        >
                            View details
                        </button>
                        <button
                            onClick={() => navigate(`/projects/${project.title}/calendar`)}
                            className="px-5 py-2.5 border border-gray-800 dark:border-green-200 bg-green-400 hover:bg-green-500 text-sm font-medium text-slate-800 dark:text-white rounded cursor-pointer mr-2 mb-2 sm:mb-0"
                        >
                            Calendar
                        </button>
                        <button
                            onClick={() => navigate(`/projects/${project.title}/kanban`)}
                            className="px-5 py-2.5 border border-gray-800 dark:border-yellow-200 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium text-slate-800 dark:text-white rounded cursor-pointer"
                        >
                            Kanban Board
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectListing;

