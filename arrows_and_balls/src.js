const locked = 1, checkPoint = 2;

let panelH = 300;
let panelW = panelH / 2 * 3 ** 0.5;
let drawH = panelH * 0.95;
let drawW = panelW * 0.95;

let drawPanel =(name, x, y, r, option = [])=> {
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
    ctx.globalAlpha = 1 - Math.abs(r % 1);
    ctx.image("light.svg", 0, 0, drawW, drawH, 0.5, 0.5, Math.PI / 3 * (r % 1));
    if (r % 1) {
        ctx.globalAlpha = Math.max(r % 1, 0);
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
            case locked: {
                ctx.globalAlpha = 0.25 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.25;
                ctx.image("highlight.svg", 0, 0, drawW, drawH, 0, 0, 0);
                ctx.globalAlpha = 0.6 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.4;
                ctx.image("locked.svg", 0, (0.01 + Math.sin(new Date().getTime() / 1500 * Math.PI) * 0.025) * -drawH, drawW, drawH, 0, 0, 0);
            } break;
            case checkPoint: {
                ctx.globalAlpha = 1;
                ctx.image("checkPoint.svg", 0, (0.025 + Math.cos(new Date().getTime() / 1500 * Math.PI) * 0.05) * -drawH, drawW, drawH, 0, 0, 0);
            } break;
        }
    });
    ctx.restore();
}

let i = 0, j = 0;

function main(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    drawPanel("arrow_start", 0, 0, i);
    drawPanel("arrow", 1, 0, 2);
    drawPanel("arrow", 0, 1, 1);
    drawPanel("arrow_goal", 1, 1, 0);

    i += (j - i) / 5;
    requestAnimationFrame(main);
}

canvas.addEventListener("click", ()=>{
    j += 1;
})

canvas.addEventListener("allLoaded", ()=>{
    main();
})