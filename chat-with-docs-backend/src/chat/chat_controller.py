from typing import Union
from fastapi import APIRouter, UploadFile
from fastapi.responses import FileResponse

from chat.chat_model import AskingModel
from chat.chat_service import ask_question
from stt.stt_service import speech_to_text
from tts.tts_service import text_to_speech

router = APIRouter()


@router.post("/ask")
async def get_message_response(data: AskingModel):
    if (data.file):
        print(data.file)
        text = speech_to_text(data.file.file.read())
        print(text)
        # answer = ask_question(text)
        return {"answer": "answer", "user_text": text}
    elif (data.question):
        answer = ask_question(data)
        print(answer)
        # ar_answer = translate_to_ar(answer)
        if data.response_type == "AUDIO":
            filename = text_to_speech(answer, data.response_lang)
            return FileResponse(filename)
        else:
            return {"answer": answer}        
    else:
        return {"answer": 'no answer'}
    # filename =  text_to_speech(question)
