//canvas starter kit
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ratio;
var resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 200, canvas.height / 200);
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
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

var scrollX = scrollY = 0;
var targetX = targetY = 0;
var time = 0;
var moveX = moveY = 0;
var waveList = [];
var hue = 0;
var clicked = false;

const wave = class {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.i = 0;
        this.color = color;
    }
    draw() {
        this.i = Math.min(Math.max(this.i + 0.0025, 0), 1);
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 1 - this.i;
        ctx.circle(this.x + scrollX, this.y + scrollY, (1 - ((1 - this.i) ** 2)) * 100);
    }
};

ctx.__proto__.line =(x0, y0, x1, y1)=> {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
};

ctx.__proto__.circle =(x, y, radius, fill = false)=> {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
    if (fill) ctx.fill(); else ctx.stroke();
};

var drawWave =()=> {
    ctx.lineWidth = 0.25;
    waveList.forEach(x=>x.draw());
    waveList = waveList.filter(x => x.i < 1)
};

var drawBorder =()=> {
    ctx.strokeStyle = "#404040";
    ctx.lineWidth = 0.25;
    for (let i = Math.floor(canvas.width / -40) - 1; i < Math.ceil(canvas.width / 40) + 1; i++) {
        ctx.line(scrollX % 20 + i * 20, canvas.height / 2 / ratio, scrollX % 20 + i * 20, canvas.height / -2 / ratio);
    }
    for (let i = Math.floor(canvas.height / -40) - 1; i < Math.ceil(canvas.height / 40) + 1; i++) {
        ctx.line(canvas.width / 2 / ratio, scrollY % 20 + i * 20, canvas.width / -2 / ratio, scrollY % 20 + i * 20);
    }
};

function game(){
    if (time % 10 == 0) waveList.push(new wave(-scrollX + (-2 + Math.random() * 4) * (canvas.width / ratio), -scrollY + (-2 + Math.random() * 4) * (canvas.height / ratio), "#888888"));
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    if (time > 0) {targetX += moveX; targetY += moveY;}
    else if (time < -120) {let random = Math.random() * Math.PI * 2; moveX = Math.sin(random) * 0.5; moveY = Math.cos(random) * 0.5; time = 300;}
    time--;
    scrollX += (targetX - scrollX) / 50; scrollY += (targetY - scrollY) / 50;
    if (mouseState.left && !clicked) {
        waveList.push(new wave(mouseX - scrollX, mouseY - scrollY, `hsl(${hue+=10}, 100%, 75%)`));
        clicked = true;
    } else if (!mouseState.left && clicked) clicked = false;
    drawBorder();
    drawWave();
    requestAnimationFrame(game);
};

game();