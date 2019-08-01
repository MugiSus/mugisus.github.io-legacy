const theme = {
    "light": {
        bg:"#eeeeee",
        contour:"#202020",
        gTrue:"#ff4444",
        gFalse:"#6666ff",
        gTrueFocus:"#ff8888",
        gFalseFocus:"#bbbbff",
        wTrue:"#cc6666",
        wFalse:"#666688"
    },
    "dark": {
        bg:"#222222",
        contour:"#bbbbbb",
        gTrue:"#aa444488",
        gFalse:"#4444aa88",
        gTrueFocus:"#ff444488",
        gFalseFocus:"#4444ffbb",
        wTrue:"#ff444444",
        wFalse:"#4444ff44"
    }
}

let themeName = /theme=(.+)/gi.exec(location.search);
let color = theme[themeName ? themeName[1] : "light"];

document.body.style.backgroundColor = color.bg;