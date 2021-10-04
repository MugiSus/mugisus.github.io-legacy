// document.addEventListener("touchmove", event => {
//     event.preventDefault();
// }, {passive: false});

document.getElementById("startup-call-container").addEventListener("click", () => {
    document.getElementById("window-call").scrollIntoView({behavior: "smooth"})
});

document.getElementById("startup-listen-container").addEventListener("click", () => {
    document.getElementById("window-listen").scrollIntoView({behavior: "smooth"})
});