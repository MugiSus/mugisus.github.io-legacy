let panelH = 300;
let panelW = panelH / 2 * 3 ** 0.5;
let drawH = panelH * 0.95;
let drawW = panelW * 0.95;
let stage = {};

wordsReplaced = {};
`
_:empty
start:arrow_start
goal:arrow_goal

r:0
rb:1
lb:2
l:3
lt:4
rt:5

lock:0
check:1
`.split("\n").filter(x=>x).map(x=>x.split(":")).forEach(x => wordsReplaced[x[0]] = x[1] == x[1] * 1 ? x[1] * 1 : x[1]);

let generateMap =(mapStr)=> {
    stage = { width: 0, height: 0 };
    stage.mainMap = mapStr.split("\n").filter(x => x).map(x => x.split(" ").map(x => {return {panel: [x.split(/\.|-/)[0], x.split(/\.|-/)[1] || 0, ...x.split(".").slice(1)].map(x => wordsReplaced[x] || x)}}));
    stage.mainMap.forEach(x => stage.width = Math.max(x.length, stage.width));
    stage.height = stage.mainMap.length;
}

let drawMap =(xpos, ypos)=> {
    ctx.save();
    ctx.translate(xpos, ypos);
    stage.mainMap.forEach((i, y) => i.forEach((j, x) => {
        drawPanel(j.panel[0], x, y, j.panel[1], j.panel.slice(2));
    }));
    ctx.restore();
}

let drawPanel =(name, x, y, r, option = [], isFocused)=> {
    if (name == "empty") return;
    if (r < 0) r += 6;
    ctx.save();
    ctx.translate(panelW * (x + (y % 2 ? 0.5 : 0)), panelH * y * 0.75);
    switch (name) {
        case "arrow_start": {
            ctx.image("plain_start.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * r);
        } break;
        case "arrow_goal": {
            ctx.image("plain_goal.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * r);
        } break;
        default: {
            ctx.image("plain.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * r);
        } break;
    }
    ctx.globalAlpha = 1 - r % 1;
    ctx.image("light.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * (r % 1));
    if (r % 1) {
        ctx.globalAlpha = r % 1;
        ctx.image("light.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * (r % 1 - 1));
    }
    ctx.globalAlpha = 1;
    switch (name) {
        case "arrow":
        case "arrow_start":
        case "arrow_goal": {
            ctx.image("arrow.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * r);
        } break;
    }
    option.forEach(x=>{
        switch (x) {
            case 0: { //locked
                ctx.globalAlpha = 0.1 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.1;
                ctx.image("highlight.svg", 0, 0, drawW, drawH, 0, 0, 0);
                ctx.globalAlpha = 0.7 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.3;
                ctx.image("locked.svg", 0, (0.01 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.025) * -drawH, drawW, drawH, 0, 0, 0);
            } break;
            case 1: { //checkPoint
                ctx.globalAlpha = 0.1 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.1;
                ctx.image("highlight.svg", 0, 0, drawW, drawH, 0, 0, 0);
                ctx.globalAlpha = 0.6 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.4;
                ctx.image("checkPoint.svg", 0, (0.025 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.05) * -drawH, drawW, drawH, 0, 0, 0);
            } break;
        }
    });
    ctx.restore();
}

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    drawMap(-600, -600);

    // drawPanel("arrow_start", -1, 0, 0);
    // drawPanel("arrow", 0, 0, 1);
    // drawPanel("arrow", 1, 0, 2, [0]);
    // drawPanel("plain", 0, 1, 2);
    // drawPanel("arrow", 0, 2, 5, [1]);
    // drawPanel("arrow", 1, 2, 4);
    // drawPanel("arrow_goal", 2, 2, 0);

    requestAnimationFrame(main);
}

generateMap(`
start-r arrow-rb plain arrow-l
arrow-rt.check arrow-l _ plain.check
arrow-rb.check _ plain _ arrow-lt.check
plain.check _ arrow-r arrow-lb.check
_ arrow-r plain arrow-lt goal-r
`);

canvas.addEventListener("allLoaded", ()=>{
    main();
})