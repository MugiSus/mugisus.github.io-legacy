//canvas starter kit
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var setValue =(obj)=> Object.keys(obj).forEach(x=>ctx[x] = obj[x]);
var ratio;
var resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 1800, canvas.height / 3200);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
var raf =(func)=> {
    if (paused == 1) {
        setValue({"globalAlpha":0.5, "fillStyle":"#222222"});
        ctx.fillRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
        paused = 2;
    }
    requestAnimationFrame(paused ? raf.bind(null, func) : func);
}
var mouseState = {}, keydown = {}, paused = true;
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = (event.clientX - canvas.width / 2) / ratio; mouseY = (event.clientY - canvas.height / 2) / ratio;});
var updatePos =()=> {mouseX = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseY = (event.changedTouches[0].pageY - canvas.height / 2) / ratio;};
document.addEventListener("touchstart", (event)=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", (event)=>{mouseState["left"] = false; updatePos();});
canvas.addEventListener("mouseover", (event)=>{paused = 0});
canvas.addEventListener("mouseout", (event)=>{paused = 1});
document.addEventListener("touchend", (event)=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

document.title = "Shooting";

var stars = [], started = new Date().getTime(), time = 0, speed = 5, clock = 0;
while (stars.length < 60) stars.push([-900 + Math.random() * 1800, -1600 + Math.random() * 3200, 1 + Math.random() * 19, 0.5 + Math.random() * 0.5]);

ctx.__proto__.line =(x0, y0, x1, y1)=> {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
};

var backGround =()=>{
    setValue({"globalAlpha":1, "fillStyle":"#ffffff", "strokeStyle":"#ffffff", "lineWidth":"10"});
    ctx.line(900,-1600,900,1600);
    ctx.line(-900,1600,-900,-1600);
    stars.forEach((x,y)=>{
        ctx.globalAlpha = x[2] / 40;
        ctx.beginPath();
        ctx.arc(x[0], x[1], x[2], 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        stars[y][1] += (x[2] ** 2) / (20 ** 2) * speed;
        if (Math.abs(x[1]) > 1650 + speed) stars.push([-900 + Math.random() * 1800, (x[1] > 0 ? -1 : 1) * 1650 + Math.random() * speed, x[2]]);
    });
    stars = stars.filter(x=>Math.abs(x[1]) <= 1650 + speed);
}

function title(){
    time = new Date().getTime() - started;
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    backGround();
    setValue({"globalAlpha":0.8, "textAlign":"center", "font":"300px sans-serif"});
    ctx.fillText("Shooting", 0, -800);
    setValue({"globalAlpha":0.8, "font":"100px sans-serif"});
    ctx.fillText("-pless z to start-", 0, 800);
    clock++;
    raf(title);
}

title();