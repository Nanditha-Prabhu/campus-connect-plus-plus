# prompt: agent to extract research papers regarding paricular topic using webscraping

import requests
from bs4 import BeautifulSoup
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import PyPDF2

def search_research_papers(query, num_results=5):
    """
    Searches for research papers on Google Scholar and extracts relevant information.
    """

    search_query = query.replace(" ", "+")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}  # Simulate a web browser
    # url = f"https://scholar.google.com/scholar?q={search_query}"
    url = f"https://arxiv.org/search/?query={search_query}&searchtype=all&source=header"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for bad status codes

        soup = BeautifulSoup(response.content, "html.parser")
        results = []
        for result in soup.find_all("li", class_="arxiv-result"):
            title_element = result.find("h1", class_="title is-5 mathjax")
            if title_element:
                title = title_element.text
            else:
                title = "Title not found"  # Handle cases where title is missing

            abstract_element = result.find("span", class_="abstract-full has-text-grey-dark mathjax")
            abstract = abstract_element.text if abstract_element else "Abstract not found"

            link_element = result.find("p", class_="list-title is-inline-block").find("a")
            link = link_element['href'] if link_element else "Link not found"


            results.append({"title": title, "abstract": abstract, "link":link})
        return results
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the request: {e}")
        return []
    
# extract link of the research paper pdf from the research paper page
def extract_pdf_link(paper_link):
    view_pdf_element = result.find("p", class_="title is-5 mathjax")
    if title_element:
        title = title_element.text
    else:
        title = "Title not found"
    
# summarize contents of a research paper pdf using AIML/LLM(example: gemini) and give key points about it like - authors, implemetation, conclusion etc
# extract the data from the pdf and summarize it
# return the summarized data
def summarize_pdf_from_link(pdf_link):
    """
    Summarizes the contents of a PDF file from a web link using a pre-trained model.
    """
    # Load the pre-trained model
    model = AutoModelForSeq2SeqLM.from_pretrained("google/pegasus-xsum")
    tokenizer = AutoTokenizer.from_pretrained("google/pegasus-xsum")

    # Download the PDF file
    response = requests.get(pdf_link)
    response.raise_for_status()

    # Read the PDF file
    with open("temp.pdf", "wb") as file:
        file.write(response.content)

        pdf_text = PyPDF2.PdfReader(file)
        pdf_text = PyPDF2.PdfFileReader(file)
        text = ""
        for page_num in range(pdf_text.getNumPages()):
            text += pdf_text.getPage(page_num).extract_text()

    # Tokenize the text
    input_ids = tokenizer.encode(text, return_tensors="pt", max_length=1024, truncation=True)

    # Generate the summary
    summary_ids = model.generate(input_ids, max_length=150, num_beams=2, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary


def main():
    query = input("Enter your research query: ")
    results = search_research_papers(query)
    print(results)

    if results:
        print("\nSearch Results:")
        for i, paper in enumerate(results):
            print(f"\nPaper {i + 1}:")
            print(f"Title: {paper['title']}")
            print(f"Abstract: {paper['abstract']}")
            print(f"Link: {paper['link']}")
    else:
        print("No relevant research papers found or an error occurred.")


if __name__ == "__main__":
    main()