var selectedText, selectedFile;

[...document.getElementsByClassName("container modal")].forEach(element => {
    element.addEventListener("click", () => {
        element.classList.remove("opened");

        switch (element.id) {
            case "modal-selector": {
                selectedText = document.getElementById("selector-textarea").value;
                selectedFile = document.getElementById("selector-file").files[0];
                if (selectedText.length || selectedFile?.name)
                    document.getElementById("button-selector-fulfilled").classList.add("fulfilled");
                else
                    document.getElementById("button-selector-fulfilled").classList.remove("fulfilled");
            } break;
            case "modal-listen": {

            } break;
        }
        
    });
});

[...document.getElementsByClassName("modal-window")].forEach(x => x.addEventListener("click", event => event.stopPropagation()));

document.getElementById("button-selector-container").addEventListener("click", () => {
    document.getElementById("modal-selector").classList.add("opened");
});

document.getElementById("button-listen").addEventListener("click", () => {
    document.getElementById("modal-listen").classList.add("opened");
    listen_StartlistenStringLoop();
});

document.getElementById("button-listen-auto-threshold").addEventListener("click", () => {
    listen_autoThreshold();
});

document.getElementById("button-call").addEventListener("click", () => {
    document.getElementById("modal-call").classList.add("opened");
});

document.getElementById("button-call-auto-threshold").addEventListener("click", () => {
    call_callString(TuningString, 3600000);
});

document.getElementById("button-call-play").addEventListener("click", () => {
    call_callString(document.getElementById("selector-textarea").value, speed);
});

document.getElementById("button-call-stop").addEventListener("click", () => {
    initialize();
});

document.getElementById("text-version").addEventListener("click", () => {
    fetch("dummy").then(() => {
        caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
        });
        location.reload();
    }).catch((err) => {
        console.error(err);
    });
});
