import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="z-30 fixed w-screen bg-slate-200 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row mx-auto h-16 items-center justify-between">
            <div className="text-center">
              <button
                className="rounded border border-gray-800 dark:border-green-200 bg-transparent hover:bg-green-400 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow active:bg-green-700"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? "Hide navigation" : "Show navigation"}
              </button>
            </div>
            <p className="font-bold font-mono text-teal-600 dark:text-teal-300">
              Campus Connect ++
            </p>
          </div>
        </div>
      </header>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Sidebar content goes here */}
        <Sidebar isOpen={isOpen} />
      </div>
    </>
  );
}
