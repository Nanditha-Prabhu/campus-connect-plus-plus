// An editable/custom calendar inorder to add events and reminders

import React, { useEffect, useState } from "react";
import { PiArrowSquareLeftFill, PiArrowSquareRightFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  addMonths,
  subMonths,
  parse,
} from "date-fns";
import axios from "axios";
import { useParams } from "react-router-dom";
/**
 * Calendar component that displays a monthly calendar with selectable dates and events.
 *
 * @component
 * @example
 * return (
 *   <Calendar />
 * )
 */

const Calendar = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const urlParams = useParams();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventType, setEventType] = useState("meeting");
  const [eventTitle, setEventTitle] = useState("");


  // API call to get events
  useEffect(() => {
    axios.get(`${BACKEND_URL}/projects/${urlParams.project_name}/calendar/getEvents`)
      .then((res) => {
        if (res.status === 200) {
          const events = res.data;
          setMeetings(events.meetings);
          setDeadlines(events.deadlines);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  /**
   * Renders the header of the calendar with navigation controls for previous and next month.
   *
   * @function
   * @returns {JSX.Element} The header component of the calendar.
   */
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <>
        <h1 className="text-3xl dark:text-white font-bold sm:text-5xl text-center mb-5 underline">
          {urlParams.project_name}
        </h1>
        <h1 className="text-2xl dark:text-white font-bold sm:text-3xl text-center mb-5">
          Calendar of Events
        </h1>
        <div className="header border border-gray-200 dark:border-gray-500 flex justify-between items-center mb-4">
          <div className="icon cursor-pointer" onClick={prevMonth}>
            <span className="material-icons">
              <PiArrowSquareLeftFill className=" w-10 h-10 dark:text-white" />
            </span>
          </div>
          <div className="text-lg font-bold dark:text-white">
            <span>{format(currentMonth, dateFormat)}</span>
          </div>
          <div className="icon cursor-pointer" onClick={nextMonth}>
            <span className="material-icons">
              <PiArrowSquareRightFill className=" w-10 h-10 dark:text-white" />
            </span>
          </div>
        </div>
      </>
    );
  };

  /**
   * Renders the days of the week.
   *
   * @function
   * @returns {JSX.Element} The days of the week component.
   */
  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col text-center font-medium dark:text-white text-xs sm:text-base" key={i}>
          <span className="hidden sm:block">
            {format(addDays(startDate, i), "EEEE")}
          </span>
          <span className="block sm:hidden">
            {format(addDays(startDate, i), "EEE")}
          </span>
        </div>
      );
    }

    return (
      <div className="days grid grid-cols-7 border border-gray-200 dark:border-gray-500 p-2">
        {days}
      </div>
    );
  };

  //function to delete an event
  const deleteEvent = (event) => {
    if (event.event_type === "meeting") {
      console.log("meeting deleted");
      setMeetings(meetings.filter((e) => e !== event));
    } else if (event.event_type === "deadline") {
      console.log("deadline deleted");
      setDeadlines(deadlines.filter((e) => e !== event));
    }
    axios.delete(`${BACKEND_URL}/projects/${urlParams.project_name}/calendar/deleteEvent/${event.event_type}`, {
        data: event
      })
      .then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.error(err);
      })
  };
  /**
   * Renders the cells of the calendar for the current month.
   *
   * @function
   * @returns {JSX.Element} The cells of the calendar component.
   */

  /**
   * Handles the click event on a date cell, allowing the user to add an event.
   *
   * @function
   * @param {Date} day - The date that was clicked.
   */
  {
    /* const onDateClick = (day) => {
    setSelectedDate(day);
    const eventTitle = prompt("Enter event title:");
    if (eventTitle) {
      setEvents([...events, { date: day, title: eventTitle }]);
      }
      }; */
  }
  /**
   * Renders the cells of the calendar for the current month.
   *
   * @function
   * @returns {JSX.Element} The cells of the calendar component.
   */
  const renderEvent = (day) => {
    const events = [...meetings, ...deadlines];
    return (events?.length > 0 && events
      .filter((e) => (
        isSameDay(format(e.event_date, "yyyy-MM-dd"), format(day, "yyyy-MM-dd"))
      ))
      .map((e, index) => (
        <div
          key={index}
          className={`event p-1 rounded w-fit mt-1 flex flex-row justify-between items-center text-left  ${
          e.event_type === "meeting"
            ? "bg-yellow-300 dark:bg-yellow-400"
            : "bg-purple-300 dark:bg-purple-400"
          }`}
        >
          {e.event_title}
          <MdDelete
          className="min-w-10"
          onClick={(event) => {
            event.stopPropagation();
            deleteEvent(e);
          }}
          />
          {/* we have to use anonymous function for deleteEvent else as soon as we add an event it will get deleted. */}
          {/* if we press delete btn, even the modal was being shown. Thats why we stopped event propagation. */}
        </div>
      )));
  };

  /**
   * Advances the calendar to the next month.
   *
   * @function
   */
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  /**
   * Moves the calendar to the previous month.
   *
   * @function
   */
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventType("meeting");
    setEventTitle("");
  };

  const handleEventSubmit = async (day) => {
    // setSelectedDate(day);
    const newEvent = { event_date: selectedDate, event_type: eventType, event_title: eventTitle };
    if (newEvent.event_title !== "") {
      setMeetings([...meetings, newEvent]);
      await axios.put(`${BACKEND_URL}/projects/${urlParams.project_name}/calendar/addEvent/${newEvent.event_type}`, newEvent).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        console.error(err);
      });
    }
    closeModal();
  };

  const renderCells = () => {
    const monthStart = startOfWeek(currentMonth);
    const monthEnd = addDays(monthStart, 42);
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = monthStart;
    let formattedDate = "";

    while (day <= monthEnd) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col p-2 border border-gray-200 dark:border-gray-600 text-center cursor-pointer  ${
              !isSameDay(day, selectedDate)
                ? "bg-gray-100 dark:bg-gray-700"
                : "bg-green-200/75 dark:bg-green-600"
            }`}
            key={day}
            onClick={() => {
              setSelectedDate(cloneDay);
              openModal();
            }}
          >
            <span className="number dark:text-white">{formattedDate}</span>
            <div className=" justify-center overflow-x-auto w-full">
              {renderEvent(day)}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body  overflow-x-auto">{rows}</div>;
  };

  const renderModal = () => {
    return (
      <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="modal-content bg-white dark:bg-slate-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Add Event</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-white">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium dark:text-white">
              Event Title
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="mr-2 px-4 py-2 bg-gray-300 rounded dark:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleEventSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-700"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="calendar p-10 pt-24 bg-white dark:bg-slate-900 shadow-md overflow-x-auto">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      {isModalOpen && renderModal()}
    </>
  );
};

export default Calendar;
