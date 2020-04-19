let margin = 0.9;

widths = [100, 500, 1000];
heights = [200, 400, 5000];

beforeRegex = [, 3x3, 7x5];
let afterRegex = [];
correctAnswer = [[2,2],[3,3],[7.5]]

let packer, boxes;
//----------checking if the area function works properly--------//
for(let i = 0; i < widths.length; i++){
  if(Area(widths[i], heights[i])==(widths[i]*heights[i])){
    console.log(true);
  }
}

//-------checking if the regex function wirks properly---------//
for(let i = 0; i < beforeRegex.length; i++){
if (beforeRegex[i] != undefined) {
  d = beforeRegex[i].split("x");
  for (let index = 0; index < d.length; index++) {
    // d[index] = parseInt(d[index].replace(/[^0-9\.]/g, ""), 10);
    d[index] = parseFloat(d[index].replace(/^[+-]?\d+(\.\d+)?$/g, ""));
  }
  console.log("this is what it looks like after cleaning",d);
  afterRegex.push(d);
}
}




for (let index = 0; index < widths.length; index++) {
  let test = [];
  packer = new BinPack(widths[index], heights[index]);
  fitW = widths[index] * margin;
  fitH = heights[index];
  notFitW = fitW + 1;
  notFitH = fitH + 1;
  sureFitW = fitW - 1;
  sureFitH = fitH - 1;
  test.push(new Rect(undefined, undefined, sureFitW, sureFitH, 1, 1));
  test.push(new Rect(undefined, undefined, notFitW, notFitH, 1, 1));
  test.push(new Rect(undefined, undefined, fitW, fitH, 1, 1));
  packer.addAll(test);
  if (
    packer.positioned[0].width == sureFitW &&
    packer.positioned[0].height == sureFitH
  ) {
    console.log(true);
  } else {
    console.log(false);
  }
}
for (let index = 0; index < widths.length; index++) {
  let test = [];
  packer = new BinPack(widths[index], heights[index]);
  fitW = widths[index];
  fitH = heights[index] * margin;
  notFitW = fitW + 1;
  notFitH = fitH + 1;
  sureFitW = fitW - 1;
  sureFitH = fitH - 1;
  test.push(new Rect(undefined, undefined, sureFitW, sureFitH, 1, 1));
  test.push(new Rect(undefined, undefined, notFitW, notFitH, 1, 1));
  test.push(new Rect(undefined, undefined, fitW, fitH, 1, 1));
  packer.addAll(test);
  if (
    packer.positioned[0].width == sureFitW &&
    packer.positioned[0].height == sureFitH
  ) {
    console.log(true);
  } else {
    console.log(false);
  }
}
for (let index = 0; index < widths.length; index++) {
  let test = [];
  packer = new BinPack(widths[index], heights[index]);
  fitW = widths[index];
  fitH = heights[index] * margin;
  notFitW = fitW + 1;
  notFitH = fitH + 1;
  sureFitW = fitW - 1;
  sureFitH = fitH - 1;
  test.push(new Rect(undefined, undefined, notFitW, notFitH, 1, 1));
  test.push(new Rect(undefined, undefined, sureFitW, sureFitH, 1, 1));
  test.push(new Rect(undefined, undefined, fitW, fitH, 1, 1));
  packer.addAll(test);
  if (
    packer.positioned[0].width == sureFitW &&
    packer.positioned[0].height == sureFitH
  ) {
    console.log(true);
  } else {
    console.log(false);
  }
}
for (let index = 0; index < widths.length; index++) {
  let test = [];
  packer = new BinPack(widths[index], heights[index]);
  fitW = widths[index];
  fitH = heights[index] * margin;
  notFitW = fitW + 1;
  notFitH = fitH + 1;
  sureFitW = fitW - 1;
  sureFitH = fitH - 1;
  test.push(new Rect(undefined, undefined, fitW, fitH, 1, 1));
  test.push(new Rect(undefined, undefined, notFitW, notFitH, 1, 1));
  test.push(new Rect(undefined, undefined, sureFitW, sureFitH, 1, 1));
  packer.addAll(test);
  if (
    packer.positioned[0].width == fitW &&
    packer.positioned[0].height == fitH
  ) {
    console.log(true);
  } else {
    console.log(false);
  }
}

packer = new BinPack(0, 0);
boxes = [new Rect(undefined, undefined, 10, 10, 1, 1)];
packer.addAll(boxes);
if (packer.positioned.length == 0) {
  console.log(true);
} else {
  console.log(false);
}

packer = new BinPack(20, 20);
boxes = [new Rect(undefined, undefined, 10, 10, 1, 1)];
packer.addAll(boxes);
if (packer.positioned[0].x == 0 && packer.positioned[0].y == 0) {
  console.log(true);
} else {
  console.log(false);
}

packer = new BinPack(200, 200);
boxes = [
  new Rect(undefined, undefined, 10, 10, 1, 1),
  new Rect(undefined, undefined, 10, 10, 1, 1),
];
packer.addAll(boxes);
if (packer.positioned[1].x == 0 && packer.positioned[1].y == 10) {
  console.log(true);
} else {
  console.log(false);
}

packer = new BinPack(200, 15);
boxes = [
  new Rect(undefined, undefined, 10, 10, 1, 1),
  new Rect(undefined, undefined, 10, 10, 1, 1),
];
packer.addAll(boxes);
if (packer.positioned[1].x == 10 && packer.positioned[1].y == 0) {
  console.log(true);
} else {
  console.log(false);
}

//---------BRANCH COVERAGE---------------//

packer = new BinPack(200, 15);
boxes = [
  new Rect(undefined, undefined, 10, 10, 1, 1),
  new Rect(undefined, undefined, 10, 10, 1, 1),
];
values = packer.addAll(boxes);
if (values[2] == "else") {
  console.log(true);
} else {
  console.log(false);
}

packer = new BinPack(200, 15);
boxes = [
  new Rect(undefined, undefined, 10, 10, 1, 1),
  new Rect(undefined, undefined, 10, 10, 2, 2),
];
values = packer.addAll(boxes);
if (values[2] == "if") {
  console.log(true);
} else {
  console.log(false);
}

packer = new BinPack(200, 15);
boxes = [];
packer.addAll(boxes);
console.log(packer.positioned);
if (packer.positioned.length == 0) {
  console.log(true);
} else {
  console.log(false);
}
