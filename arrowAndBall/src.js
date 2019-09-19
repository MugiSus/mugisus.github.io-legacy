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

let drawBoard =(xpos = 0, ypos = 0)=> board.forEach((i,y)=>i.forEach((j,x)=>{
    ctx.save()
    ctx.translate((x - board[0].length / 2 + 0.5) * 525 * panelSize + xpos, (y - board.length / 2 + 0.5) * 525 * panelSize + ypos);
    switch (j.replace(/[1234567890NESWROYGCB]$/, "")) {
        case "glass": {
            drawPanel(j,0,0);
            if ((clock - (x + y) * 3) % 200 < 20) {
                ctx.globalAlpha = (20 - (clock - (x + y) * 3) % 200) / 20 * 0.9;
                ctx.fillStyle = "#f0f0f0";
                ctx.fillRect(-245*panelSize,-245*panelSize,490*panelSize,490*panelSize);
                ctx.globalAlpha = 1;
            }
        } break;
        case "jump": {
            drawPanel("plain",0,0);
            drawPanel(j,0,-20+20*Math.cos(clock/60*Math.PI));
        } break;
        case "checkPoint": {
            drawPanel("plain",0,0);
            drawPanel("checkPoint",0,-50+35*Math.sin(clock/60*Math.PI));
            if ((clock - (x + y) * 3) % 600 < 20) {
                ctx.globalAlpha = (20 - (clock - (x + y) * 3) % 600) / 20 * 0.9;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(0,(-50+35*Math.sin(clock/60*Math.PI))*panelSize**2,panelSize*100,0,Math.PI*2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        } break;
        case "none": break;
        default: {
            drawPanel(j, 0, 0);
        }
    }
    ctx.restore();
}));

let drawBG =()=> {

}

let board = [
    ["startE", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "blackS"],
    ["whiteS", "jump3", "none", "jump2", "glass1", "checkPoint", "whiteW"],
    ["whiteR", "glass2", "jump1", "jump1", "checkPoint", "checkPoint", "whiteW"],
    ["whiteE", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "whiteS"],
    ["whiteE", "checkPoint", "checkPoint", "jump1", "jump1", "glass2", "whiteL"],
    ["whiteS", "checkPoint", "glass1", "jump2", "none", "jump3", "whiteW"],
    ["blackE", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "goalE"]
];

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
    else {
        clock = 0;
        requestAnimationFrame(main);
    }
}

function main() {
    clock++;
    clearAll();
    drawBG();
    drawBoard();
    ctx.font = `${20/ratio}px sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`FPS:${getFPS()}`, mouseState.x, mouseState.y)
    requestAnimationFrame(main);
}

loading();