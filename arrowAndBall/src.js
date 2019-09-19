//load images
let imgs = {_loaded:0, _sum:0};
["blackL", "blackN", "checkPoint", "glass0", "glass1", "glass2", "glass3", "goalN", "jump1", "jump2", "jump3", "offB", "offC", "offG", "offO", "offR", "offY", "onB", "onC", "onG", "onO", "onR", "onY", "plain", "reverser", "startN", "switchB", "switchC", "switchG", "switchO", "switchR", "switchY", "warpB", "warpC", "warpG", "warpO", "warpR", "warpY", "whiteL", "whiteN"].forEach(x=>{
    imgs[x] = new Image();
    imgs[x].src = `pngs/${x}.png`;
    imgs[x].onload =()=> imgs._loaded++;
    imgs._sum++;
});

let panelSize = 150 / 500;

let drawPanel =(name, x, y, rotate = 0, size = 1)=> drawImg(name, panelSize * x, panelSize * y, rotate, size.length ? size.map(x=>x*panelSize) : panelSize * size);

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
    ctx.translate((x - board[0].length / 2 + 0.5) * 520 * panelSize + xpos, (y - board.length / 2 + 0.5) * 520 * panelSize + ypos);
    switch (j.replace(/[1234567890NESWLROYGCB]$/, "")) {
        case "glass": {
            drawPanel(j,0,0);
            if ((clock - (x + y) * 3) % 300 < 60) {
                ctx.globalAlpha = (60 - (clock - (x + y) * 3) % 300) / 60 * 0.75;
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
            drawPanel(j,0,-50+35*Math.sin(clock/60*Math.PI));
            if ((clock - (x + y) * 3) % 600 < 20) {
                ctx.globalAlpha = (20 - (clock - (x + y) * 3) % 600) / 20 * 0.9;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(0,(-50+35*Math.sin(clock/60*Math.PI))*panelSize**2,panelSize*100,0,Math.PI*2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        } break;
        case "white": {
            switch (j.charAt(5)) {
                case "N" : drawPanel("whiteN", 0, 0, 0); break;
                case "E" : drawPanel("whiteN", 0, 0, 0.5); break;
                case "S" : drawPanel("whiteN", 0, 0, 1); break;
                case "W" : drawPanel("whiteN", 0, 0, 1.5); break;
                case "L" : drawPanel("whiteL", 0, 0, 0); break;
                case "R" : drawPanel("whiteL", 0, 0, 0, [-1, 1]); break;
            }
        } break;
        case "black": {
            switch (j.charAt(5)) {
                case "N" : drawPanel("blackN", 0, 0, 0); break;
                case "E" : drawPanel("blackN", 0, 0, 0.5); break;
                case "S" : drawPanel("blackN", 0, 0, 1); break;
                case "W" : drawPanel("blackN", 0, 0, 1.5); break;
                case "L" : drawPanel("blackL", 0, 0, 0); break;
                case "R" : drawPanel("blackL", 0, 0, 0, [-1, 1]); break;
            }
        } break;
        case "start": {
            switch (j.charAt(5)) {
                case "N" : drawPanel("startN", 0, 0, 0); break;
                case "E" : drawPanel("startN", 0, 0, 0.5); break;
                case "S" : drawPanel("startN", 0, 0, 1); break;
                case "W" : drawPanel("startN", 0, 0, 1.5); break;
            }
        } break;
        case "goal": {
            switch (j.charAt(4)) {
                case "N" : drawPanel("goalN", 0, 0, 0); break;
                case "E" : drawPanel("goalN", 0, 0, 0.5); break;
                case "S" : drawPanel("goalN", 0, 0, 1); break;
                case "W" : drawPanel("goalN", 0, 0, 1.5); break;
            }
        } break;
        case "none": break;
        default: drawPanel(j, 0, 0);
    }
    ctx.restore();
}));

let drawBG =()=> {

}

let board = [
    ["startE", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "checkPoint", "blackS"],
    ["whiteS", "jump3", "none", "jump2", "glass1", "checkPoint", "whiteW"],
    ["blackR", "glass2", "jump1", "jump1", "checkPoint", "glass2", "whiteW"],
    ["whiteE", "glass2", "glass3", "checkPoint", "glass3", "glass2", "whiteS"],
    ["whiteE", "glass2", "checkPoint", "jump1", "jump1", "glass2", "blackL"],
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