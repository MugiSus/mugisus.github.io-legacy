//canvas starter kit
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ratio;
var resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 1800, canvas.height / 3200);
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

document.title = "Shooting";

var stars = [], started = new Date().getTime(), time = 0, speed = 100, starDen = 0;
while (stars.length < 60) stars.push([-900 + Math.random() * 1800, -1600 + Math.random() * 3200, 1 + Math.random() * 19, 0.5 + Math.random() * 0.5]);

ctx.__proto__.line =(x0, y0, x1, y1)=> {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
};

var backGround =()=>{
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3;
    ctx.line(-900,-1600,900,-1600);
    ctx.line(900,-1600,900,1600);
    ctx.line(900,1600,-900,1600);
    ctx.line(-900,1600,-900,-1600);
    while (stars.length < 60) stars.push([-900 + Math.random() * 1800, -1600 + (Math.random() - 0.5) * speed, 1 + Math.random() * 19]);
    stars.forEach((x,y)=>{
        ctx.globalAlpha = x[2] / 40;
        ctx.beginPath();
        ctx.arc(x[0], x[1], x[2], 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        stars[y][1] += (x[2] ** 1.25) / (20 ** 1.25) * speed;
    });
    stars = stars.filter(x=>x[1] < 1600);
}

function game(){
    time = new Date().getTime() - started;
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    if (time % 20000 < 5000) speed;
    else if (time % 20000 < 10000) speed+=0.5;
    else if (time % 20000 < 15000) speed;
    else if (time % 20000 < 20000) speed-=0.5;
    backGround();
    requestAnimationFrame(game);
}

game();