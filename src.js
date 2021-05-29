// begin basic kit

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let Resize =()=> {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaleRatio = Math.min(canvas.width / 3200, canvas.height / 1800);

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scaleRatio, scaleRatio);
}

window.addEventListener("resize", Resize);
Resize();

// begin main

let GetWavePath =(amplitude, wavelength, phase)=> {
    let path = new Path2D();
    path.moveTo(-1600, 300 + Math.sin((-1600 / wavelength + phase) * Math.PI * 2) * amplitude);
    for (let x = -1600; x <= 1600; x += 32)
        path.lineTo(x, 300 + Math.sin((x / wavelength + phase) * Math.PI * 2) * amplitude);
    return path;
}

let GetShownOrHidden =(timingpoints, time)=> {
    return timingpoints.findIndex((x) => x > time) % 2;
}

class bubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5 + Math.random() * 5;
        this.ax = -5 + Math.random() * 10;
        this.ay = -1;
    }

    draw() {
        ctx.moveTo(this.x + this.size, this.y);
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.x += this.ax *= 0.99;
        this.y += Math.max(this.ay += -0.10, -15);
    }
}

class rain {
    constructor(x, y, ax, ay) {
        this.x = x;
        this.y = y;
        this.ax = ax;
        this.ay = ay;
    }

    draw() {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.ax, this.y + this.ay);
        this.x += this.ax;
        this.y += this.ay;
    }
}

let a = 300, w = 2000, waveTimer = 2500, bubbles = [], rains = [], arrowpos = 500, scrolly = 0;

let startedTime = new Date().getTime(), timer;

function Main() {
    requestAnimationFrame(Main);

    ctx.save();
    ctx.clearRect(canvas.width / -2 / scaleRatio, canvas.height / -2 / scaleRatio, canvas.width / scaleRatio, canvas.height / scaleRatio);

    scrolly += (-window.pageYOffset - scrolly) / 7.5;
    ctx.translate(0, scrolly / scaleRatio * 0.5);
    
    a = (1 + Math.sin(new Date().getTime() / 1000) * 0.3) * 80;
    
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 5;
    ctx.stroke(GetWavePath(a, w, new Date().getTime() / 4000));
    ctx.lineWidth = 3;
    ctx.stroke(GetWavePath(a * 0.7, w * 0.9, new Date().getTime() / 10000 + 0.1));
    ctx.lineWidth = 2;
    ctx.stroke(GetWavePath(a * 0.3, w * 0.75, new Date().getTime() / 1500 + 0.25));
    
    ctx.lineWidth = 3;
    ctx.textAlign = "center";
    timer = new Date().getTime() - startedTime;

    if (timer > 1000 && timer < 5000) {
        ctx.font = "800 220px 'M PLUS Rounded 1c'";
        for (let i = 0; i < 7; i++) {
            if (1000 + i * 100 > timer) break;
            if (GetShownOrHidden([0, 1, 50, 57, 100, 113, 150, 169, 200, 225, 250, 281, 300, 337, 350, 393, 400, 449, 450, 500], timer - (1000 + i * 100))) {
                let ypos = -500 + Math.max(0, (timer - (2000 + i * 100)) / 1000) ** 5 * 800;

                ctx.strokeText("MugiSus".charAt(i), -990 + 330 * i, ypos);
                if (ypos > 300 && ypos < 4000) {
                    let randnum = 1 + Math.random() * 2;
                    for (let j = 0; j < randnum; j++)
                        bubbles.push(new bubble(-990 + 330 * i + -100 + Math.random() * 200, ypos + -50 + Math.random() * 100));
                }
            }
        }
    }

    let randnum;

    if (bubbles.length < 100) {
        randnum = -4.8 + Math.random() * 6;
        for (let j = 0; j < randnum; j++)
            bubbles.push(new bubble(-1600 + Math.random() * 3200, canvas.height / 2 / scaleRatio + 100 - scrolly / scaleRatio * 0.5));
    }

    if (timer > 4000) {
        ctx.lineWidth = 1.5;
        
        randnum = Math.min(-3, -6 + (timer - 4000) / 20000 * 3) + Math.random() * 6;
        for (let j = 0; j < randnum; j++)
        rains.push(new rain(-1800 + Math.random() * 3400, -1000, Math.sin(timer / 10000 - 1) * 10, 30 + Math.random() * 20));
    }

    if (timer > 10000) {
        ctx.font = "800 100px 'M PLUS Rounded 1c'";
        arrowpos += (800 - arrowpos) / 5;
        if (GetShownOrHidden([0, 1, 50, 57, 100, 113, 150, 169, 200, 225, 250, 281, 300, 337, 350, 393, 400, 449, 450, 500], timer - 10000)) {
            let ypos = -550 + Math.sin(timer / 1000 + 1.5) * 50;
            ctx.strokeText("Scroll for more informations", 0, ypos);
            ctx.strokeText("↓", -arrowpos, ypos);
            ctx.strokeText("↓", arrowpos, ypos);
        }
    }
    
    ctx.lineWidth = 2;
    ctx.beginPath();
    bubbles.forEach(x => x.draw());
    rains.forEach(x => x.draw());
    ctx.stroke();
    bubbles = bubbles.filter(x => x.y > 300);
    rains = rains.filter(x => x.y < 300);

    ctx.restore();
}

window.addEventListener("load", ()=>{
    let yearsold = document.getElementById("yearsold");
    let date = new Date();
    yearsold.innerHTML = (date.getFullYear() - 2003) - (date.getMonth() < 4 && date.getDate() < 5);
    if (!(date.getMonth() == 4 && date.getDate() == 5)) yearsold.style.animation = "none";

    scrolly = -window.pageYOffset;
    Main();
})