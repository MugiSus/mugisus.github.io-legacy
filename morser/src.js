//init

//canvas starter kit
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ratio;
var resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 400, canvas.height / 200);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
var mouseState = {}; var keydown = {};
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = (event.clientX - canvas.width / 2) / ratio; mouseY = (event.clientY - canvas.height / 2) / ratio;});
var updatePos =()=> {mouseX = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseY = (event.changedTouches[0].pageY - canvas.height / 2) / ratio;};
document.addEventListener("touchstart", (event)=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", (event)=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

const morse = {" ":""};

`
a .-
b -...
c -.-.
d -..
e .
f ..-.
g --.
h ....
i ..
j .---
k -.-
l .-..
m --
n -.
o ---
p .--.
q --.-
r .-.
s ...
t -
u ..-
v ...-
w .--
x .--.
y -.--
z --..

1 .----
2 ..---
3 ...--
4 ....-
5 .....
6 -....
7 --...
8 ---..
9 ----.
0 -----

. .-.-.-
, --..--
: ---...
; -.-.-.
( -.--.
) -.--.-
' .----.
" .-..-.
! -.-.--
? ..--..
- -....-
= -...-
_ ..--.-
/ -..-.-
@ .--.-.
$ ...-..-

`.split("\n").filter(x=>x!="").map(x=>x.split(" ")).forEach(x=>morse[x[0]]=x[1]);

var alpha = {".":0.2, "-":0.2, "c":0.2, "e":0.2}, pressedKey = {}, stack = [], text = [];

function main(){
    ctx.clearRect(-200,-100,400,200);
    Object.keys(alpha).forEach(x=>{alpha[x] = Math.max(0.2, alpha[x] - 0.05)});

    if (keydown["d"] && !pressedKey["d"]) {if (stack.length > 0) stack = []; else text.pop(); alpha["c"] = 1; pressedKey["d"] = true} 
    else if (!keydown["d"]) pressedKey["d"] = false;
    if (keydown["k"] && !pressedKey["k"]) {if (result) text.push(result); stack = []; alpha["e"] = 1; pressedKey["k"] = true} 
    else if (!keydown["k"]) pressedKey["k"] = false;
    if (keydown["f"] && !pressedKey["f"]) {stack.push("."); alpha["."] = 1; pressedKey["f"] = true} 
    else if (!keydown["f"]) pressedKey["f"] = false;
    if (keydown["j"] && !pressedKey["j"]) {stack.push("-"); alpha["-"] = 1; pressedKey["j"] = true} 
    else if (!keydown["j"]) pressedKey["j"] = false;
    
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = alpha["."];
    ctx.fillRect(-115,-15,30,30);
    ctx.globalAlpha = alpha["-"];
    ctx.fillRect(-5,-15,120,30);
    ctx.globalAlpha = alpha["c"];
    ctx.textAlign = "left";
    ctx.font = "20px Montserrat 300";
    ctx.fillText("Clear", -115, 60);
    ctx.globalAlpha = alpha["e"];
    ctx.textAlign = "right";
    ctx.fillText("Enter", 115, 60);
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
    ctx.fillText(text.join(""), 0, 40);
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";

    result = Object.keys(morse)[Object.values(morse).indexOf(stack.join(""))]
    ctx.fillText(stack.map(x => x == "-" ? "_" : ".").join(" ") + "  " + (result || " "), 0, 60);

    ctx.globalAlpha = 0.5;
    ctx.font = "10px Montserrat";
    ctx.fillText(stack.map(x => x == "-" ? "_" : ".").join(" ") + " .  ... " + Object.keys(morse).filter(x => morse[x].slice(0,stack.length+1) == stack.join("") + ".").join(" "), 0, -55);
    ctx.fillText(stack.map(x => x == "-" ? "_" : ".").join(" ") + " _  ... " + Object.keys(morse).filter(x => morse[x].slice(0,stack.length+1) == stack.join("") + "-").join(" "), 0, -40);

    requestAnimationFrame(main);
}

main();