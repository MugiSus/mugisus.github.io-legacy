//canvas starter kit
var mouseState = {}, keydown = {}, paused = [0, 0], time, started = new Date().getTime();
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
    if (paused[0] == 1) {
        setValue({"globalAlpha":0.5, "fillStyle":"#222222"});
        ctx.fillRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
        setValue({"globalAlpha":0.75, "fillStyle":"#ffffff"});
        let short = Math.min(canvas.width, canvas.height)
        ctx.fillRect(short * -0.3, short * -0.3, short * 0.2, short * 0.6);
        ctx.fillRect(short * 0.1, short * -0.3, short * 0.2, short * 0.6);
        paused[0] = 2; paused[1] = new Date().getTime();
    } else if (!paused[0] && paused[1]) {
        started += new Date().getTime() - paused[1];
        paused[1] = 0;
    }
    time = (new Date().getTime() - started) / 1000;
    requestAnimationFrame(paused[0] ? raf.bind(null, func) : func);
}
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = (event.clientX - canvas.width / 2) / ratio; mouseY = (event.clientY - canvas.height / 2) / ratio;});
var updatePos =()=> {mouseX = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseY = (event.changedTouches[0].pageY - canvas.height / 2) / ratio;};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
canvas.addEventListener("mouseover", ()=>{paused[0] = 0});
canvas.addEventListener("mouseout", ()=>{paused[0] = 1});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

document.title = "Shooting";

var stars = [], speed = 5, clock = 0;
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
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    backGround();
    if (keydown.z && !clock) clock = time;
    ctx.globalAlpha = Math.max(clock ? 1 - (time - clock) / 1 : 1, 0) * 0.8;
    setValue({"textAlign":"center", "font":"300px sans-serif"});
    ctx.fillText("Shooting", 0, -800);
    setValue({"font":"100px sans-serif"});
    ctx.fillText("-pless z to start-", 0, 800);
    if (clock) {
        if (speed < 250) speed += 1;
    }
    raf(title);
}

title();