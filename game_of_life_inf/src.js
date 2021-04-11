let dots = {}, checkPos = [], drawPos = [], time = 0, scrollX = 0, scrollY = 0, defaultSize = Math.max(canvas.width, canvas.height) / 50, mouseOffSet = [], latestMouse = [], scrollVel = [0,0], pressed = {}, dragged = [], mouseMode = -1, paused = false, zoomRatio = 1.05, zoom = 1, lastWheel = mouseState.wheel;

// processer

let edit =(posX, posY, state)=> {
    dots[`${posX},${posY}`] = state;
    if (Math.abs(posX * defaultSize - scrollX) * zoom < canvas.width / ratio / 2 && Math.abs(posY * defaultSize - scrollY) * zoom < canvas.height / ratio / 2) drawPos.push([posX, posY, state]);
    
    [[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]].forEach(x=>{
        if (checkPos.indexOf(`${posX + x[0]},${posY + x[1]}`) == -1) checkPos.push(`${posX + x[0]},${posY + x[1]}`);
        if (dots[`${posX + x[0]},${posY + x[1]}`] == undefined) dots[`${posX + x[0]},${posY + x[1]}`] = 0;
    });
}

let process =()=> {

    let _dots = {}
    Object.assign(_dots, dots);
    let _checkPos = checkPos.slice(0, checkPos.length);
    checkPos = [];
    drawPos = [];

    _checkPos.forEach(x => {

        let posX = x.split(",")[0] * 1;
        let posY = x.split(",")[1] * 1;
        
        if (_dots[x] == undefined) _dots[x] = 0;

        let sum = (_dots[`${posX - 1},${posY - 1}`] || 0) + (_dots[`${posX},${posY - 1}`] || 0) + (_dots[`${posX + 1},${posY - 1}`] || 0) + (_dots[`${posX - 1},${posY}`] || 0) + (_dots[`${posX + 1},${posY}`] || 0) + (_dots[`${posX - 1},${posY + 1}`] || 0) + (_dots[`${posX},${posY + 1}`] || 0) + (_dots[`${posX + 1},${posY + 1}`] || 0);
        
        if (_dots[x]) edit(posX, posY, (sum == 2 || sum == 3) * 1);
        else if (!_dots[x] && sum == 3) edit(posX, posY, 1);

    });
    
    return Object.keys(dots).length;
}

// graphics

let draw =()=> {
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-scrollX, -scrollY);

    ctx.fillStyle = "#ffffff";
    drawPos.forEach(x => {
        if (x[2]) ctx.fillRect(x[0] * defaultSize - defaultSize * 0.45, x[1] * defaultSize - defaultSize * 0.45, defaultSize * 0.9, defaultSize * 0.9);
        else ctx.clearRect(x[0] * defaultSize - defaultSize * 0.5, x[1] * defaultSize - defaultSize * 0.5, defaultSize, defaultSize);
    });

    ctx.restore();
}

// main

edit(0,0,1);
edit(1,1,1);
edit(1,2,1);
edit(0,2,1);
edit(-1,2,1);

function main(){
    
    let mouseXinStage = mouseState.x / zoom + scrollX;
    let mouseYinStage = mouseState.y / zoom + scrollY;
    
    if (mouseState.wheel != lastWheel) {
        zoom = zoomRatio ** mouseState.wheel;
        if (lastWheel < mouseState.wheel) {
            scrollX += (mouseXinStage - scrollX) * (zoomRatio - 1);
            scrollY += (mouseYinStage - scrollY) * (zoomRatio - 1);
        } else {
            scrollX += (mouseXinStage - scrollX) * -(1 - 1 / zoomRatio);
            scrollY += (mouseYinStage - scrollY) * -(1 - 1 / zoomRatio);
        }
        lastWheel = mouseState.wheel;
    }
    
    if (mouseState.right) {
        if (!pressed.m_right) offset = {mouseX: mouseState.x, scrollX: scrollX, mouseY: mouseState.y, scrollY: scrollY};
        pressed.m_right++;
        scrollX = offset.scrollX + -(mouseState.x - offset.mouseX) / zoom;
        scrollY = offset.scrollY + -(mouseState.y - offset.mouseY) / zoom;
        latestMouse = [mouseState.x, mouseState.y];
    } else {
        if (paused && pressed.m_right && pressed.m_right < 10 && ((mouseState.x - offset.mouseX) ** 2 + (mouseState.y - offset.mouseY) ** 2) ** 0.5 < 1) process();
        if (pressed.m_right) scrollVel = [mouseState.x - latestMouse[0], mouseState.y - latestMouse[1]];
        scrollX -= scrollVel[0] *= 0.9;
        scrollY -= scrollVel[1] *= 0.9;
        pressed.m_right = 0;
    }

    if (mouseState.left) {
        if (!pressed.m_left) {
            if ((dots[`${Math.round(mouseXinStage / defaultSize)},${Math.round(mouseYinStage / defaultSize)}`] || 0) == mouseMode) dragged = [];
            pressed.m_left = true;
            mouseMode = 1 - (dots[`${Math.round(mouseXinStage / defaultSize)},${Math.round(mouseYinStage / defaultSize)}`] || 0);
        }
        if (!dragged.some(x => x[0] == Math.round(mouseXinStage / defaultSize) && x[1] == Math.round(mouseYinStage / defaultSize))) {
            dragged.push([Math.round(mouseXinStage / defaultSize), Math.round(mouseYinStage / defaultSize)])
            edit(Math.round(mouseXinStage / defaultSize), Math.round(mouseYinStage / defaultSize), mouseMode);
        }
    } else pressed.m_left = false;

    if (keydown[" "] || mouseState.middle) {
        if (!pressed.space && !pressed.m_middle) {
            pressed.space = true;
            pressed.m_middle = true;
            paused ^= 1;
            document.getElementById("mouse").src = `imgs/mouse_${paused? "pause":"play"}.png`;
        }
    } else {
        pressed.space = false;
        pressed.m_middle = false;
    }

    if (paused) {
        if (keydown.n) {
            if (pressed.n == -1) {
                pressed.n = 20;
                process();
            } else if (pressed.n-- == 0) {
                process();
                pressed.n = 1;
            }
        } else pressed.n = -1;
    } else if (time++ == 6) {
        process();
        time = 0;
    }

    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    draw();

    requestAnimationFrame(main);
}

main();