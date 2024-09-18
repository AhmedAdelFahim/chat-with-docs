import pyAudioKits.audio as ak
import uuid
import noisereduce as nr
from scipy.io import wavfile
def amplify_sound(path):
    file_id = uuid.uuid4()
    tmpFileName = f"./{file_id}.wav"
    audio = ak.read_Audio(direction=path)
    audio = audio.amplify(15)
    audio.save(direction=tmpFileName)
    return f"./{file_id}.wav"

def noise_cancellation(path):
    file_id = uuid.uuid4()
    rate, data = wavfile.read(path)
    reduced_noise = nr.reduce_noise(y=data, sr=rate)
    wavfile.write(f"{file_id}_reduced_noise.wav", rate, reduced_noise)
    return f"{file_id}_reduced_noise.wav"

