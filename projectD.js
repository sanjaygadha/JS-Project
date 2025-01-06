const searchBtn = document.getElementById('search-btn');
const suggestionsDiv = document.getElementById("suggestions");
const result = document.getElementById("result");
const sound = document.getElementById("sound");

// Function to clear suggestions
const clearSuggestions = () => suggestionsDiv.innerHTML = '';
// Function to clear the result section
const clearResult = () => result.innerHTML = '';

// Handle search logic
const handleSearch = async (word) => {
    // Ensure the word input is properly captured
    if (!word) return;

    clearSuggestions();
    clearResult();
    loadingSpinner.style.display = 'block';

    try {
        // Fetch word details from dictionary API
        const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!dictionaryResponse.ok) {
            throw new Error("Word not found in the dictionary API.");
        }
        const dictionaryData = await dictionaryResponse.json();
        console.log(dictionaryData);
        loadingSpinner.style.display = 'none';

        // Create and display the word
        let main = document.createElement("div");
        main.className = "main-word-section";
        main.innerHTML = `<div class="main-word"><strong>${word}</strong></div>`;

        // Add audio if available
        let audioEntry = dictionaryData[0].phonetics.find(p => p.audio);
        let audioUrl = audioEntry?.audio || "";
        if (audioUrl) {
            main.innerHTML += `<button onclick="playSound()">
                <i class="fas fa-volume-up speaker-icon"></i>
            </button>`;
            sound.setAttribute("src", audioUrl);
        }
        result.appendChild(main);
        setTimeout(() => main.classList.add('show-content'), 150);

        // Display Part of Speech
        let partOfSpeechList = dictionaryData[0].meanings.map(meaning => meaning.partOfSpeech);
        if (partOfSpeechList.length) {
            let partOfSpeechDiv = document.createElement("div");
            partOfSpeechDiv.innerHTML = `<strong>Part of Speech:</strong> ${partOfSpeechList.join(', ')}`;
            partOfSpeechDiv.className = "part-of-speech";
            result.append(partOfSpeechDiv);
            setTimeout(() => partOfSpeechDiv.classList.add("show-content"), 450);
        }

        // Display Phonetic text
        let phoneticEntry = dictionaryData[0].phonetics.find(p => p.text);
        let phonetic = phoneticEntry?.text || "";
        if (phonetic) {
            let phoneticDiv = document.createElement("div");
            phoneticDiv.className = "phonetic";
            phoneticDiv.innerHTML = `<strong>Phonetic:</strong> ${phonetic}`;
            result.append(phoneticDiv);
            setTimeout(() => phoneticDiv.classList.add('show-content'), 300);
        }

        // Display Definition
        let definition = dictionaryData[0].meanings[0].definitions[0]?.definition || "";
        if (definition) {
            let definitionDiv = document.createElement("div");
            definitionDiv.innerHTML = `<strong>Definition:</strong> ${definition}`;
            definitionDiv.className = "definition";
            result.append(definitionDiv);
            setTimeout(() => definitionDiv.classList.add("show-content"), 600);
        }

        // Telugu Definition
        let definitionForTranslation = dictionaryData[0].meanings.find(m => m.definitions[0].definition)?.definitions[0].definition || "";
        if (definitionForTranslation) {
            try {
                let translateResponse = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(definitionForTranslation)}`);
                let translateData = await translateResponse.json();
                let translatedDefinition = translateData[0][0][0];
                let TelugudefinitionDiv = document.createElement("div");
                TelugudefinitionDiv.className = "definition";
                TelugudefinitionDiv.innerHTML = `<strong>Definition(Telugu):</strong> ${translatedDefinition}`;
                result.appendChild(TelugudefinitionDiv);
                setTimeout(() => TelugudefinitionDiv.classList.add('show-content'), 600);
            }
            catch (err) {
                console.error("Error fetching Telugu translation:", err);
                let errorDiv = document.createElement("div");
                errorDiv.className = "error";
                errorDiv.innerHTML = `<strong>Definition(Telugu):</strong> Unable to fetch translation.`;
                result.appendChild(errorDiv);
            }
        }

        // Hindi Definition
        let definitionForTranslation2 = dictionaryData[0].meanings.find(m => m.definitions[0].definition)?.definitions[0].definition || "";
        if (definitionForTranslation2) {
            try {
                let translateResponse2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(definitionForTranslation)}`);
                let translateData2 = await translateResponse2.json();
                let translatedDefinition2 = translateData2[0][0][0];
                let hindiDefinitionDiv = document.createElement("div");
                hindiDefinitionDiv.className = "definition";
                hindiDefinitionDiv.innerHTML = `<strong>Definition(Hindi):</strong> ${translatedDefinition2}`;
                result.appendChild(hindiDefinitionDiv);
                setTimeout(() => hindiDefinitionDiv.classList.add('show-content'), 600);
            }
            catch (err) {
                console.error("Error fetching Hindi translation:", err);
                let errorDiv = document.createElement("div");
                errorDiv.className = "error";
                errorDiv.innerHTML = `<strong>Definition(Hindi):</strong> Unable to fetch translation.`;
                result.appendChild(errorDiv);
            }
        }

        // Display Example sentence
        let example = findExampleWithWord(dictionaryData[0].meanings, word) || dictionaryData[0].meanings[0].definitions[0]?.example || "";
        if (example) {
            let exampleDiv = document.createElement("div");
            exampleDiv.className = "example";
            exampleDiv.innerHTML = `<strong>Example:</strong> ${example}`;
            result.appendChild(exampleDiv);
            setTimeout(() => exampleDiv.classList.add('show-content'), 750);
        }

        // Fetch synonyms and antonyms from thesaurus api
        const thesaurusApiUrl = "https://thesaurus-by-api-ninjas.p.rapidapi.com/v1/thesaurus?word=";
        const thesaurusOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '172be0fd3dmshd8f189ff539b4d7p1ea48bjsn2d27fa8a4e9c',
                'x-rapidapi-host': 'thesaurus-by-api-ninjas.p.rapidapi.com'
            }
        };
        const thesaurusResponse = await fetch(`${thesaurusApiUrl}${word}`, thesaurusOptions);
        const thesaurusData = await thesaurusResponse.json();
        let synonyms = thesaurusData.synonyms.slice(0, 10);
        let antonyms = thesaurusData.antonyms.slice(0, 10);
        console.log(antonyms)
        console.log(synonyms)
        if (synonyms.length > 1) {

            let synonymsDiv = document.createElement("div");
            synonymsDiv.className = "synonyms";
            synonymsDiv.innerHTML = `<strong>Synonyms:</strong> ${synonyms.join(', ')}`;
            result.appendChild(synonymsDiv);
            setTimeout(() => {
                synonymsDiv.classList.add('show-content');
            });
        }
        if (antonyms.length > 1) {

            let antonymsDiv = document.createElement("div");
            antonymsDiv.className = "antonyms";
            antonymsDiv.innerHTML = `<strong>antonyms:</strong> ${antonyms.join(', ')}`;
            result.appendChild(antonymsDiv);
            setTimeout(() => {
                antonymsDiv.classList.add('show-content');
            });
        }

        // fetch images from unsplash api
        const imageResponse = await fetch(`https://api.unsplash.com/search/photos?query=${word}&client_id=nqqN5PrwcgdzEng3auwnBrYtZrzfFv7lSFFmyDMnBCE&per_page=12`);
        const imageData = await imageResponse.json();
        const images = imageData.results;

        if (images.length) {
            let imagesHtml = '<div class="images">';
            images.forEach(image => {
                imagesHtml += `<img src="${image.urls.small}" alt="${word} image">`;
            });
            imagesHtml += '</div>';
            result.innerHTML += imagesHtml;
            setTimeout(() => document.querySelector('.images').classList.add('show-content'), 1000);
        } else {
            result.innerHTML += `<p class="error">No images found for "${word}".</p>`;
        }
    } catch (error) {
        result.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
};

// Event listener for input word
document.getElementById("inp-word").addEventListener("input", async () => {
    const inpWord = document.getElementById("inp-word").value;
    if (inpWord.length < 2) {
        return clearSuggestions();
    }
    try {
        // Fetch suggestion words using Datamuse API
        const response = await fetch(`https://api.datamuse.com/sug?s=${inpWord}`);
        if (!response.ok) {
            throw new Error("Failed to fetch suggestions.");
        }
        const data = await response.json();
        clearSuggestions();

        data.forEach(suggestion => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.textContent = suggestion.word;
            suggestionDiv.addEventListener('click', async () => {
                document.getElementById("inp-word").value = suggestion.word;
                clearSuggestions();

                // Uncomment the following line if you want to trigger a search automatically
                // await handleSearch(suggestion.word);
            });
            suggestionsDiv.appendChild(suggestionDiv);
        });
    } catch (err) {
        console.error("Error fetching suggestions:", err);
    }
});


// Function to find an example with the word
function findExampleWithWord(meanings, word) {
    for (let meaning of meanings) {
        for (let definition of meaning.definitions) {
            if (definition.example && definition.example.includes(word)) {
                return definition.example;
            }
        }
    }
    return null;
}

// Search button event listener
searchBtn.addEventListener("click", async () => {
    const word = document.getElementById("inp-word").value;
    await handleSearch(word);
});

// Enter key event listener for search
document.getElementById("inp-word").addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        const word = document.getElementById("inp-word").value;
        await handleSearch(word);
    }
});

// Play sound function
const playSound = () => {
    if (sound.src) {
        sound.play();
    }
};
