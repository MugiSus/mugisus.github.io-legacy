
let sliderypos = -800, 
    smoothedSliderYpos = -900,
    beforeypos = -800, 
    beforemousey = -800, 
    moveunit = 1,
    mousepressed = false,
    lastNoteTime = 0;

let easy_generateScore =(scoreName)=> {
    drewId = {};
    laneStates = {};
    for (let i = 0; i < 10; i++) laneStates[i] = new lane(-1125 + 250 * i, 700, 0, 1, i);
    notes = [];
    laneMoves = [];
    metaData = [];

    let notesTime = [];
    score[scoreName].match(/score:((.|\n)*)/)[1].split("\n").filter(x=>x).forEach(x=>{
        let arr = x.split(/ +/);

        switch (arr[0]) {
            case "1": case "2": case "3": case "4": {
                if (!arr[5] && !(arr[3] * (60 / bpm) * 1000 + 1000 > nowTime && (arr[3] - arr[4]) * (60 / bpm) * 1000 < nowTime)) return;
            } break;
            case "a": case "d": case "x": case "y": {
            } break;
            case "#defineLane": {
            } break;
            case "#deleteLane": {
            } break;
        }

        let reversed = arr[2].charAt(0) == "-";
        let isMultiNote = arr[0] <= 2 && arr[1].length != 1;

        if (["1", "2", "3", "4", "a", "d", "x", "y"].indexOf(arr[0]) > -1) {
            arr[2] = reversed ? pathes[arr[2].substr(1)].map(x=>x.map(x => x.map((x, y) => y >= 1 ? x * -1 + 200 : x))) : pathes[arr[2]];
            arr[3] *= 60 / bpm * 1000;
            arr[4] *= 60 / bpm * 1000;
        } else {
            arr[2] *= 60 / bpm * 1000;
        }

        if (arr[0] <= 2) {
            let index = notesTime.findIndex(x => x[0] <= arr[3]);
            if ((notesTime[index] || [])[0] == arr[3]) {
                isMultiNote = true;
                notes[notesTime[index][1]].isMultiNote = true;
            }
            else notesTime.splice(index, 0, [arr[3], notes.length]);
        }

        switch (arr[0]) {
            case "1": case "2": case "3": case "4": {
                arr[1].split("").forEach(x => notes.push(new note(arr[0], x, arr[2], arr[3], arr[4], arr[5] ? arr[5] + x : 0, reversed, isMultiNote)));
            } break;
            case "a": case "d": case "x": case "y": {
                arr[1].split("").forEach(x => laneMoves.push(new laneMove(arr[0], x, arr[2], arr[3], arr[4], arr[5] * 1, arr[6] * 1)));
            } break;
            case "#defineLane": {
                arr[1].split("").forEach(x => metaData.push(new defineLane(x, arr[2], arr[3], arr[4], arr[5], arr[6], arr[7])));
            } break;
            case "#deleteLane": {
                arr[1].split("").forEach(x => metaData.push(new deleteLane(x, arr[2])));
            } break;
        }
    });
    notes.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
    laneMoves.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
    metaData.sort((a, b) => a.time - b.time);

    judgeStatus = {
        score:0,
        maxCombo: 0,
        combo: 0,
        perfect_supereme: 0,
        perfect: 0,
        good: 0,
        far: 0,
        lost: 0
    };
}

let drawSlider =()=> {

    let showSuggestion = false;
    let yposPerBeat = 1600 / (lastNoteTime / (60 / bpm * 1000));

    if (mouseState.x < -canvas.width / 2 / ratio + 100 || mousepressed) {
        if (mouseState.left) {
            
            if (!mousepressed) {
                beforeypos = sliderypos;
                beforemousey = mouseState.y;
                mousepressed = true;
                if (Math.abs(mouseState.y - beforeypos) < 50) moveunit = 0;
                else moveunit = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 38, 64][Math.floor((Math.abs(mouseState.y - beforeypos) - 50) / 100)];
            }
            
            if (mouseState.right) {
                beforeypos = sliderypos;
                beforemousey = mouseState.y;
            }
            
            ctx.globalAlpha = 0.7;

            if (!moveunit) sliderypos = beforeypos + Math.round((mouseState.y - beforemousey) / yposPerBeat) * yposPerBeat;
            else sliderypos = beforeypos + 1 / moveunit * Math.floor((mouseState.y - beforemousey) / 50) * yposPerBeat;
        } else {
            showSuggestion = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64][Math.floor((Math.abs(mouseState.y - sliderypos) - 50) / 100)];

            ctx.globalAlpha = 1;
            mousepressed = false;
        }
    } else ctx.globalAlpha = 0.8;

    smoothedSliderYpos += (sliderypos - smoothedSliderYpos) / 5;
    nowTime = (smoothedSliderYpos + 800) / 1600 * lastNoteTime;
    
    ctx.save();
    ctx.translate(-canvas.width / 2 / ratio, smoothedSliderYpos);
    ctx.fillStyle = colorList.white;
    ctx.beginPath();
    ctx.arc(0, 0, 50, -Math.PI / 2, Math.PI / 2)
    ctx.closePath();
    ctx.fill();
    ctx.textAlign = "left";
    ctx.font = "300 50px Oswald";
    ctx.fillText(Math.round((sliderypos + 800) / yposPerBeat * 10000) / 10000 + (showSuggestion ? ` --- 1 / ${showSuggestion}` : ``), 100, 20);

    ctx.fillStyle = colorList.backGround;
    ctx.fill(new Path2D(mouseState.right ? "M 5,0 20,-15 35,0 M 5,0 20,15 35,0" : mouseState.left ? "M 5,-5 20,-20 35,-5 M 5,5 20,20 35,5" : "M 5,-10 20,-25 35,-10 M 5,10 20,25 35,10"));

    ctx.restore();
}

function edit(){
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio, canvas.height / ratio);
    drawSlider();

    easy_generateScore(new URLSearchParams(location.search).get("title"));

    drawInfos();
    judgeNotes();
    readMetaData();
    moveLanes();
    drawqwerty();
    drawNotes();
    deleteNotes();

    requestAnimationFrame(edit);
}

generateScore(new URLSearchParams(location.search).get("title"));
lastNoteTime = notes[notes.length - 1].endTime;

edit();