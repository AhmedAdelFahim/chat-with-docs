import uuid
# from gtts import gTTS
from TTS.api import TTS
# def text_to_speech(text, lang = 'en'):
#     file_name =f"./{uuid.uuid4()}.wav"
#     tts = gTTS(text=text, lang=lang)
#     tts.save(file_name)
#     return file_name

def text_to_speech(text, lang = 'en'):
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

    file_name =f"./{uuid.uuid4()}.wav"
    tts.tts_to_file(text=text,
                    file_path=file_name,
                    speaker_wav="./you5.wav",
                    language="ar",
                    split_sentences=True
                    )
    return file_name

t = """يا ستي يا ختيارة
يا زينة كل الحارة
حبيبي ياللي بحبه
ناطرني بالسيارة

يا ستي يا ختيارة
يا زينة كل الحارة
حبيبي ياللي بحبه
ناطرني بالسيارة
بحبه بحبه ما بقدر خبي
وعيونه خلت قلبي
متل رماد السيجارة

بلبس فستاني الاحمر
ولا فستاني الاخضر
عازمني عالسهرية
دلينا وين بنسهر

بلبس فستاني الاحمر
ولا فستاني الاخضر
عازمني عالسهرية
دلّونا وين بنسهر

بحبه بحبه ما بقدر خبي
وعيونه خلت قلبي
متل رماد السيجارة"""

# text_to_speech(t)
