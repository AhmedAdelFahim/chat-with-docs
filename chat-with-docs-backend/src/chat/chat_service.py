import json
from langchain_anthropic import ChatAnthropic
from nltk.corpus import stopwords
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_community.chat_models import ChatOllama
from langchain_huggingface import HuggingFaceEmbeddings
# import torch
# from transformers import AutoTokenizer, AutoModelForCausalLM

from chat.chat_model import AnsweringModel, AskingModel
from database.database_service import get_instance
from utils.constants import  MODELS

# llm_model_name = MODEL_LLAMA_3_1
# embeddings_model_name = MODEL_ALL_MINI_LM_L6_V2

def split_user_input(input):
    llm = ChatOllama(model=MODELS["LLAMA_3.1"], temperature=1)
    answer = llm.invoke([
        SystemMessage("please split this text into sentences "+ '"'+ input + '"' + ". provide answer into one array of strings form. please provide the array of sentences only because i will parse this response to json so do not add text beside the array."),
    ]
    )
    print(answer.content)
    # print(json.loads(answer.content), 'json.loads(answer.content)')
    try:
        return json.loads(answer.content) + [input]
    except:
        return [input]
    
def clean_text(text) -> str:
    text = text.lower().strip() 
    stop_words = set(stopwords.words('english') + stopwords.words('arabic')) 
    text = ' '.join([word for word in text.split() if word not in stop_words])
    
    return text
    
def get_chunks(splitted_sentences, category_name):
    print(category_name, 'cccccccccc')
    chunks = []
    chunks_ids = []
    embeddings = HuggingFaceEmbeddings(model_name=MODELS['MODEL_ALL_MINI_LM_L6_V2'])
    retriever = get_instance(embeddings, category_name).as_retriever(search_kwargs={"k": 4})
    for sent in splitted_sentences:
        cleaned_sent = clean_text(sent)
        print(cleaned_sent,'cleaned_sent')
        if len(cleaned_sent) > 0:
            print(sent)
            docs = retriever.invoke(sent.lower())
            for doc in docs:
                print(doc)
                print(doc.metadata)
                print(doc.metadata['id'])
                if doc.metadata['id'] in chunks_ids:
                    continue
                chunks_ids.append(doc.metadata['id'])
                chunks.append(doc)
    return chunks
            
def get_context_from_docs(docs):
    s = ''
    for doc in docs:
        s += doc.page_content
        s += '\n'
    return s

def get_prompt(context, lang='en'):
    # you must provide the answer in arabic.
    if lang == 'en':
        return "Based on this Context: " + context + ". You must Answer user questions. You must provide the answer in english language."
        # return "You are customer service and users ask you about list of services. list of services you support in are [sejlat, enginex, Expense Tracker App, Semicolon, Medical Resources, story to cartoon, Mafqoud]. use this info to answer question. Include this info from the provided context in your answer when relevant. You must provide the answer in arabic language. Context: " + context
    elif lang == 'ar':
        return "Based on this Context: " + context + ". You must Answer user questions. You must provide the answer in arabic language using saudi dialect."
    



#
# def get_answer_silma(context, question):
#     model_id = "silma-ai/SILMA-9B-Instruct-v1.0"
#     tokenizer = AutoTokenizer.from_pretrained(model_id)
#     model = AutoModelForCausalLM.from_pretrained(
#         model_id,
#         device_map="auto",
#         torch_dtype=torch.bfloat16,
#     )
#
#     prompt = get_prompt(context, 'en')
#     print('\n-------------\n', prompt,'\n-------------\n')
#     # return prompt
#     messages = [
#         {"role": "system", "content": prompt},
#         {"role": "user", "content": question},
#     ]
#     input_ids = tokenizer.apply_chat_template(messages, return_tensors="pt", return_dict=True, offload_folder="./offload_folder_s").to("cpu")
#     outputs = model.generate(**input_ids,
#                             #  top_p=0.85,
#                              max_new_tokens=256,
#                             #  temperature=0.98,
#                             # min_length=input_len + 4,
#                             # repetition_penalty=1.1
#                             )
#     print(outputs)
#     res = tokenizer.decode(outputs[0])
#     print(res.split("<start_of_turn>model")[-1])
#     return res.split("<start_of_turn>model")[-1]
#     # pipe = pipeline("text-generation", model="silma-ai/SILMA-9B-Instruct-v1.0")
#     # answer = pipe(messages)
#     # print(answer)

def get_answer_ollama(data: AnsweringModel):
    llm2 = ChatOllama(model=data.model_name, temperature=0.95)
    prompt = get_prompt(data.context, data.response_lang)
    print('\n-----------------------\n')
    print(prompt)
    print('\n-----------------------\n')
    answer = llm2.invoke([
        SystemMessage(prompt),
        HumanMessage('user input is ' + data.question)
    ]
    )
    print(answer.content)
    return answer.content

def get_answer_anthropic(data: AnsweringModel):
    llm2 = ChatAnthropic(model=data.model_name, temperature=0.95)
    prompt = get_prompt(data.context, data.response_lang)
    print('\n-----------------------\n')
    print(prompt)
    print('\n-----------------------\n')
    answer = llm2.invoke([
        SystemMessage(prompt),
        HumanMessage('user input is ' + data.question)
    ]
    )
    print(answer.content)
    return answer.content

def get_answer(data: AskingModel, context: str):
    if data.model_name == 'LLAMA_3' or data.model_name == 'LLAMA_3_1':
        return get_answer_ollama(AnsweringModel(question=data.question, context=context, model_name=MODELS[data.model_name], response_lang=data.response_lang))
    elif data.model_name == 'CLAUDE_3_5_SONNET':
        return get_answer_anthropic(AnsweringModel(question=data.question, context=context, model_name=MODELS[data.model_name], response_lang=data.response_lang))
        
        


def ask_question(data: AskingModel):
    print(data.question)

    # splitted_sentences = split_user_input(question)
    # print(splitted_sentences, 'splitted_sentences')
    chunks = get_chunks([data.question], data.category_name)
    context = get_context_from_docs(chunks)
    print('chunks',chunks, len(chunks))
    return get_answer(data, context)
    
