// Also, we're using FileReader API now only because it's easy to use, 
// soon it will be replaced with Blob API which is Promise based.

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


// both

[...document.getElementsByClassName("cancelable-button-container")].forEach(element => element.addEventListener("click", (event) => {
    if (element.classList.toggle("clicked"))
        [...document.getElementsByClassName("cancelable-button-container")].forEach(element => {
            if (element != event.currentTarget) element.classList.remove("clicked");
        });
}));

[...document.getElementsByClassName("mode-selector-container")].forEach(element => element.addEventListener("click", (event) => {
    element.classList.toggle("mode-file");
    element.classList.toggle("mode-text");
    initialize();
    [...document.getElementsByClassName("cancelable-button-container")].forEach(element => element.classList.remove("clicked"));
}));


// call

for (let i = 0; i < 19; i++) 
    document.getElementById("call-file-label-container").appendChild(document.getElementsByClassName("call-file-label")[0].cloneNode(true));

[...document.getElementsByClassName("call-file-input")].forEach(element => element.addEventListener("change", (event) => {
    event.target.parentElement.classList.add("selected");
    event.target.parentElement.getElementsByClassName("call-file-text")[0].innerText = event.target.files[0].name;
}));

document.getElementById("call-button-tuning").addEventListener("click", () => {
    call_callString(TuningString, 3600000);
});

document.getElementById("call-button-tuning-cancel").addEventListener("click", () => {
    initialize();
});

document.getElementById("call-button-send").addEventListener("click", () => {
    if (document.getElementById("call-mode-selector-container").classList.contains("mode-text"))
        call_callString(document.getElementById("call-textarea").value, speed);
    else
        call_callFile(document.getElementsByClassName("call-file-input")[0].files[0], speed);
});

document.getElementById("call-button-send-cancel").addEventListener("click", () => {
    initialize();
});


// listen

for (let i = 0; i < 19; i++) 
    document.getElementById("listen-file-downloader-container").appendChild(document.getElementsByClassName("listen-file-downloader")[0].cloneNode(true));

[...document.getElementById("listen-threshold-range-container").children].forEach((element, index) => element.addEventListener("change", (event) => {
    event.stopPropagation();
    threshold[index] = element.value * 1;
}));

document.getElementById("listen-button-tuning").addEventListener("click", () => {
    listen_tuning();
});

document.getElementById("listen-button-receive").addEventListener("click", (event) => {
    if (document.getElementById("listen-mode-selector-container").classList.contains("mode-text")) 
        listen_startListenStringLoop();
    else
        listen_startListenFileLoop();
});

document.getElementById("listen-button-receive-cancel").addEventListener("click", (event) => {
    initialize();
});


// scroll manager

document.getElementById("window-startup").scrollIntoView();

document.getElementById("startup-call-container").addEventListener("click", () => {
    document.getElementById("window-call").scrollIntoView({behavior: "smooth"});
});

document.getElementById("startup-listen-container").addEventListener("click", () => {
    document.getElementById("window-listen").scrollIntoView({behavior: "smooth"});
});

document.getElementById("call-exit-arrow").addEventListener("click", () => {
    [...document.getElementsByClassName("cancelable-button-container")].forEach(element => element.classList.remove("clicked"));
    initialize();
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"});
});

document.getElementById("listen-exit-arrow").addEventListener("click", () => {
    [...document.getElementsByClassName("cancelable-button-container")].forEach(element => element.classList.remove("clicked"));
    initialize();
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"});
});


// localStorage