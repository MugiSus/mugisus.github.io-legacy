//canvas starter kit
var mouseState = {}, keydown = {}, time, fps, timeStamp = [], started = new Date().getTime();
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ctxSet =(obj)=> Object.keys(obj).forEach(x=>ctx[x] = obj[x]);
var getFPS =(sec = 1)=> {
    time = (new Date().getTime() - started) / 1000;
    timeStamp.push(time);
    timeStamp = timeStamp.filter(x => time - x <= sec);
    fps = Math.floor((timeStamp.length / sec) * 10) / 10;
}
var ratio, resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 3200, canvas.height / 1800);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseState.x = (event.clientX - canvas.width / 2) / ratio; mouseState.y = (event.clientY - canvas.height / 2) / ratio; mouseState.cliX = event.clientX; mouseState.cliY = event.clientY;});
var updatePos =()=> {mouseState.x = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseState.y = (event.changedTouches[0].pageY - canvas.height / 2) / ratio; mouseState.cliX = event.changedTouches[0].pageX; mouseState.cliY = event.changedTouches[0].pageY};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

var obj = [], clicked = false, offSet = [0,0];

var ORgate = class {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.bool = false;
        this.in1 = null;
        this.in2 = null;
        this.out1 = null;
    }
    draw() {
        ctxSet({"strokeStyle":"#202020", "lineWidth":10, "fillStyle":this.bool?"#ff4444":"#4444ff"})
        ctx.beginPath();
        ctx.moveTo(this.x-100, this.y-60);
        ctx.lineTo(this.x-250, this.y-60);
        ctx.moveTo(this.x-100, this.y+60);
        ctx.lineTo(this.x-250, this.y+60);
        ctx.moveTo(this.x+100, this.y);
        ctx.lineTo(this.x+250, this.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x-150, this.y-100);
        ctx.quadraticCurveTo(this.x+85, this.y-85, this.x+150, this.y);
        ctx.quadraticCurveTo(this.x+85, this.y+85, this.x-150, this.y+100);
        ctx.quadraticCurveTo(this.x-75, this.y, this.x-150, this.y-100);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if ((ctx.isPointInPath(mouseState.cliX, mouseState.cliY) && !clicked || clicked == this.id) && mouseState.left) {
            if (!clicked) {
                clicked = this.id;
                offSet = [mouseState.x - this.x, mouseState.y - this.y];
            }
            this.x = mouseState.x - offSet[0];
            this.y = mouseState.y - offSet[1];
        } else if (!mouseState.left && clicked) clicked = false;
    }
}

var ANDgate = class {

}

obj.push(new ORgate(0,0,12345));

var x = 0, y = 0;

function main() {
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    obj.forEach(x=>x.draw());
    requestAnimationFrame(main);
}

main();