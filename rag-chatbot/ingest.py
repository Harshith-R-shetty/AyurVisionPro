import pickle
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.vectorstores import Qdrant
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from llama_parse import LlamaParse
from dotenv import load_dotenv
import os
import nest_asyncio  # noqa: E402S
nest_asyncio.apply()

# bring in our LLAMA_CLOUD_API_KEY
load_dotenv()

##### LLAMAPARSE #####


llamaparse_api_key = os.getenv("LLAMA_CLOUD_API_KEY")
qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")

# to_parse_documents = ["./data/example.pdf", "./data/uber_10q_march_2022.pdf"] for uploading multiple documents


# Define a function to load parsed data if available, or parse if not


def load_or_parse_data():
    data_file = "./data/parsed_data.pkl"

    if os.path.exists(data_file):
        # Load the parsed data from the file
        with open(data_file, "rb") as f:
            parsed_data = pickle.load(f)
    else:
        # Perform the parsing step and store the result in llama_parse_documents
        parsingInstructionUber10k = """The provided document is a complete book of ayurvedic home remedies.
        This form provides detailed information about the ayurveda, about the doshas and their characteristics and a-z illness and their remedies.
        It contains alot of paragraphs and text with main headings relating to the content.
        Try to be precise while answering the questions"""
        parser = LlamaParse(api_key=llamaparse_api_key, result_type="markdown",
                            parsing_instruction=parsingInstructionUber10k)
        llama_parse_documents = parser.load_data(
            "./data/The_Complete_Book_of_Ayurvedic_Home_Remedies.pdf")

        # Save the parsed data to a file
        with open(data_file, "wb") as f:
            pickle.dump(llama_parse_documents, f)

        # Set the parsed data to the variable
        parsed_data = llama_parse_documents

    return parsed_data


# Create vector database
def create_vector_database():
    """
    Creates a vector database using document loaders and embeddings.

    This function loads urls,
    splits the loaded documents into chunks, transforms them into embeddings using OllamaEmbeddings,
    and finally persists the embeddings into a Chroma vector database.

    """
    # Call the function to either load or parse the data
    llama_parse_documents = load_or_parse_data()
    # print(llama_parse_documents[1].text[:100])

    with open('data/output.md', 'a', encoding='utf-8') as f:  # Open the file in append mode ('a')
        for doc in llama_parse_documents:
            f.write(doc.text + '\n')

    loader = DirectoryLoader('data/', glob="**/*.md", show_progress=True)
    documents = loader.load()
    # Split loaded documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)

    # len(docs)
    # docs[0]

    # Initialize Embeddings
    embeddings = FastEmbedEmbeddings()

    # Create and persist a Chroma vector database from the chunked documents
    qdrant = Qdrant.from_documents(
        documents=docs,
        embedding=embeddings,
        url=qdrant_url,
        collection_name="ayurvision-pro",
        api_key=qdrant_api_key
    )

    # query it
    # query = "what is the agend of Financial Statements for 2022 ?"
    # found_doc = qdrant.similarity_search(query, k=3)
    # print(found_doc[0][:100])

    print('Vector DB created successfully !')


if __name__ == "__main__":
    create_vector_database()
