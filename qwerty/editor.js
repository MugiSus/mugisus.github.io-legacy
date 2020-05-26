
let sliderypos = -800, beforeypos = -800, beforemousey = -800, moveunit = 1, mousepressed = false;

let drawSlider =()=> {

    ctx.save();
    ctx.translate(-canvas.width / 2 / ratio, sliderypos);

    if (mouseState.x < -canvas.width / 2 / ratio + 100 || mousepressed) {
        let yposPerBeat = (1600 / (notes[notes.length - 1].endTime / (60 / bpm * 1000)));
        if (mouseState.left) {
            if (!mousepressed) {
                beforeypos = sliderypos;
                beforemousey = mouseState.y;
                mousepressed = true;
                if (Math.abs(mouseState.y - beforeypos) < 50) moveunit = 0;
                else moveunit = [1, 1 / 2, 1 / 3, 1 / 4, 1 / 6, 1 / 8, 1 / 12, 1 / 16, 1 / 24, 1 / 32][Math.floor((Math.abs(mouseState.y - beforeypos) - 50) / 100)];
            }
            if (mouseState.right) {
                beforeypos = sliderypos;
                beforemousey = mouseState.y;
            }
            ctx.globalAlpha = 0.7;
            if (!moveunit) sliderypos = beforeypos + Math.round((mouseState.y - beforemousey) / yposPerBeat) * yposPerBeat;
            else sliderypos = beforeypos + moveunit * Math.floor((mouseState.y - beforemousey) / 50) * yposPerBeat;
        } else {
            ctx.globalAlpha = 1;
            mousepressed = false;
        }
    } else ctx.globalAlpha = 0.8;

    ctx.fillStyle = colorList.white;
    ctx.beginPath();
    ctx.arc(0, 0, 50, -Math.PI / 2, Math.PI / 2)
    ctx.closePath();
    ctx.fill();
    ctx.textAlign = "left";
    ctx.font = "300 50px Oswald";
    ctx.fillText(Math.round(nowTime / (60 / bpm * 1000) * 1000) / 1000, 100, 20);

    ctx.fillStyle = colorList.backGround;
    ctx.fill(new Path2D(mouseState.right ? "M 5,0 20,-15 35,0 M 5,0 20,15 35,0" : mouseState.left ? "M 5,-5 20,-20 35,-5 M 5,5 20,20 35,5" : "M 5,-10 20,-25 35,-10 M 5,10 20,25 35,10"));

    ctx.restore();

    nowTime = (sliderypos + 800) / 1600 * notes[notes.length - 1].endTime;

}

function edit(){
    generateScore(new URLSearchParams(location.search).get("title"));

    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    drawSlider();

    judgeNotes();
    readMetaData();
    moveLanes();
    drawqwerty();
    drawNotes();
    deleteNotes();
    
    requestAnimationFrame(edit);
}

edit();