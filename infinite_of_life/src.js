let dots = {}, checkPos = [], time = 0, scrollX = 0, scrollY = 0, size = Math.max(canvas.width, canvas.height) / 50, mouseOffSet = [], latestMouse = [], scrollVel = [0,0], pressed = {}, choosen = 0, mouseMode = -1, paused = false;

// processer

let edit =(posX, posY, state)=> {
    dots[`${posX},${posY}`] = state;
    
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
    
    let h = Math.ceil(canvas.height / ratio / size);
    let w = Math.ceil(canvas.width / ratio / size);

    ctx.fillStyle = "#ffffff";

    for (let i = -1; i < h + 2; i++) {
        for (let j = -1; j < w + 2; j++) {

            ctx.globalAlpha = 0;

            let posX = (j - w / 2) * size - scrollX % size;
            let posY = (i - h / 2) * size - scrollY % size;
            let state = dots[`${j + ~~(scrollX/size)},${i + ~~(scrollY/size)}`] || 0;

            if (Math.abs(posX - mouseState.x) < size / 2 && Math.abs(posY - mouseState.y) < size / 2) {
                choosen = state;
                ctx.globalAlpha += 0.1
                if (mouseState.left && state != mouseMode) {
                    edit(j + ~~(scrollX/size), i + ~~(scrollY/size), mouseMode);
                }
            }

            if (state) {
                ctx.globalAlpha += 0.8;
                ctx.fillRect(posX - size * 0.45, posY - size * 0.45, size * 0.9, size * 0.9);
            } else {
                ctx.globalAlpha += Math.max((1 - ((posX - mouseState.x) ** 2 + (posY - mouseState.y) ** 2) ** 0.5 / (size * 10)) * 0.1, 0);
                if (ctx.globalAlpha != 0) ctx.fillRect(posX - size * 0.45, posY - size * 0.45, size * 0.9, size * 0.9);
            }
            
        }
    }
}

// main

edit(0,0,1);
edit(1,1,1);
edit(1,2,1);
edit(0,2,1);
edit(-1,2,1);

function main(){
    if (mouseState.right) {
        if (!pressed.m_right) {
            pressed.m_right = true;
            mouseOffSet = [-mouseState.x - scrollX, -mouseState.y - scrollY];
        }
        scrollX = -mouseState.x - mouseOffSet[0];
        scrollY = -mouseState.y - mouseOffSet[1];
        latestMouse = [mouseState.x, mouseState.y];
    } else {
        if (pressed.m_right) scrollVel = [mouseState.x - latestMouse[0], mouseState.y - latestMouse[1]];
        scrollX -= scrollVel[0] *= 0.9;
        scrollY -= scrollVel[1] *= 0.9;
        pressed.m_right = false;
    }

    if (mouseState.left) {
        if (!pressed.m_left) {
            pressed.m_left = true;
            mouseMode = 1 - choosen;
        }
    } else pressed.m_left = false;

    if (keydown[" "]) {
        if (!pressed.space) {
            pressed.space = true;
            paused ^= 1;
        }
    } else pressed.space = false;

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