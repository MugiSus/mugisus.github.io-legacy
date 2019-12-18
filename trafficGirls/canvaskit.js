//canvas starter kit
let pixelw = 3200, pixelh = 1800;

let mouseState = {wheel:0, x:0, y:0, left:false, middle:false, right:false}, keydown = {}, fps_time, fps_fps, fps_timeStamp = [], fps_started = new Date().getTime();
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
//loading images

let img = {}, loadedImgs = 0, eve = new Event("imageLoaded");
`

tg001ohyagi/tg001arrow.png
tg001ohyagi/tg001green.png
tg001ohyagi/tg001red.png
tg001ohyagi/tg001yellow.png

`.split("\n").filter(x=>x!=""&&x.charAt(0)!="#").forEach((x,y,z)=>{
    let i = new Image();
    i.src = `imgs/${x}`;
    img[/\/(.*?)\..*?/.exec(x)[1]] = i;
    i.onload =()=> {
        loadedImgs++;
        if (loadedImgs == z.length) canvas.dispatchEvent(eve);
    }
});

ctx.__proto__.image =(name, x, y, h, w, ox = 0, oy = 0, r = 0)=> {
    if (Object.keys(img).indexOf(name) == -1) return 0;
    ctx.save();
    ctx.translate(x + ox * w, y + oy * h);
    ctx.rotate(r);
    ctx.drawImage(img[name], -w * ox, -h * ox, h, w);
    ctx.restore();
}