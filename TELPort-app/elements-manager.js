[...document.getElementsByClassName("modal-window")].forEach(element => element.addEventListener("click", event => event.stopPropagation()));

document.getElementById("listen-button-tuning").addEventListener("click", () => {
    listen_autoThreshold();
});

[...document.getElementById("listen-threshold-range-container").children].forEach((element, index) => element.addEventListener("change", (event) => {
    event.stopPropagation();
    threshold[index] = element.value * 1;
    console.log(`threshold ${index} set: ${threshold[index]}`);
}));

document.getElementById("call-button-tuning").addEventListener("click", (event) => {
    call_callString(TuningString, 3600000);
});

document.getElementById("call-button-send").addEventListener("click", (event) => {
    call_callString(document.getElementById("call-textarea").value, speed);
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


// scroll manager

document.getElementById("window-startup").scrollIntoView();

document.getElementById("startup-call-container").addEventListener("click", () => {
    document.getElementById("window-call").scrollIntoView({behavior: "smooth"});
});

document.getElementById("startup-listen-container").addEventListener("click", () => {
    document.getElementById("window-listen").scrollIntoView({behavior: "smooth"});
});

document.getElementById("call-exit-arrow").addEventListener("click", () => {
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"});
});

document.getElementById("listen-exit-arrow").addEventListener("click", () => {
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"});
});


// localStorage

