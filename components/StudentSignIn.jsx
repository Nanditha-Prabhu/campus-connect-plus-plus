import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function StudentSignUp() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const [formData, setFormData] = useState({
    email_id: "",
    password: ""
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const [response, setResponse] = useState([]);
  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      console.log(formData);
      await axios.post(`${BACKEND_URL}/users/student/login`, formData)
        .then((res) => {
          if (res.status === 200) {
            setResponse("Successful");
            localStorage.setItem("token", res.data.access_token);
            setTimeout(() => {
              navigate("/student-dashboard");
            }, 2000);
          }
          else {
            setResponse("Unsuccessful");
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    } catch (error) {
      setResponse(null);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section>
      {/* form section */}
      <div className="  dark:bg-slate-700 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black dark:text-white">
            Sign In to your student account
          </h2>
          
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="mt-8 text-gray-900 dark:text-slate-200"
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="text-base font-medium text-gray-900 dark:text-slate-200"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    id="email"
                    name="email_id"
                    value={formData.email_id}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-base font-medium text-gray-900 dark:text-slate-200"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Include lowercase, uppercase and numbers"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center  bg-black px-3.5 py-2.5 font-semibold leading-7   rounded  border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 text-sm  text-slate-800 dark:text-white shadow  active:bg-green-700"
                >
                  Sigin In <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
          {/* message section */}
          {isLoading ? (
            <Loading />
          ) : (
            response && (
              <p
                className={`p-5 text-center font-semibold text-lg ${
                  response === "Successful" ? "text-green-500" : "text-red-500"
                }`}
              >
                {response}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}
