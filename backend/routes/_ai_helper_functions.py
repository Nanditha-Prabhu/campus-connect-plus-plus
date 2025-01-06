import requests
import re
from bs4 import BeautifulSoup
import PyPDF2
import os


API_URL = "https://api-inference.huggingface.co/models/google/pegasus-xsum"
AUTH_TOKEN = os.environ.get("HF_TOKEN")


def search_research_papers(query, num_results=5):
    """
    Searches for research papers on Google Scholar and extracts relevant information.
    """
    search_query = query.replace(" ", "+")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }  # Simulate a web browser
    url = f"https://arxiv.org/search/?query={search_query}&searchtype=all"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes

        soup = BeautifulSoup(response.content, "html.parser")
        results = []
        for result in soup.find_all("li", class_="arxiv-result"):
            title_element = result.find("p", class_="title is-5 mathjax")
            if title_element:
                title = title_element.text
            else:
                title = "Title not found"  # Handle cases where title is missing

            abstract_element = result.find("span", class_="abstract-full has-text-grey-dark mathjax")
            abstract = abstract_element.text if abstract_element else "Abstract not found"
            abstract = re.sub(r'△ Less', '', abstract)

            link_element = result.find("p", class_="list-title is-inline-block").find("a")
            link = link_element['href'] if link_element else "Link not found"

            results.append({"title": title, "abstract": abstract, "link":link})
        return results
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request: {e}")
        return []


def extract_paper_link(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}  # Simulate a web browser
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes

        soup = BeautifulSoup(response.content, "html.parser")
        paper_link = "Paper not found"
        for result in soup.find_all("div", "full-text"):
            paper_element = result.find("a", class_="abs-button download-pdf")
            if paper_element:
                paper_link = "https://arxiv.org" + paper_element['href']
        # return paper_link
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request: {e}")
    return paper_link


def query(payload):
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}"
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def summarize_pdf(pdf_path):
    """
    Summarizes the contents of a PDF file using a pre-trained model.
    """
    # Download the PDF file
    response = requests.get(pdf_path)
    response.raise_for_status()

    with open("temp.pdf", "wb") as file:  # First, write the content to the file
        file.write(response.content)

    with open("temp.pdf", "rb") as file:  # Then, reopen in read mode
        pdf_text = PyPDF2.PdfReader(file)  # or PyPDF2.PdfFileReader(file)
        text = ""
        for page_num in range(len(pdf_text.pages)):  # Use numPages attribute
            text += pdf_text.pages[page_num].extract_text()

    summary, *_ = query({
        "inputs": text,
    })

    return summary["summary_text"]


def search_assistant(query, num_results=5):
    """
    A search assistant that provides a summary of the search query.
    """
    summaries = []
    results = search_research_papers(query, num_results)
    if results:
        for paper in results[:min(num_results, len(results))]:
            summaries_details = {}
            summaries_details["title"] = paper["title"]
            summaries_details["abstract"] = paper["abstract"]
            summaries_details["link"] = paper["link"]
            paper_link = extract_paper_link(paper["link"])
            if paper_link != "Paper not found":
                summary = summarize_pdf(paper_link)
            summaries_details["pdf-link"] = paper_link
            summaries_details["summary"] = summary
            summaries.append(summaries_details)
    else:
        print("No relevant research papers found or an error occurred.")
    return summaries
