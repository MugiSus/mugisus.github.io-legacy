let updateCancelVariableImages =()=> {
    [
        "call-button-tuning",
        "call-button-send",
        "listen-button-receive",
    ].forEach(elementId => {
        document.getElementById(elementId).src = `${
            elementId
        }${
            document.getElementById(elementId).hasAttribute("clicked") ? "-cancel" : ""
        }.svg`
    })
}

// call

document.getElementById("call-button-tuning").addEventListener("click", (event) => {
    document.getElementById("call-button-send").removeAttribute("clicked");
    document.getElementById("listen-button-receive").removeAttribute("clicked");

    if (event.target.toggleAttribute("clicked"))
        call_callString(TuningString, 3600000);
    else 
        initialize();

    updateCancelVariableImages();
});

document.getElementById("call-button-send").addEventListener("click", (event) => {
    document.getElementById("call-button-tuning").removeAttribute("clicked");
    document.getElementById("listen-button-receive").removeAttribute("clicked");

    if (event.target.toggleAttribute("clicked"))
        call_callString(document.getElementById("call-textarea").value, speed);
    else
        initialize();

    updateCancelVariableImages();
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


// listen

let listenLoopEnabled = false;

[...document.getElementById("listen-threshold-range-container").children].forEach((element, index) => element.addEventListener("change", (event) => {
    event.stopPropagation();
    threshold[index] = element.value * 1;
    console.log(`threshold ${index} set: ${threshold[index]}`);
}));

document.getElementById("listen-button-tuning").addEventListener("click", () => {
    listen_autoThreshold();
});

document.getElementById("listen-button-receive").addEventListener("click", (event) => {
    document.getElementById("call-button-send").removeAttribute("clicked");
    document.getElementById("call-button-tuning").removeAttribute("clicked");

    if (event.target.toggleAttribute("clicked")) 
        listen_StartlistenStringLoop();
    else 
        initialize();

    updateCancelVariableImages();
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
    initialize();
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"});
});

document.getElementById("listen-exit-arrow").addEventListener("click", () => {
    initialize();
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"});
});


// localStorage

