import uuid

import whisper

from utils.file_helper import write_file

from audio.audio_service import amplify_sound, noise_cancellation


model = whisper.load_model("large-v3")

def preprocces_speech(path):
    amplified_speech_path = amplify_sound(path)
    result = model.transcribe(amplified_speech_path, temperature=0.5)
    print(result["text"], 'amplified_speech_path')
    cleaned_speech_path = noise_cancellation(amplified_speech_path)
    # result = model.transcribe(cleaned_speech_path, language='ar', temperature=0.9)
    # print(result["text"], 'cleaned_speech_path')

    return cleaned_speech_path

def speech_to_text(file):
    tmpFileName = f"./{uuid.uuid4()}.mp3"
    write_file(file, tmpFileName, 'wb')
    # result = model.transcribe(tmpFileName, temperature=0.5)
    # print(result["text"], 'tmpFileName')
    # cleaned_speech_path = preprocces_speech(tmpFileName)
    # cleaned_speech_path = './4e37068d-01ee-4358-a8eb-e5fab8610c4b.mp3'
    # result = model.transcribe(cleaned_speech_path, temperature=0.5)
    # print(result)
    return 'result["text"]'