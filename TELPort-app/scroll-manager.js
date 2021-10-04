// document.addEventListener("touchmove", event => {
//     event.preventDefault();
// }, {passive: false});

document.getElementById("startup-call-container").addEventListener("click", () => {
    document.getElementById("window-call").scrollIntoView({behavior: "smooth"})
});

document.getElementById("startup-listen-container").addEventListener("click", () => {
    document.getElementById("window-listen").scrollIntoView({behavior: "smooth"})
});

document.getElementById("call-exit-arrow").addEventListener("click", () => {
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"})
});

document.getElementById("listen-exit-arrow").addEventListener("click", () => {
    document.getElementById("window-startup").scrollIntoView({behavior: "smooth"})
});