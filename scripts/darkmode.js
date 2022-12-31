// prevent dark mode flicker on reload
var darkMode = false;

function load() {
    try {
        let val = localStorage.getItem("config");
        if (!val.trim()) return;
        config = JSON.parse(val);

        darkMode = config.darkMode;
    }
    catch (Error) {
        console.log("Couldn't load dark mode from local storage.")
        return;
    }
}

load();

if (darkMode) {
    document.body.classList.add("dark-mode");
}