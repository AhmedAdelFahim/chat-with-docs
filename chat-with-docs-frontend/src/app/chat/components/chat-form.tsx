/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react";
import Message from "./message";
import styles from "./page.module.css";
import ChatController from "./chat-controller";
import chatService from "../chat.service";
import AppSelect, { IOption } from "@/components/app-select";
import documentsManagementService from "@/app/documents-management/documents-management.service";

export default function ChatForm() {

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    documentsManagementService.listDocuments().then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCategories(res.data.collections)

    });
  }, [])
    const models: IOption[] = [{
      value: "LLAMA_3", label: 'llama3',
    }, {
      value: "LLAMA_3_1", label: 'llama3.1',
    }, {
      value: "CLAUDE_3_5_SONNET", label: 'claude-3-5-sonnet',
    }]

    const responseTypeOptions: IOption[] = [{
      value: "TEXT", label: 'Text',
    }, {
      value: "AUDIO", label: 'Audio',
    }]

    const responseLangOptions: IOption[] = [{
      value: "ar", label: 'Arabic',
    }, {
      value: "en", label: 'English',
    }]
    
    const categoriesOptions: IOption[] = [...categories.map((category: any) => {
      return { value: category.name, label: category.name }
    })]

    useEffect(()=> {
      setSelectedCategory(categoriesOptions?.[0] || null)
    }, [categories])

    const [model, setModel] = useState<IOption>(models[1]);
    const [responseType, setResponseType] = useState<IOption>(responseTypeOptions[0]);
    const [responseLang, setResponseLang] = useState<IOption>(responseLangOptions[1]);
    const [selectedCategory, setSelectedCategory] = useState<IOption>(categoriesOptions[0]);


    const handleModelChange = (selected: IOption) => {
      setModel(selected);
    }

    const handleResponseTypeChange = (selected: IOption) => {
      setResponseType(selected);
    }

    const handleResponseLangChange = (selected: IOption) => {
      setResponseLang(selected);
    }
    
    const [question, setQuestion] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any>([]);
    const handleQuestionChange = (q: string) => {
        setQuestion(q);
    }

    const handleAskByTextOnClick = async () => {
      const clonedMsgs = [...messages];
       // eslint-disable-next-line react/jsx-key
       clonedMsgs.push( <Message actorType="USER" message={question} messageType="TEXT"/>)
       setMessages([...clonedMsgs,])
       setQuestion('')
       const res = await chatService.askQuestion('TEXT', {
        q: question,
        modelName: model.value,
        responseType: responseType.value,
        responseLang: responseLang.value,
        categoryName: selectedCategory.value,
       });
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       // @ts-ignore
       // eslint-disable-next-line react/jsx-key 
       clonedMsgs.push(<Message actorType="AI" message={responseType.value === 'TEXT' ? res?.data.answer : res?.data} messageType={responseType.value}/>)

       setMessages([...clonedMsgs])

    }

    const handleCategoryChange = (selected: IOption) => {
      setSelectedCategory(selected)
    }
    return (
      <div className="w-100 h-100 d-flex flex-row">
      <div className={styles.chat_settings}>
        <AppSelect label="Select Category" options={categoriesOptions} onChange={handleCategoryChange} value={selectedCategory}/>
        <AppSelect label="Select model" options={models} onChange={handleModelChange} value={model}/>
        <AppSelect label="Select Response Type" options={responseTypeOptions} onChange={handleResponseTypeChange} value={responseType}/>
        <AppSelect label="Select Response Lang" options={responseLangOptions} onChange={handleResponseLangChange} value={responseLang}/>
      </div>
      <div className={styles.chat_container}>
        <div className={styles.chat_content}>
            {
                ...messages
            }
        </div>
        <ChatController btnDisabled={!(question.length !== 0 && selectedCategory !== null)} handleAskByTextOnClick={handleAskByTextOnClick} question={question} handleQuestionChange={handleQuestionChange}/>
      </div>
      </div>
      
    );
  }
  