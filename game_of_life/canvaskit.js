//canvas starter kit
let pixelw = 900, pixelh = 1600;
let mouseState = {wheel:10, x:0, y:0, left:false, middle:false, right:false}, keydown = {}, fps_time, fps_fps, fps_timeStamp = [], fps_started = new Date().getTime();
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
let ctxSet =(obj)=> Object.keys(obj).forEach(x=>ctx[x] = obj[x]);
let clearAll =()=> ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
let getFPS =(sec = 1)=> {
    fps_time = (new Date().getTime() - fps_started) / 1000;
    fps_timeStamp.push(fps_time);
    fps_timeStamp = fps_timeStamp.filter(x => fps_time - x <= sec);
    return fps_fps = Math.floor((fps_timeStamp.length / sec) * 10) / 10;
}
let ratio, resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / pixelw, canvas.height / pixelh);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","middle","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","middle","right"][event.button]] = false;});
canvas.addEventListener("wheel", (event)=>{mouseState["wheel"] += event.deltaY > 0 ? -1 : 1});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseState.x = (event.clientX - canvas.width / 2) / ratio; mouseState.y = (event.clientY - canvas.height / 2) / ratio; mouseState.cliX = event.clientX; mouseState.cliY = event.clientY;});
let updatePos =()=> {mouseState.x = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseState.y = (event.changedTouches[0].pageY - canvas.height / 2) / ratio; mouseState.cliX = event.changedTouches[0].pageX; mouseState.cliY = event.changedTouches[0].pageY};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false};
resize();

ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
//end kit

document.title = "Conway's Game of Life"