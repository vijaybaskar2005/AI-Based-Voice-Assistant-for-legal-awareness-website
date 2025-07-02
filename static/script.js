/** let keepListening = true;

function speak(text, callback = null) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);

    utterThis.onend = () => {
        if (callback) callback();
    };

    // 🟢 Append instead of replacing
    const outputDiv = document.getElementById("output");
    const paragraph = document.createElement("p");
    paragraph.innerText = "🧑‍⚖️ " + text;
    outputDiv.appendChild(paragraph);
}

function listenAndRespond() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.start();

    recognition.onresult = (event) => {
        const query = event.results[0][0].transcript
        document.getElementById("userQuery").innerText += "👤 You said: " + query + "<br> ";
        if (query.toLowerCase().includes("bye")) {
            speak("If things go wrong, remember — Better Call Saul.", () => {
                keepListening = false;
                window.close(); // or redirect
            });
            return; // ❌ Don't send to backend
}

// Send to backend only if not "bye"
fetch('/get_section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
})
.then(response => response.json())
.then(data => {
    speak(data.response, () => {
        if (keepListening) {
            listenAndRespond(); // 🔁 keep looping
        }
    });
});

    };

    recognition.onerror = () => {
        document.getElementById("output").innerText = "❗ Sorry, I didn't catch that. Please speak again.";
        if (keepListening) listenAndRespond();
        
    };
}

function startListening() {
    keepListening = true;
    speak("Hi I am Saul Goodman, your lawyer. Stay calm and tell me your problem.", () => {
        listenAndRespond();
    });
} */
let keepListening = true;

function speak(text, callback = null) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);

    utterThis.onend = () => {
        if (callback) callback();
    };

    // Append spoken text as a message block
    const outputDiv = document.getElementById("output");
    const paragraph = document.createElement("p");
    paragraph.innerText = "🧑‍⚖️ " + text;
    outputDiv.appendChild(paragraph);
}

function listenAndRespond() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.start();

    recognition.onresult = (event) => {
        const query = event.results[0][0].transcript;

        // Append user query as HTML
        const userQueryDiv = document.getElementById("userQuery");
        userQueryDiv.innerHTML += `👤 You said: <strong>${query}</strong><br>`;

        // If user says bye
        if (query.toLowerCase().includes("bye")) {
            speak("If things go wrong, remember — Better Call Saul.", () => {
                keepListening = false;
                window.close(); // or redirect
            });
            return;
        }

        // Send query to backend
        fetch('/get_section', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(data => {
            const outputDiv = document.getElementById("output");

            // Create a new response block
            const crimeDiv = document.createElement("div");
            crimeDiv.style.marginTop = "15px";
            crimeDiv.style.padding = "10px";
            crimeDiv.style.border = "1px solid #ccc";
            crimeDiv.style.borderRadius = "8px";
            crimeDiv.style.backgroundColor = "#f9f9f9";

            // If data is object (structured BNS)
            if (typeof data.response === "object") {
                const descriptionP = document.createElement("p");
                descriptionP.innerHTML = `📘 <strong>${data.response.description}</strong>`;
                crimeDiv.appendChild(descriptionP);

                if (data.response.sections) {
                    data.response.sections.forEach(section => {
                        const sectionP = document.createElement("p");
                        sectionP.textContent = `• ${section}`;
                        crimeDiv.appendChild(sectionP);
                    });
                }

                if (data.response.what_to_do) {
                    const whatToDoHeader = document.createElement("p");
                    whatToDoHeader.innerHTML = `🛠 <strong>What to do:</strong>`;
                    crimeDiv.appendChild(whatToDoHeader);

                    data.response.what_to_do.forEach(item => {
                        const itemP = document.createElement("p");
                        itemP.textContent = `• ${item}`;
                        crimeDiv.appendChild(itemP);
                    });
                }

                speak(data.response.description, () => {
                    if (keepListening) {
                        listenAndRespond();
                    }
                });
            } else {
                // Plain string response (e.g., error)
                const errorP = document.createElement("p");
                errorP.textContent = data.response;
                crimeDiv.appendChild(errorP);

                speak(data.response, () => {
                    if (keepListening) {
                        listenAndRespond();
                    }
                });
            }

            // Append the crime info to output div
            outputDiv.appendChild(crimeDiv);
        });
    };

    recognition.onerror = () => {
        const errorDiv = document.createElement("p");
        errorDiv.textContent = "❗ Sorry, I didn't catch that. Please speak again.";
        document.getElementById("output").appendChild(errorDiv);
        if (keepListening) listenAndRespond();
    };
}

function startListening() {
    keepListening = true;
    speak("Hi I am Saul Goodman, your lawyer. Stay calm and tell me your problem.", () => {
        listenAndRespond();
    });
}



