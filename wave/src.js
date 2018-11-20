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
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

var scrollX = scrollY = 0;
var targetX = targetY = 0;
var time = 0;
var moveX = moveY = 0;
var waveList = [], dotList = [];
var hue = 0;

const wave = class {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.flame = 0;
        this.color = color;
    }
};

const dot = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.flame = 0;
        this.size = 10 + Math.random() * 30
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
    let deleteList = [];
    waveList.forEach((x,y)=>{
        ctx.strokeStyle = x.color;
        ctx.globalAlpha = (300 - x.flame) / 300
        ctx.circle(x.x + scrollX, x.y + scrollY, x.flame / 3);
        waveList[y].flame++
        if (x.flame >= 300) deleteList.push(y);
    });
    deleteList.forEach(x=>{waveList.splice(x,1);})
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
    ctx.clearRect(canvas.width / -2, canvas.height / -2, canvas.width, canvas.height);
    if (time > 0) {targetX += moveX; targetY += moveY;}
    else if (time < -120) {let random = Math.random() * Math.PI * 2; moveX = Math.sin(random) * 0.5; moveY = Math.cos(random) * 0.5; time = 300;}
    time--;
    scrollX += (targetX - scrollX) / 50; scrollY += (targetY - scrollY) / 50;
    drawBorder();
    drawWave();
    requestAnimationFrame(game);
};

canvas.addEventListener("click", ()=>{waveList.push(new wave(mouseX - scrollX, mouseY - scrollY, `hsl(${hue+=10}, 100%, 75%)`));})
game();
