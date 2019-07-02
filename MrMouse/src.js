//canvas starter kit
var mouseState = {}, keydown = {}, paused = [0, 0], time, started = new Date().getTime(), timeStamp = [], mouseX = 0, mouseY = 0, touchX, touchY;
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ctxSetValue =(obj)=> Object.keys(obj).forEach(x=>ctx[x] = obj[x]);
var getFPS =(sec = 1)=> {
    timeStamp.push(time);
    timeStamp = timeStamp.filter(x => time - x <= sec);
    return Math.floor((timeStamp.length / sec) * 10) / 10;
}
var ratio, resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 1800, canvas.height / 3200);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
var raf =(func)=> {
    if (paused[0] == 1) {
        ctxSetValue({"globalAlpha":0.5, "fillStyle":"#444444"});
        ctx.fillRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
        ctxSetValue({"globalAlpha":0.75, "fillStyle":"#ffffff"});
        let short = Math.min(canvas.width, canvas.height)
        ctx.fillRect(short * -0.3, short * -0.3, short * 0.2, short * 0.6);
        ctx.fillRect(short * 0.1, short * -0.3, short * 0.2, short * 0.6);
        paused[0] = 2; paused[1] = new Date().getTime();
    } else if (!paused[0] && paused[1]) {
        started += new Date().getTime() - paused[1];
        paused[1] = 0;
    }
    time = (new Date().getTime() - started) / 1000;
    requestAnimationFrame(paused[0] ? raf.bind(null, func) : func);
}
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = (event.clientX - canvas.width / 2) / ratio; mouseY = (event.clientY - canvas.height / 2) / ratio;});
var updatePos =()=> {event.changedTouches.forEach((x,y)=>{touchX[y] = (x.pageX - canvas.width / 2) / ratio; touchY[y] = (x.pageY - canvas.height / 2) / ratio;})};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
canvas.addEventListener("mouseover", ()=>{paused[0] = 0});
canvas.addEventListener("mouseout", ()=>{paused[0] = 1});
resize();
//end kit

document.title = "Mr.mouse";

var stars = [], speed = 5, clock = 0, playerX = 0, playerY = 1800, vibration = 0, cursorX = 0, cursorY = 0, bulletPower = 1, lowPower = false, bulletData = [], lastBullet = 0;
while (stars.length < 60) stars.push([-900 + Math.random() * 1800, -1600 + Math.random() * 3200, 1 + Math.random() * 19, 0.5 + Math.random() * 0.5]);
keydown = {w:false, a:false, s:false, d:false};

//rate = 5, bulletCost = 0.005;
rate = 15, bulletCost = 0.002;

ctx.__proto__.line =(x0, y0, x1, y1)=> {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
};

var bullet = class {
    constructor (x, y, x1, y1, x2, y2, type) {
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = type;
        this.lastX = x;
        this.lastY = y;
    }
    draw() {
        this.lastX = this.x;
        this.lastY = this.y;
        switch (this.type) {
            case 0: {
                this.x += this.x1 * Math.sin(this.y1);
                this.y += this.x1 * Math.cos(this.y1) * -1;
                let dir = Math.atan2(this.x2 - this.x, (this.y2 - this.y) * -1);
                if (this.y1 > 0 && dir < Math.PI / -2) dir += Math.PI * 2;
                else if (this.y1 < 0 && dir >= Math.PI / 2) dir -= Math.PI * 2;
                if (Math.abs(this.y1 - dir) <= Math.PI * (2 / 180)) this.y1 = dir;
                else if (this.y1 < dir) this.y1 += Math.PI * (2 / 180);
                else if (this.y1 > dir) this.y1 -= Math.PI * (2 / 180);
                this.y1 = (this.y1 + Math.PI) % (Math.PI * 2) - Math.PI;
                ctxSetValue({"globalAlpha":1, "strokeStyle":"#dddd00", "lineWidth":30});
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + 150 * Math.sin(this.y1), this.y + 150 * Math.cos(this.y1) * -1);
                ctx.stroke();
                ctxSetValue({"strokeStyle":"#eeeeee", "lineWidth":10});
                ctx.stroke();
            } break;
            case 1:{
                if (this.x1 == -1) {
                    this.x2 += 0.04;
                    ctxSetValue({"globalAlpha":Math.max(0, 1 - this.x2), "strokeStyle":"#dddd22", "lineWidth":150 * (1 - this.x2)});
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, (1 - (this.x2 - 1) ** 2) * 200, 0, Math.PI*2);
                    ctx.stroke();
                    if (this.x2 > 1) this.x = Infinity;
                } else {
                    this.x1 += 0.04;
                    this.y = this.y1 - (1 - (this.x1 - 1) ** 2) * 800
                    ctxSetValue({"globalAlpha":1, "strokeStyle":"#dddd00", "fillStyle":"#ffffff", "lineWidth":20});
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 40, 0, Math.PI*2);
                    ctx.fill();
                    ctx.stroke();
                    if (this.x1 > 1) {
                        vibration = 20;
                        for (let i = -4; i < 4; i++) bulletData.push(new bullet(this.x, this.y, 50, i * Math.PI * (45 / 180), this.x2, this.y2, 0))
                        this.x1 = -1;
                        this.x2 = 0;
                    }
                }
            } break;
            default: {
                this.x += this.x1 += this.x2;
                this.y += this.y1 += this.y2;
            }
        }
    }
}

var initCanvas =()=> {
    ctx.restore();
    ctx.save();
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    let rand = Math.random() * Math.PI * 2;
    ctx.translate(vibration * Math.sin(rand), vibration * Math.cos(rand));
    ctxSetValue({"globalAlpha":0.8, "fillStyle":"#ffffff", "font":"80px sans-serif"});
    ctx.fillText(`FPS:${getFPS()}`, -890, -1520);
    vibration += (0 - vibration) / 10;
}

var drawCursor =(x, y)=> {
    ctxSetValue({"globalAlpha":lowPower ? (time % 0.5 < 0.25 ? 0.25 : 0.75) : 1, "strokeStyle":"#eeee00", "fillStyle":"#eeee00", "lineWidth":10});

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y + 75 + 100 * bulletPower);
    ctx.lineTo(x, y + 75);
    ctx.moveTo(x, y - 75 - 100 * bulletPower);
    ctx.lineTo(x, y - 75);
    ctx.moveTo(x + 75 + 100 * bulletPower, y);
    ctx.lineTo(x + 75, y);
    ctx.moveTo(x - 75 - 100 * bulletPower, y);
    ctx.lineTo(x - 75, y);
    ctx.stroke();

    ctx.globalAlpha *= 0.5
    ctx.beginPath();
    ctx.moveTo(x - 250, y - 100);
    ctx.lineTo(x - 250, y - 200);
    ctx.lineTo(x - 200, y - 250);
    ctx.lineTo(x - 100, y - 250);
    ctx.moveTo(x + 250, y - 100);
    ctx.lineTo(x + 250, y - 200);
    ctx.lineTo(x + 200, y - 250);
    ctx.lineTo(x + 100, y - 250);
    ctx.moveTo(x - 250, y + 100);
    ctx.lineTo(x - 250, y + 200);
    ctx.lineTo(x - 200, y + 250);
    ctx.lineTo(x - 100, y + 250);
    ctx.moveTo(x + 250, y + 100);
    ctx.lineTo(x + 250, y + 200);
    ctx.lineTo(x + 200, y + 250);
    ctx.lineTo(x + 100, y + 250);

    ctx.moveTo(x + 125 + 100 * bulletPower, y);
    ctx.lineTo(canvas.width / 2 / ratio, y);
    ctx.moveTo(x - 125 - 100 * bulletPower, y, y);
    ctx.lineTo(canvas.width / -2 / ratio, y);
    ctx.moveTo(x, y + 125 + 100 * bulletPower);
    ctx.lineTo(x, canvas.height / 2 / ratio);
    ctx.moveTo(x, y - 125 - 100 * bulletPower);
    ctx.lineTo(x, canvas.height / -2 / ratio);
    ctx.stroke();
}

var drawPlayer =(x, y)=> {
    ctxSetValue({"globalAlpha":lowPower ? (time % 0.5 < 0.25 ? 0.2 : 0.4) : 0.5, "strokeStyle":"#bbbbbb", "lineWidth":10});
    ctx.beginPath();
    ctx.arc(playerX, playerY, 130, Math.PI * -0.5, Math.PI * -0.5 + Math.PI * 2 * bulletPower);
    ctx.stroke();
    ctx.beginPath();
    ctxSetValue({"globalAlpha":1, "fillStyle":"#bbbbbb"});
    ctx.moveTo(x-100, y+50);
    ctx.lineTo(x, y-50);
    ctx.lineTo(x, y+25);
    ctx.closePath();
    ctx.fill();
    ctxSetValue({"fillStyle":"#888888"});
    ctx.beginPath();
    ctx.moveTo(x+100, y+50);
    ctx.lineTo(x, y-50);
    ctx.lineTo(x, y+25);
    ctx.closePath();
    ctx.fill();
}

var backGround =()=> {
    ctxSetValue({"globalAlpha":1, "fillStyle":"#ffffff", "strokeStyle":"#ffffff", "lineWidth":"10"});
    ctx.line(900,-1600,900,1600);
    ctx.line(-900,1600,-900,-1600);
    stars.forEach((x,y)=> {
        ctx.globalAlpha = x[2] / 40;
        ctx.beginPath();
        ctx.arc(x[0], x[1], x[2], 0, Math.PI * 2, false);
        ctx.fill();
        stars[y][1] += (x[2] ** 2) / (20 ** 2) * speed;
        if (Math.abs(x[1]) > 1650 + speed) stars.push([-900 + Math.random() * 1800, (x[1] > 0 ? -1 : 1) * 1650 + Math.random() * speed, x[2]]);
    });
    stars = stars.filter(x=>Math.abs(x[1]) <= 1650 + speed);
}

var drawBullet =()=> {
    if (bulletPower == 0) lowPower = true;
    if (lowPower) bulletPower += bulletCost * 0.5;
    else if (mouseState.left || keydown[" "]) {
        bulletPower -= bulletCost;
        if (Math.floor(bulletPower / (rate * bulletCost)) != lastBullet) {
            //bulletData.push(new bullet(playerX, playerY, 150, 0, cursorX, cursorY, 0));
            bulletData.push(new bullet(playerX, playerY, 0, playerY, cursorX, cursorY, 1))
            vibration = 4;
        }
    } else bulletPower += bulletCost * 1.25;
    if (bulletPower >= 0.5 && lowPower) lowPower = false;
    lastBullet = Math.floor(bulletPower / (rate * bulletCost));
    bulletPower = Math.max(Math.min(bulletPower, 1), 0);
    bulletData.forEach(x=>x.draw());
    bulletData = bulletData.filter(x=>Math.abs(x.x) < 900 && Math.abs(x.y) < 1600);
}

var sense =()=> {
    if (touchX) {
        ctx.fillText(`FPS${touchX[0]}${touchX[1]}`, -890, -1520);
        playerX = touchX[0];
        playerY = touchY[0];
        cursorX = touchX[1];
        cursorY = touchY[1];
    } else {
        playerX += (keydown.d - keydown.a) * 20;
        playerY += (keydown.s - keydown.w) * 20;
        cursorX += ((playerX + mouseX * 2) - cursorX) / 3;
        cursorY += ((playerY + mouseY * 2) - cursorY) / 3;
    }
    playerX = Math.min(Math.max(playerX, -800), 800);
    playerY = Math.min(Math.max(playerY, -1550), 1550);
    cursorX = Math.min(Math.max(cursorX, -900), 900);
    cursorY = Math.min(Math.max(cursorY, -1600), 1600);
}

function title() {
    initCanvas();
    backGround();
    if (mouseState.left && !clock) clock = time;
    ctx.globalAlpha = Math.max(clock ? 1 - (time - clock) / 1 : 1, 0) * 0.8;
    ctxSetValue({"textAlign":"center", "font":"300px sans-serif"});
    ctx.fillText("Mr.mouse", 0, -650);
    ctxSetValue({"font":"100px sans-serif"});
    ctx.fillText("-click to start-", 0, 800);
    if (!location.href.match(/^https/)) ctx.fillText("-editable edition-", 0, -400);
    drawPlayer(playerX, playerY);
    if (clock) {
        if (time - clock < 3) {speed = 10 + (time - clock) / 3 * 490; vibration = (time - clock) / 3 * 8}
        else if (time - clock < 8) {playerY = 1800 - (time - clock - 3) / 5 * 1100; vibration = 8}
        else if (time - clock < 10) {speed = 500 - (time - clock - 8) / 2 * 450; vibration = 8 - (time - clock - 8) / 2 * 8}
    }
    if (time - clock > 10) raf(game);
    else raf(title);
}

function game() {
    initCanvas();
    sense();
    backGround();
    drawBullet();
    drawCursor(cursorX, cursorY);
    drawPlayer(playerX, playerY);
    raf(game);
}

title();
