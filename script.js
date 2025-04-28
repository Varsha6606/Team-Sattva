
const languageData = {
    English: {
        nativeName: "English",
        title: "Smart City Safety Features",
        features: [
            "Emergency Call",
            "Interactive Maps",
            "Bus & Train Time",
            "Panic Button",
            "Local Services",
            "CCTV Integration"
        ]
    },
    Hindi: {
        nativeName: "हिंदी",
        title: "स्मार्ट सिटी सुरक्षा सुविधाएँ",
        features: [
            "आपातकालीन कॉल",
            "इंटरएक्टिव मानचित्र",
            "बस और ट्रेन समय",
            "पैनिक बटन",
            "स्थानीय सेवाएँ",
            "सीसीटीवी एकीकरण"
        ]
    },
    Kannada: {
        nativeName: "ಕನ್ನಡ",
        title: "ಸ್ಮಾರ್ಟ್ ಸಿಟಿ ಸುರಕ್ಷತಾ ವೈಶಿಷ್ಟ್ಯಗಳು",
        features: [
            "ತುರ್ತು ಕರೆ",
            "ಇಂಟರಾಕ್ಟಿವ್ ನಕ್ಷೆಗಳು",
            "ಬಸ್ ಮತ್ತು ರೈಲು ಸಮಯ",
            "ಪ್ಯಾನಿಕ್ ಬಟನ್",
            "ಸ್ಥಳೀಯ ಸೇವೆಗಳು",
            "ಸಿ.ಸಿ.ಟಿ.ವಿ ಏಕೀಕರಣ"
        ]
    }
};

const featureImages = {
    "Emergency Call": "images/emergency_img.jpg",
    "Interactive Maps": "images/maps.jpg",
    "Bus & Train Time": "images/transport.jpg",
    "Panic Button": "images/panic.jpg",
    "Local Services": "images/services.jpg",
    "CCTV Integration": "images/cctv.jpg"
};

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

function showFeaturesPage(selectedLanguage = "English") {
    localStorage.setItem('selectedLanguage', selectedLanguage);
    const kioskScreen = document.getElementById('kioskScreen');
    kioskScreen.innerHTML = '';

    const featurePage = document.createElement('div');
    featurePage.className = 'blank-screen';

    const title = document.createElement('h2');
    title.textContent = languageData[selectedLanguage].title;
    featurePage.appendChild(title);

    const featureGrid = document.createElement('div');
    featureGrid.className = 'feature-grid';

    const englishFeatures = languageData["English"].features;

    languageData[selectedLanguage].features.forEach((text, index) => {
        const box = document.createElement('div');
        box.className = 'feature-box';
        box.setAttribute('data-feature', englishFeatures[index].toLowerCase());

        const img = document.createElement('img');
        img.src = featureImages[englishFeatures[index]] || "";
        img.alt = text;

        const label = document.createElement('span');
        label.textContent = text;

        box.appendChild(img);
        box.appendChild(label);
        featureGrid.appendChild(box);
    });

    featurePage.appendChild(featureGrid);

    const languageSelect = document.createElement('select');
    languageSelect.className = 'language-selector';

    Object.keys(languageData).forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = languageData[lang].nativeName;
        languageSelect.appendChild(option);
    });

    languageSelect.value = selectedLanguage;
    languageSelect.addEventListener('change', (e) => {
        showFeaturesPage(e.target.value);
    });

    const voiceButton = document.createElement('button');
    voiceButton.id = 'voiceButton';
    voiceButton.innerHTML = '🎤';
    voiceButton.title = 'Speak Now';
    voiceButton.onclick = startListening;

    featurePage.appendChild(languageSelect);
    featurePage.appendChild(voiceButton);
    kioskScreen.appendChild(featurePage);
}

function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    speak("Listening");

    recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase();

        const commands = {
            "emergency": "Emergency Call",
            "maps": "Interactive Maps",
            "bus": "Bus & Train Time",
            "train": "Bus & Train Time",
            "panic": "Panic Button",
            "services": "Local Services",
            "cctv": "CCTV Integration"
        };

        let found = false;
        for (const key in commands) {
            if (spoken.includes(key)) {
                const featureText = commands[key];
                speak(`Opening ${featureText}`);
                const featureBox = Array.from(document.querySelectorAll('.feature-box')).find(box =>
                    box.getAttribute('data-feature') === featureText.toLowerCase()
                );
                if (featureBox) {
                    featureBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    featureBox.style.border = '2px solid #007bff';
                    setTimeout(() => featureBox.style.border = '', 1500);
                }
                found = true;
                break;
            }
        }

        if (!found) {
            speak("Sorry, I didn't catch that command.");
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        speak("Sorry, an error occurred while listening.");
    };
}

window.onload = () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'English';
    document.getElementById('dynamicImage').addEventListener('click', () => showFeaturesPage(savedLanguage));
    document.getElementById('dynamicImage').addEventListener('touchstart', () => showFeaturesPage(savedLanguage));
};
