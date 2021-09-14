let selectedText = "";

[...document.getElementsByClassName("container modal")].forEach(element => {
    element.addEventListener("click", () => {
        element.classList.remove("opened");

        selectedText = document.getElementById("selector-textarea").value
        if (selectedText.length)
            document.getElementById("button-selector-fulfilled").classList.add("fulfilled");
        else
            document.getElementById("button-selector-fulfilled").classList.remove("fulfilled");
    });
});

[...document.getElementsByClassName("modal-window")].forEach(x => x.addEventListener("click", event => event.stopPropagation()));

document.getElementById("button-selector-container").addEventListener("click", () => {
    document.getElementsByClassName("container modal modal-selector")[0].classList.add("opened");
});

document.getElementsByClassName("container modal modal-selector")[0].classList.add("opened");