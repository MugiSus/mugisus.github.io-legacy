//load images
let imgs = {_loaded:0, _sum:0};
["onO", "onR", "onY", "plain", "reverser", "startE", "startN", "startS", "startW", "switchB", "switchC", "switchG", "switchO", "switchR", "switchY", "warpB", "warpC", "warpG", "warpO", "warpR", "warpY", "whiteE", "whiteL", "whiteN", "whiteR", "whiteS", "whiteW", "blackE", "blackL", "blackN", "blackR", "blackS", "blackW", "checkPoint", "glass0", "glass1", "glass2", "glass3", "goalE", "goalN", "goalS", "goalW", "jump1", "jump2", "jump3", "offB", "offC", "offG", "offO", "offR", "offY", "onB", "onC", "onG"].forEach(x=>{
    imgs[x] = new Image();
    imgs[x].src = `pngs/${x}.png`;
    imgs[x].onload =()=> imgs._loaded++;
    imgs._sum++;
});

let panelSize = 200 / 500;

let drawPanel =(name, x, y, rotate = 0, size = 1)=> drawImg(name, panelSize * x, panelSize * y, rotate, panelSize * size);

let drawImg =(src, x, y, rotate = 0, size = 1)=> {
    ctx.save();
    ctx.rotate(Math.PI*rotate);
    if (size[1]) ctx.scale(...size);
    else ctx.scale(size,size);
    ctx.translate(x + imgs[src].width / -2, y + imgs[src].height / -2);
    ctx.drawImage(imgs[src],0,0);
    ctx.restore();
}

let clock = 0;

function loading() {
    clock++;
    clearAll();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 * imgs._loaded / imgs._sum / ratio, canvas.height * -0.5 / ratio);
    ctx.lineTo(canvas.width / -2 * imgs._loaded / imgs._sum / ratio, canvas.height * -0.5 / ratio);
    ctx.strokeStyle = "#b4b4b4";
    ctx.lineWidth = 50;
    ctx.stroke();
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 30;
    ctx.stroke();
    if (imgs._loaded < imgs._sum || clock < 30) requestAnimationFrame(loading);
    else requestAnimationFrame(main);
}

function main() {
    clock++;
    clearAll();
    drawPanel("plain",0,0);
    drawPanel("checkPoint",0,-50+35*Math.sin(clock/60*Math.PI));
    if (clock % 300 < 30) {
        ctx.globalAlpha = (30 - clock % 300) / 30 * 0.8;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0,(-50+35*Math.sin(clock/60*Math.PI))*panelSize*0.4,panelSize*100,0,Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(main);
}

loading();