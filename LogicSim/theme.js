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
    },
    "cyber": {
        bg:"#111111",
        contour:"#dddddd",
        gTrue:"#00ff00bb",
        gFalse:"#444444bb",
        gTrueFocus:"#88ff88bb",
        gFalseFocus:"#888884bb",
        wTrue:"#22bb2288",
        wFalse:"#66666688"
    }
}

let themeName = /theme=(.+)/gi.exec(location.search);
color = themeName ? theme[themeName[1]] || theme["light"] : theme["light"];

document.body.style.backgroundColor = color.bg;