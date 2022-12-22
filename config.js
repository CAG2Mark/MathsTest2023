// Maths Test "Other"" Module

// Manages cookies and anything help and privacy-related and whatever

var config = {
    ign: "",
    darkMode: false,
    questionAnswers: {}
}

function loadConfig() {
    try {
        let val = localStorage.getItem("config");
        if (!val.trim()) return;
        config = JSON.parse(val);
    }
    catch (Error) {
        console.log("Could not load preferences from JSON.");
    }
}

function saveConfig() {
    localStorage.setItem("config", JSON.stringify(config));
}

loadConfig();