//A page that allows to search all the available projects as well as the projects that the user is working on. The user can also apply for the projects that are available. The user can also view the details of the project and submit the proposal if they are interested to work for it. The faculty incharge will review the proposal and get back to the user.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectListing = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userProjects, setUserProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        axios.get(`${BACKEND_URL}/users/get_user_projects`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (res.status === 200) {
                setUserProjects(res.data.projects);
            }
        })
        .catch(error => console.error('Error fetching projects:', error));            
    }, []);
  // The problem is that you are calling setProjects directly inside the component body, which causes an infinite re-render loop. To fix this, move the dummy project initialization inside a useEffect hook.
  useEffect(() => {
    //create a dummy project
    const project = {
      name: "web development project",
      description: "This is a project description.",
    };
    const project2 = {
      name: "database project",
      description: "This is a project description 2.",
    };
    const project3 = {
      name: "machine learning project",
      description: "This is a project description 3.",
    };
    setProjects([...projects, project, project2, project3]);
    setUserProjects([...userProjects, project, project2, project3]);
  }, []);

  // useEffect(() => {
  //     // Fetch all projects
  //     axios.get('/api/projects')
  //         .then(response => setProjects(response.data))
  //         .catch(error => console.error('Error fetching projects:', error));

  //     // Fetch user's projects
  //     axios.get('/api/user/projects')
  //         .then(response => setUserProjects(response.data))
  //         .catch(error => console.error('Error fetching user projects:', error));
  // }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleApply = (projectId) => {
    // Logic to apply for a project
    axios
      .post(`/api/projects/${projectId}/apply`)
      .then((response) => alert("Applied successfully!"))
      .catch((error) => console.error("Error applying for project:", error));
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
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //a modal for proposal submission
  const submitProposal = () => {
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
      <>
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white dark:bg-gray-900 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-headline"
                    >
                      Submit Proposal
                    </h3>
                    <form className="mt-4">
                      <div>
                        <label
                          htmlFor="proposal"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Proposal
                        </label>
                        <textarea
                          id="proposal"
                          name="proposal"
                          rows="4"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Write your proposal here..."
                        ></textarea>
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="resume"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Resume
                        </label>
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                        />
                      </div>
                    </form>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Are you sure you want to submit the proposal?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center ">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-900 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="p-5 pt-24 bg-white dark:bg-gray-900 dark:text-white">
        <h1 className="text-2xl dark:text-white font-bold sm:text-3xl text-center mb-5">
          Project Listing
        </h1>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 mb-5 rounded border border-gray-300 text-black"
        />
        <h2 className="text-lg dark:text-white font-semibold sm:text-2xl text-center mb-5">
          Available Projects
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <li
              key={project.id}
              className=" border border-gray-300 mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
            >
              <h3 className="m-0 mb-2 text-lg font-semibold">{project.name}</h3>
              <p className="m-0 mb-2 text-gray-800 dark:text-gray-300">
                {project.description}
              </p>
              <button
                onClick={() => alert("View details")}
                className="cursor-pointer rounded border border-gray-800 dark:border-yellow-200 bg-yellow-400 hover:bg-yellow-500 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-yellow-700 mr-2 mb-2 sm:mb-0"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  openModal();
                  handleApply(project.id);
                }}
                className=" cursor-pointer rounded border border-gray-800 dark:border-green-200 bg-green-400 hover:bg-green-500 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-green-700"
              >
                Submit Proposal
              </button>
            </li>
          ))}
        </ul>
        <h2 className="text-lg dark:text-white font-semibold sm:text-2xl text-center mb-5">
          Your Projects
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userProjects.map((project) => (
            <li
              key={project.id}
              className="border border-gray-300 mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
            >
              <h3 className="m-0 mb-2 text-lg font-semibold">{project.name}</h3>
              <p className="m-0 mb-2 text-gray-800 dark:text-gray-300">
                {project.description}
              </p>
              <button
                onClick={() => alert("View details")}
                href={project.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 rounded border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow  active:bg-green-700 mr-2 mb-2 sm:mb-0"
              >
                View details
              </button>
              <button
                onClick={() => alert("Submit proposal")}
                className="px-5 py-2.5 border border-gray-800 dark:border-green-200 bg-green-400 hover:bg-green-500 text-sm font-medium text-slate-800 dark:text-white rounded cursor-pointer mr-2 mb-2 sm:mb-0"
              >
                Calendar
              </button>
              <button
                onClick={() => alert("Submit proposal")}
                className="px-5 py-2.5 border border-gray-800 dark:border-yellow-200 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium text-slate-800 dark:text-white rounded cursor-pointer"
              >
                Kanban Board
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isModalOpen && submitProposal()}
    </>
  );
};

export default ProjectListing;
