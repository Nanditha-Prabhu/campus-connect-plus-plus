import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BsKanban } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // User Info
    // User Projects
    // Engaged Labs
    // Streak map
    // Recent Activity
 
    const [userDetails, setUserDetails] = useState({
        student_name: '',
        usn: '',
        area_of_interest: [],
        skills: [],
        projects: [],
        labs: [],
        research_publications: [],
        activity_streak: []
    });
    
    useEffect(() => {
        async function getUserDetails() {
            if (localStorage.getItem('token') === null) {
                navigate('/student_signin');
            }
            await axios.get(`${BACKEND_URL}/users/verify_token`)
                .then(res => {
                    if (res.status !== 200) {
                        navigate('/student_signin');
                    }
                })
                .catch(err => {
                    console.log(err);
                    // navigate('/student_signin');
                });
            
            axios.get(`${BACKEND_URL}/users/get_user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(res => {
                    console.log(res.data)
                    setUserDetails(res.data);
                })
                .catch(err => console.log(err));   
        }
        getUserDetails();
    }, []);

    const userDetailsCard = () => {
        
        return (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* User info */}
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img src="https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg" alt="User" />
                    </div>
                    <div>
                        <h1 className="text-gray-900 dark:text-white text-2xl font-bold">{userDetails.student_name ? userDetails.student_name: "Your Name"}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{userDetails && userDetails.usn}</p>
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
                {/* Area of Interests */}
                <div>
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-2 border-t-2 dark:border-gray-500 pt-4">Area of Interests</h1>
                    <ul className="list-none space-y-2 pb-4">
                        {userDetails.area_of_interest && userDetails.area_of_interest?.map((interest, key) => (
                            <li key={key} className="text-blue-600 dark:text-blue-300 hover:underline">{interest}</li>
                        ))}
                    </ul>
                </div>
                {/* Skills */}
                <div>
                    <h1 className="text-gray-900 dark:text-white text-xl font-semibold mb-2 border-t-2 dark:border-gray-500 pt-4">Skills</h1>
                    <ul className="list-none space-y-2 pb-4">
                        {userDetails.skills && userDetails.skills?.map((interest, key) => (
                            <li key={key} className="text-blue-600 dark:text-blue-300 hover:underline">{interest}</li>
                        ))}
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

        // useEffect(() )

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

    const ProjectCard = () => {
        return (
            <ul className="list-none space-y-2">
                {userDetails.projects?.slice(0, 3).map((project, key) => (
                    <li key={key} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                        <div className="p-3 flex justify-between items-center">
                            <h1 className="text-lg md:text-xl text-gray-900 dark:text-white font-semibold">{project}</h1>
                            <div className="flex items-center space-x-4">
                                <Link to={`/project/${project}`} className="text-blue-600 dark:text-blue-300 hover:underline">View</Link>
                                <div className="hover:cursor-pointer" onClick={() => navigate(`/projects/${project}/kanban`)}>
                                    <BsKanban className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                </div>
                                <div className="hover:cursor-pointer" onClick={() => navigate(`/projects/${project}/calendar`)}>
                                    <FaCalendarAlt className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                </div>
                            </div>
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
                    {/* Labs */}
                    {/* <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg ">
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Labs</h1>
                        <LabsList />
                    </div> */}
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
                        <ProjectCard />
                    </div>
                    {/* Reminders */}
                    <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Reminders</h1>
                        <TodaysTaskList />
                    </div>
                    {/* Recent Activities */}
                    {/* <div className="bg-slate-200 dark:bg-gray-700 p-4 rounded shadow-lg">
                        <h1 className="dark:text-gray-100 text-lg md:text-2xl p-2 font-bold">Recent Activities</h1>
                        <TodaysTaskList />
                    </div> */}
                </div>
            </div>
        );
    }

    const userAnaltyicsCard = () => {
        const analyticsData = [
            {
                'title': 'Total Ongoing Project',
                'value': userDetails.projects.length
            },
            {
                'title': 'Total Project Completed',
                'value': Math.ceil(100*Math.random())
            },
            {
                'title': 'Total Labs Utilized',
                'value': Math.ceil(100*Math.random())
            },
            {
                'title': 'Total Research Publications',
                'value': Math.ceil(100*Math.random())
            }
        ]

        return (
            <div className="p-12 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                {/* <h1 className="text-xl p-4 text-gray-900 dark:text-white font-semibold">Analytics</h1> */}
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

    return (
        <div className="dark:bg-gray-900 grid md:grid-cols-[25%_75%] gap-4 p-12 pt-24">
            <div>
                {userDetailsCard()}
            </div>
            <div className="space-y-4">
                {userMetrics()}
                {userAnaltyicsCard()}
                {streakMapCard()}
            </div>
        </div>
    );
};

export default StudentDashboard;
