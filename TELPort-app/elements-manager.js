
let isFileMode = false; // temporary. removed soon.
// Also, we're using FileReader API now only because it's easy to use, 
// soon it will be replaced with Blob API which is Promise Based.

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


// call

document.getElementById("call-button-tuning").addEventListener("click", () => {
    call_callString(TuningString, 3600000);
});

document.getElementById("call-button-tuning-cancel").addEventListener("click", () => {
    initialize();
});

document.getElementById("call-button-send").addEventListener("click", () => {
    if (isFileMode)
        call_callFile(document.getElementById("call-file").files[0], speed);
    else
        call_callString(document.getElementById("call-textarea").value, speed);
});

document.getElementById("call-button-send-cancel").addEventListener("click", () => {
    initialize();
});

document.getElementById("call-file").addEventListener("change", (event) => {
    document.getElementById("call-file-text").innerText = event.target.files[0].name;
})


// listen

let listenLoopEnabled = false;

[...document.getElementById("listen-threshold-range-container").children].forEach((element, index) => element.addEventListener("change", (event) => {
    event.stopPropagation();
    threshold[index] = element.value * 1;
}));

document.getElementById("listen-button-tuning").addEventListener("click", () => {
    listen_tuning();
});

document.getElementById("listen-button-receive").addEventListener("click", (event) => {
    listen_StartlistenStringLoop();
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