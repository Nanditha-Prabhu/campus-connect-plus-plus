// AI-Powered Research Assistant
// How it Helps: Assist students and faculty in finding n number of relevant research papers.
// How it Works: Use web scraping and LLM to retrieve academic resources from online databases - arxiv.
// Summarize key points from papers using text summarization models.
// Example: A student searches for 5 papers on "IoT in agriculture", and the assistant retrieves title, abstract, link of page, link of research paper and summarizes recent papers, highlighting key methodologies using summarize button for each.

import React, { useState } from "react";
import Loading from "./Loading";
import axios from "axios";

const AIResearchAssistant = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [numPapers, setNumPapers] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/ai/search?query=${query}&numPapers=${numPapers}`
      );
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching research papers:", error);
    }
    setLoading(false);
  };

  const handleSummarize = async (paperId) => {
    console.log("Summarizing paper:", paperId);
    try {
      const response = await axios.get(`/api/summarize?paperId=${paperId}`);
      const updatedPapers = papers.map(paper =>
          paper.id === paperId ? { ...paper, summary: resnum_resultsponse.data.summary } : paper
      );
      setPapers(updatedPapers);
    } catch (error) {
      console.error("Error summarizing paper:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 pt-24 dark:bg-gray-900 dark:text-white">
        <h1 className="text-3xl text-center font-bold mb-4">
          Research Assistant
        </h1>
        <div className="mb-4 flex flex-col justify-center align-middle items-start max-w-lg mx-auto">
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Search Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for research papers ..."
            className="border border-gray-300 p-2 rounded w-full mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Number of Papers
          </label>
          <input
            type="number"
            min="1"
            value={numPapers}
            onChange={(e) => setNumPapers(e.target.value)}
            placeholder="Enter number of papers ..."
            className="border border-gray-300 p-2 rounded w-full mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`rounded border w-full justify-center items-center border-gray-800 dark:border-green-200 bg-green-400 hover:bg-green-500 px-5 py-2.5 text-sm font-medium text-slate-800 dark:text-white shadow active:bg-green-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-4">
            {papers.map((paper, idx) => (
              <div
                key={idx}
                className="border border-gray-300 p-4 rounded mb-4 dark:bg-gray-800 dark:border-gray-700"
              >
                <h2 className="text-2xl font-semibold">{paper.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {paper.abstract}
                </p>
                <div className="mt-2">
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-300 underline mr-2"
                  >
                    View Page
                  </a>
                  <a
                    href={paper["pdf-link"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-300 underline"
                  >
                    View Paper
                  </a>
                </div>
                <button
                  onClick={() => handleSummarize(paper.id)}
                  className="bg-green-500 text-white py-1 px-3 rounded mt-2"
                >
                  Summarize
                </button>
                {paper.summary && (
                  <p className="mt-2 text-gray-800 dark:text-gray-300">
                    {paper.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AIResearchAssistant;
