const table = class {
    constructor(name, x, y, required){
        this.name = name;
        this.x = x;
        this.y = y;
        this.required = required;
    }
}

const stageList = {
    "tg001ohyagi" : {
        girl: "tg001ohyagi.png",
        girlx: 0,
        girly: 0,
        checkTable: [
            new table("tg001green", 0, 0, -1),
            new table("tg001yellow", 1, 0, -1),
            new table("tg001red", 2, 0, -1),
            new table("tg001arrow", 0, 1, 0),
        ]
    },
    "tg009chuobashi" : {
        girl: "tg009chuobashi.png",
        girlx: 0,
        girly: 0,
        checkTable: [
            new table("tg009yu-arrow", 0, 0, -1),
            new table("tg009yellow", 1, 0, -1),
            new table("tg009red", 2, 0, -1),
            new table("tg009yl-arrow", 0, 1, 0),
            new table("tg009gl-arrow", 1, 1, 1),
            new table("tg009gr-arrow", 2, 1, 2),
        ]
    }
}

let stageName = "tg001ohyagi";
let stageData = stageList[stageName];
let checkTable = stageData.checkTable;

let markerPos = {
    1 : `
    1
    `,
    4 : `
    111
    `,
    9 : `
    .1.
    111
    .1.
    `,
    16 : `
    111
    111
    111
    `,
    25 : `
    .111.
    11111
    .111.
    `,
    36 : `
    ..1..
    .111.
    11111
    .111.
    ..1..
    `,
    49 : `
    ..1..
    11111
    11111
    11111
    ..1..
    `,
    64 : `
    .111.
    11111
    11111
    11111
    .111.
    `,
    81 : `
    11111
    11111
    11111
    11111
    11111
    `,
    100 : `
    .11111.
    .11111.
    1111111
    .11111.
    .11111.
    `,
    121 : `
    ...1...
    .11111.
    .11111.
    1111111
    .11111.
    .11111.
    ...1...
    `,
}

Object.keys(markerPos).forEach(x => {
    let posList = [];
    markerPos[x] = markerPos[x].split("\n").filter(x=>x).forEach((x,i,k)=>{
        x.split("").filter(x=>x=="."||x=="1").forEach((x,j,l)=>{
            if (x == "1") posList.push([j - Math.floor((l.length - 1) / 2), i - Math.floor((k.length - 1) / 2)]);
        })
    })
    markerPos[x] = posList;
});


/*
let checkTable = [
    new table("tg009yu-arrow", 0, 0, -1),
    new table("tg009yellow", 1, 0, -1),
    new table("tg009red", 2, 0, -1),
    new table("tg009yl-arrow", 0, 1, 0),
    new table("tg009gl-arrow", 1, 1, 1),
    new table("tg009gr-arrow", 2, 1, 2),
];
*/
/*
let checkTable = [
    new table("tg001green", 0, 0, -1),
    new table("tg001yellow", 1, 0, -1),
    new table("tg001red", 2, 0, -1),
    new table("tg001arrow", 0, 1, 0),
];

panels.push(new panel("tg001arrow", 3, 3));
panels.push(new panel("tg001yellow", 4, 5));
panels.push(new panel("tg001red", 5, 8));
panels.push(new panel("tg001green", 3, 4));

panels.push(new panel("tg001green", 1, 3));
panels.push(new panel("tg001yellow", 2, 0));
panels.push(new panel("tg001red", 3, 0));
panels.push(new panel("tg001arrow", 1, 4));

panels.push(new panel("tg001green", 0, 6));
panels.push(new panel("tg001yellow", 1, 6));
panels.push(new panel("tg001red", 2, 6));
panels.push(new panel("tg001arrow", 0, 7));

panels.push(new panel("tg001green", 7, 2));
panels.push(new panel("tg001yellow", 8, 4));
panels.push(new panel("tg001red", 9, 6));
panels.push(new panel("tg001arrow", 7, 7));

panels.push(new panel("tg001yellow", 8, 11));
panels.push(new panel("tg001red", 9, 8));

panels.push(new panel("tg001green", 7, 0));

panels.push(new panel("tg001red", 2, 13));
panels.push(new panel("tg001yellow", 1, 1));
panels.push(new panel("tg001green", 0, 2));
*/
