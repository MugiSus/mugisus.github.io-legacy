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
    .111,
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

const table = class {
    constructor(name, x, y, required){
        this.name = name;
        this.x = x;
        this.y = y;
        this.required = required;
    }
}

const stageData = {
    "tg001ohyagi" : {
        checkTable : [new table("")]
    }
}