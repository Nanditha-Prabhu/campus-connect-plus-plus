import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import axios from 'axios';

const StudentDashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    // User Info
    // User Projects
    // Engaged Labs
    // Streak map
    // Recent Activity
    const userDetailsCard = () => {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* User info */}
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img src="https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg" alt="User" />
                    </div>
                    <div>
                        <h1 className="text-gray-900 dark:text-white text-2xl font-bold">John Doe</h1>
                        <p className="text-gray-600 dark:text-gray-300">Hello world</p>
                    </div>
                </div>
                {/* Socials */}
                <ul className="list-none space-y-2 mb-4">
                    <li><a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">LinkedIn/xxx</a></li>
                    <li><a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">GitHub/xxx</a></li>
                    <li><a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">X/xxx</a></li>
                </ul>
                {/* Research Publications */}
                <div>
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-2 border-t-2 dark:border-gray-500 pt-4">Research Publications</h1>
                    <ul className="list-none space-y-2 pb-4">
                        <li><a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">Publication 1</a></li>
                        <li><a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">Publication 2</a></li>
                        <li><a href="#" className="text-blue-600 dark:text-blue-300 hover:underline">Publication 3</a></li>
                    </ul>
                </div>
            </div>
        );
    }

    const TodaysTaskList = () => {
        const tasks = [
            {
                task: "Task 1",
                description: "This is a task"
            },
            {
                task: "Task 2",
                description: "This is a task"
            }
        ]

        return (
            <ul className="list-none space-y-2">
                {tasks.map((task, key) => (
                    <li key={key} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                        <div className="p-3">
                            <h1 className="text-lg md:text-xl text-gray-900 dark:text-white font-semibold">{task.task}</h1>
                            <p className="md:text-lg text-gray-900 dark:text-gray-300">{task.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    // section that returns list of labs
    const LabsList = () => {
        const labs = [
            {
                lab: "Lab 1",
                description: "This is a lab"
            },
            {
                lab: "Lab 2",
                description: "This is a lab"
            }
        ]

        return (
            <ul className="list-none space-y-2">
                {labs.map((lab, key) => (
                    <li key={key} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                        <div className="p-3">
                            <h1 className="text-lg md:text-xl text-gray-900 dark:text-white font-semibold">{lab.lab}</h1>
                            <p className="md:text-lg text-gray-900 dark:text-gray-300">{lab.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    const userMetrics = () => {
        return (
            <div className="p-12 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg ">
                        {/* Labs */}
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Labs</h1>
                        <LabsList />
                    </div>
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        {/* Todays task */}
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Todays' Tasks</h1>
                        <TodaysTaskList />
                    </div>
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        {/* Activity */}
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Activity</h1>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                width={350}
                                height={200}
                                data={[
                                    { day: 'Mon', hours: 4 },
                                    { day: 'Tue', hours: 6 },
                                    { day: 'Wed', hours: 8 },
                                    { day: 'Thu', hours: 5 },
                                    { day: 'Fri', hours: 7 }
                                ]}
                            >
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis dataKey="day" tickLine={false} />
                                <YAxis tickLine={false} hide={true} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="hours" fill="#196f3d" stackId="hours" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Projects */}
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Projects</h1>
                        <TodaysTaskList />
                    </div>
                    {/* Reminders */}
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Reminders</h1>
                        <TodaysTaskList />
                    </div>
                    {/* Recent Activities */}
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Recent Activities</h1>
                        <TodaysTaskList />
                    </div>
                </div>
            </div>
        );
    }

    const userAnaltyicsCard = () => {
        const analyticsData = [
            {
                'title': 'Total Ongoing Project',
                'value': 10
            },
            {
                'title': 'Total Project Completed',
                'value': 100
            },
            {
                'title': 'Total Labs Utilized',
                'value': 32
            },
            {
                'title': 'Total Research Publications',
                'value': 12
            }
        ]

        return (
            <div className="p-12 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                <h1 className=" text-gray-900  dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Analytics</h1>
                <div className="grid md:grid-cols-2 gap-4">
                    {analyticsData.map((data, key) => (
                        <div key={key} className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg text-center">
                            <p className="text-gray-900 dark:text-white text-3xl md:text-5xl">{data.value}</p>
                            <h1 className="dark:text-gray-100 text-lg md:text-xl p-2 font-bold">{data.title}</h1>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const userProjectsCard = () => {
        const project = [
            {
                project: "Project Zero",
                description: "This is a project",
            },
            {
                project: "Project Zero",
                description: "This is a project",
            }
        ]

        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-xl p-4 text-gray-900 dark:text-white font-semibold px-12 pt-8">Projects</h1>
                <div className="grid md:grid-cols-2 gap-4 px-12 pb-12">
                    {project.map((project, key) => (
                        <div key={key} className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                            <Link to="/project" className="dark:text-gray-100 text-lg font-bold">{project.project}</Link>
                            <p className="text-gray-900 dark:text-gray-300">{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    const streakMapCard = () => {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-xl p-4 text-gray-900 dark:text-white font-semibold px-12 pt-8">Activity Streak</h1>
                <div className="px-12 pb-12 text-center">
                    <CalendarHeatmap
                        startDate={new Date('2024-01-01')}
                        endDate={new Date('2024-12-31')}
                        values={[
                            { date: '2024-01-01', count: 12 },
                            { date: '2024-01-22', count: 122 },
                            { date: '2024-01-30', count: 38 },
                            // ...and so on
                        ]}
                        // tooltip doesn't work
                        tooltipDataAttrs={(value) => { 
                            return { 'data-tooltip': 'Tooltip: ' + value.count }
                        }}
                    />
                </div>
            </div>
        );
    }

    const recentActivityCard = () => {
        const recentActivites = [
            {
                activity: "Activity 1"
            },
            {
                activity: "Activity 2"
            }
        ]

        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-xl p-4 text-gray-900 dark:text-white font-semibold px-12 pt-8">Recent Activity</h1>
                <div className="space-y-4 px-12 pb-12">
                    {recentActivites.map((activity, key) => (
                        <div key={key} className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                            <p className="text-gray-900 dark:text-gray-300">{activity.activity}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Proposal acceptance section for all the proposals submitted from project listing page
    const ProjectProposals = () => {
        const [proposals, setProposals] = useState([
            {
                project: "Project Zero",
                proposals: [
                    {
                        title: "Proposal 1",
                        description: "This is a proposal",
                        status: "Pending"
                    },
                    {
                        title: "Proposal 2",
                        description: "This is a proposal",
                        status: "Pending"
                    }
                ]
            },
            {
                project: "Project One",
                proposals: [
                    {
                        title: "Proposal 3",
                        description: "This is a proposal",
                        status: "Pending"
                    },
                    {
                        title: "Proposal 4",
                        description: "This is a proposal",
                        status: "Pending"
                    }
                ]
            }
        ]);

        const handleProposalAction = (projectIndex, proposalIndex, action) => {
            const updatedProposals = [...proposals];
            updatedProposals[projectIndex].proposals[proposalIndex].status = action;
            setProposals(updatedProposals);
        };

        return (
            <div className="p-12 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                <h1 className=" text-gray-900  dark:text-gray-100 text-lg md:text-2xl font-bold">Project Proposal Submissions</h1>
                <p className=' text-black dark:text-gray-500 mb-4'>You can accept or reject the project proposal for each project.</p>
                {proposals.map((project, projectIndex) => (
                    <div key={projectIndex} className=" bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg mb-4">
                        <button
                            className="text-gray-900 dark:text-white w-full focus:outline-none"
                            onClick={() => {
                                const updatedProposals = [...proposals];
                                updatedProposals[projectIndex].isOpen = !updatedProposals[projectIndex].isOpen;
                                setProposals(updatedProposals);
                            }}
                        >
                            <div className="flex flex-row justify-between items-center w-full">
                                <h2 className="text-lg md:text-xl text-gray-900 dark:text-white font-semibold">{project.project}</h2>
                                <p>{project.isOpen ? '-' : '+'}</p>
                            </div>
                        </button>
                        {project.isOpen && (
                            <div className="mt-4 space-y-4">
                                {project.proposals.map((proposal, proposalIndex) => (
                                    <div key={proposalIndex} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4">
                                        <h1 className="text-lg md:text-xl text-gray-900 dark:text-white font-semibold">{proposal.title}</h1>
                                        <p className="md:text-lg text-gray-900 dark:text-gray-300">{proposal.description}</p>
                                        <p className="md:text-lg text-gray-900 dark:text-gray-300">Status: {proposal.status}</p>
                                        <div className="flex space-x-4 mt-2">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleProposalAction(projectIndex, proposalIndex, 'Accepted')}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={() => handleProposalAction(projectIndex, proposalIndex, 'Rejected')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    
    //New Project creation section for faculty where they can create a new project by giving the details like project name, description, area of interests, skills required.
    const ProjectCreation = () => {
        const [formData, setFormData] = useState({
            title: "",
            description: "",
            area: "",
            skills: "",
            created_at: "",
            created_by: "",
            project_status: "yet to start",
        });

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            let user;
            // get user details
            await axios.get(`${BACKEND_URL}/users/get_user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                .then((res) => {
                    user = res.data;
                })
                .catch((err) => {
                    console.error(err);
                });
            console.log(user);
            
            // update created_at field
            setFormData({ ...formData, created_at: new Date().toISOString() });
            // update created_by field
            setFormData({ ...formData, created_by: user.uid });

            console.log(formData);
            // API call to create project
            await axios.post(`${BACKEND_URL}/projects/${formData.title}`, formData)
                .then((res) => {
                    console.log(res)
                    setFormData({ ...formData, ...res.data });
                })
                .catch((err) => {
                    console.error(err);
                });
        };

        return (
            <div className="p-12 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                <h1 className=" text-gray-900  dark:text-gray-100 text-lg md:text-2xl font-bold">Create New Project</h1>
                <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                    <div>
                        <label className="dark:text-white" htmlFor="project">
                            Project Name
                        </label>
                        <input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="dark:text-white" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="dark:text-white" htmlFor="area">
                            Area of interest
                        </label>
                        <select
                            required
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            type="area"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        >
                            <option value="">Select area of interest</option>
                            <option value="AI">AI</option>
                            <option value="ML">ML</option>
                            <option value="Web Development">Web Development</option>
                            <option value="App Development">App Development</option>
                        </select>
                    </div>
                    <div>
                        <label className="dark:text-white" htmlFor="skills">
                            Skills Required
                        </label>
                        <input
                            required
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            type="text"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button
                            type="submit"
                            className="rounded border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow active:bg-green-700"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="dark:bg-gray-900 grid md:grid-cols-[25%_75%] gap-4 p-12 pt-24">
            <div>
                {userDetailsCard()}
            </div>
            <div className="space-y-4">
                {userAnaltyicsCard()}
                {userMetrics()}
                {/* {userProjectsCard()} */}
                {streakMapCard()}
                {/* {recentActivityCard()} */}
                {ProjectProposals()}
                {ProjectCreation()}
            </div>
        </div>
    );
};

export default StudentDashboard;
