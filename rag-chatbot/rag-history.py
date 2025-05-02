import os
from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_openai import ChatOpenAI
import chainlit as cl 
from config import config

load_dotenv()

groq_api_key = os.getenv("OPENAI_API_KEY")
# groq_api_key = os.getenv("GROQ_API_KEY")
qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")


store = {} ### Statefully manage chat history ###

custom_prompt_template_kapha = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.Be friendly to the user and respond appropriately to what user has asked only.
this user has kapha prakriti and this is taken from the test the user gave on our website.
Context: {context}

Only return the helpful answer below and nothing else.
Answer general questions normally.
Helpful answer:
"""
custom_prompt_template_vata = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.Be friendly to the user and respond appropriately to what user has asked only.
this user has vata prakriti and this is taken from the test the user gave on our webiste.
Context: {context}

Only return the helpful answer below and nothing else.
# Answer general questions normally.
Helpful answer:
"""
custom_prompt_template_pitta = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.Be friendly to the user and respond appropriately to what user has asked only.
this user has pitta prakriti and this is taken from the test the user gave on our website.
Context: {context}

Only return the helpful answer below and nothing else.
Answer general questions normally.
Helpful answer:
"""
custom_prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.Be friendly to the user and respond appropriately to what user has asked only.
the user has not taken any prakriti test from our website and consider him as neutral prakriti.
Context: {context}

Only return the helpful answer below and nothing else.
# Answer general questions normally.
Helpful answer:
"""


def set_custom_prompt(prakriti):
    """
    Prompt template for QA retrieval for each vectorstore
    """
    # print("inside setcustom_prompt::", prakriti)
    # custom_prompt_template = custom_prompt_template.format(prakriti=prakriti)
    custom = ""

    if prakriti == "vata":
        custom = custom_prompt_template_vata
    elif prakriti == "kapha":
        custom = custom_prompt_template_kapha
    elif prakriti == "pitta":
        custom = custom_prompt_template_pitta
    else:
        custom = custom_prompt_template
        
    return custom

def get_session_history(session_id: str) -> BaseChatMessageHistory:
        if session_id not in store:
            store[session_id] = ChatMessageHistory()
        return store[session_id]

# llm = ChatGroq(temperature=0, model_name="gemma2-9b-it",streaming=True)
llm=ChatOpenAI(model_name="o3-mini", streaming=True)

def qa_bot(prakriti):
    client = QdrantClient(api_key=qdrant_api_key, url=qdrant_url,)
    embeddings = FastEmbedEmbeddings()
    vectorstore = Qdrant(
        client=client, embeddings=embeddings, collection_name="ayurvision-pro")
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k":2})
    
    
    ### Contextualize question ###
    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
    )

    
    qa_system_prompt = set_custom_prompt(prakriti)
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    
    chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )
    
    return chain

@cl.on_chat_start
async def start():
    chain = qa_bot(config.prakriti)
    
    welcome_message = cl.Message(content="Starting the bot...")
    await welcome_message.send()
    welcome_message.content = (
        "Hi, Welcome to AyurBot,I am your personal ayurvedic doc go ahead and ask me some questions."
    )
    await welcome_message.update()
    
    cl.user_session.set("chain", chain) 


@cl.on_message
async def main(message: cl.Message):
    
    if config.needs_refresh:  # for updating the prakriti if update prakriti endpoint is hit
        chain = qa_bot(config.prakriti)
        cl.user_session.set("chain", chain)
        config.needs_refresh = False  # Reset refresh flag

    
    chain = cl.user_session.get("chain")
    
    response =  await chain.ainvoke(
        {"input": message.content},
        config={"configurable": {"session_id": "abc123"},
                "callbacks":[cl.AsyncLangchainCallbackHandler()]},         
    )

    # print(response) #debugging

    answer = response["answer"]

    source_documents = response["context"]
    text_elements = []

    if source_documents:
        for source_idx, source_doc in enumerate(source_documents):
            source_name = f"source_{source_idx}"
            # Create the text element referenced in the message
            text_elements.append(
                cl.Text(content=source_doc.page_content,
                        name=source_name, display="side")
            )
        source_names = [text_el.name for text_el in text_elements]

        if source_names:
            answer += f"\nSources: {', '.join(source_names)}"
        else:
            answer += "\nNo sources found"

    await cl.Message(content=answer, elements=text_elements).send()