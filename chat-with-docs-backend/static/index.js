const sendBtn = document.getElementById('send-btn');
const recordBtn = document.getElementById('record-btn');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const audioCtx = new AudioContext();
let recording = false;

async function askQ(q) {
    const res = await fetch("/v1/chat/ask?question="+encodeURIComponent(q), {
        method: 'POST',
    });
    return res;
}

async function askQByAudio(audio) {
    const formData = new FormData();
    formData.append('file', audio)
    const res = await fetch("/v1/chat/ask", {
        method: 'POST',
        body: formData,
    });
    return res;
}

function displayMessage(messageOwner, type, messageContent, audioElement, color) {
    const messageContainer = document.createElement("div");
    messageContainer.setAttribute("class", 'message-container');
    const divTemp = document.createElement("div");
    const strongTemp = document.createElement("strong");
    strongTemp.innerHTML = messageOwner
    divTemp.append(strongTemp);
    const divTemp2 = document.createElement("pre");
    messageContainer.append(divTemp);
    messageContainer.append(divTemp2);
    if (type === 'text') {
        divTemp2.innerHTML = messageContent;
        divTemp2.style.color = 'green';
    } else {
        divTemp2.appendChild(audioElement);
    }

    chatBox.append(messageContainer);
}

function handleResponse(res) {
    const resType = res.headers.get("Content-Type")
    if (res.ok) {
        if (resType === 'application/json') {
            res.json().then((json) =>{
//                const messageContainer = document.createElement("div");
//                messageContainer.setAttribute("class", 'message-container');
//                console.log(messageContainer);
//                const divTemp = document.createElement("div");
//                const strongTemp = document.createElement("strong");
//                strongTemp.innerHTML = 'AI Message:'
//                divTemp.append(strongTemp);
//                const divTemp2 = document.createElement("div");
//                messageContainer.append(divTemp);
//                messageContainer.append(divTemp2);
//                divTemp2.innerHTML = json.ar_answer || json.answer;
//                divTemp2.style.color = 'green';
//                chatBox.append(messageContainer);

                displayMessage('AI Message:', 'text', json.answer, null, 'green')
                if (json.ar_answer) {
                    displayMessage('AI Message:', 'text', json.ar_answer, null, 'green')
                }

                if (json.user_text) {
                    displayMessage('User Text:', 'text', json.user_text, null, 'red')
                }

            }).catch(console.log);

        } else if (resType === 'audio/x-wav') {
            res.blob().then((audioBlob) =>{
//                const messageContainer = document.createElement("div");
//                messageContainer.setAttribute("class", 'message-container');
//                const divTemp = document.createElement("div");
//                const strongTemp = document.createElement("strong");
//                strongTemp.innerHTML = 'AI Message Audio:'
//                divTemp.append(strongTemp);
//                const divTemp2 = document.createElement("div");
//                messageContainer.append(divTemp);
//                messageContainer.append(divTemp2);

                const audio = document.createElement("audio");
                audio.controls = 'controls'
                const audioSrc = document.createElement("source");
                audioSrc.src = URL.createObjectURL(audioBlob);
                audioSrc.type = resType;
                audio.appendChild(audioSrc);
//                divTemp2.appendChild(audio);
                audio.play();
//                chatBox.append(messageContainer);
                displayMessage('AI Message Audio:', 'audio', null, audio, null)
            }).catch(console.log);

        }
    }
}

if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({"audio": true}).then((stream) => {

        // Instantiate the media recorder.
        const mediaRecorder = new MediaRecorder(stream);

        // Create a buffer to store the incoming data.
        let chunks = [];
        mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data);
        }

        // When you stop the recorder, create a empty audio clip.
        mediaRecorder.onstop = (event) => {
            //            <div class="message-container">
            //                <div>
            //                    <strong>
            //                        user audio:
            //                    </strong>
            //                </div>
            //                <div>
            //                    <audio>
            //                        <source/>
            //                    </audio>
            //                </div>
            //            </div>
            const audio = new Audio();
            audio.setAttribute("controls", "");
//            const messageContainer = document.createElement("div");
//            messageContainer.setAttribute("class", 'message-container');
//            console.log(messageContainer);
//            const divTemp = document.createElement("div");
//            const strongTemp = document.createElement("strong");
//            strongTemp.innerHTML = 'User Audio:'
//            divTemp.append(strongTemp);
//            const divTemp2 = document.createElement("div");
//            divTemp2.append(audio);
//            messageContainer.append(divTemp);
//            messageContainer.append(divTemp2);
//            chatBox.append(messageContainer);
            //                    $("#chat-box").append("<br />");
            // Combine the audio chunks into a blob, then point the empty audio clip to that blob.
            const blob = new Blob(chunks, {"type": "audio/ogg; codecs=opus"});
            audio.src = window.URL.createObjectURL(blob);
            displayMessage('User Audio:', 'audio', null, audio, null)

            askQByAudio(blob).then((res)=> {
                return handleResponse(res)
            }).catch(console.log)
            // Clear the `chunks` buffer so that you can record again.
            chunks = [];
        };

        // Set up event handler for the "Record" button.
        recordBtn.addEventListener('click', () => {
            if (recording) {
                mediaRecorder.stop();
                recording = false;
                //            $("#record").html("Record");
                recordBtn.innerHTML = 'Record'
            } else {
                mediaRecorder.start();
                recording = true;
                //            $("#record").html("Stop");
                recordBtn.innerHTML = 'Stop'
            }
        })

    }).catch((err) => {
        // Throw alert when the browser is unable to access the microphone.
        alert("Oh no! Your browser cannot access your computer's microphone.");
    });
} else {
    // Throw alert when the browser cannot access any media devices.
    alert("Oh no! Your browser cannot access your computer's microphone. Please update your browser.");
}

sendBtn.addEventListener('click', async () => {
    const q = chatInput.value;
    if (q && q.length > 0) {

        const messageContainer = document.createElement("div");
        messageContainer.setAttribute("class", 'message-container');
        const divTemp = document.createElement("div");
        const strongTemp = document.createElement("strong");
        strongTemp.innerHTML = 'User TEXT:'
        divTemp.append(strongTemp);
        const divTemp2 = document.createElement("pre");
        messageContainer.append(divTemp);
        messageContainer.append(divTemp2);
        divTemp2.innerHTML = q;
        divTemp2.style.color = 'red';
        chatBox.appendChild(messageContainer);
        askQ(q).then((res)=> {
            return handleResponse(res)
        }).catch(console.log);
        chatInput.value = '';
    }
});