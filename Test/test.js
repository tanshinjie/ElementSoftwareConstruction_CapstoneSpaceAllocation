let margin = 0.9;

let widths = [100, 500, 1000];
let heights = [200, 400, 5000];



let packer, boxes;
//----------checking if the area function works properly--------//
for(let i = 0; i < widths.length; i++){
  if(Area(widths[i], heights[i])==(widths[i]*heights[i])){
    console.log(true);
  }
}

//-------checking if the regex function works properly---------//
let beforeRegex = ["2mx2mx2m", "3mx3mx3m", "7mx5mx6m"];
let afterRegex = [];
let correctAnswer = [[2,2,2],[3,3,3],[7,5,6]]

for(let i = 0; i < beforeRegex.length; i++){
if (beforeRegex[i] != undefined) {
  console.log(typeof beforeRegex[i]);
  d = beforeRegex[i].split("x");
  //console.log(d);
  for (let index = 0; index < d.length; index++) {
    // d[index] = parseInt(d[index].replace(/[^0-9\.]/g, ""), 10);
    //console.log(d[index].replace(/^[+-]?\d+(\.\d+)?$/g, ""));
    d[index] = parseFloat(d[index].replace(/^[+-]?\d+(\.\d+)?$/g, ""));
    //console.log(d[index]);
  }
  //console.log("this is what it looks like after cleaning",d);
  afterRegex.push(d);
}
}

console.log(afterRegex);
console.log(correctAnswer);

for(let i = 0; i < afterRegex.length; i++){

  console.log(typeof afterRegex[i])
  console.log(typeof correctAnswer[i])
  if(JSON.stringify(afterRegex[i]==JSON.stringify(correctAnswer[i]))){
    console.log("regex works properly")
  }
}

//-------checking if the intermediate functions in the arraymaker work properly------------//

//if there is multiple tags in the input excel. Then the functionCheckerArray 
let functionCheckerArray = []
functionCheckerArray.push(new Rect(undefined, undefined, 8, 9, 2, 1))
functionCheckerArray.push(new Rect(undefined, undefined, 4, 7, 1, 3))
functionCheckerArray.push(new Rect(undefined, undefined, 3, 8, 3, 55))
let correctFunctionCheckerArray = [[],[],[]]
let correctMax = 3;
let correctFillingUp = [[new Rect(undefined, undefined, 4, 7, 1, 3)],[new Rect(undefined, undefined, 8, 9, 2, 1)],[new Rect(undefined, undefined, 3, 8, 3, 55)]]

function intializeEmptyListWithout2x2(list){
  let List = [];
  let maximum = 0;
  list.forEach((element) => {
    if (element.tag >= maximum) {
      maximum = element.tag;
    }
  });
  for (let i = 0; i < maximum; i++) {
    List[i] = [];
  }
  return [List,maximum];
}

let values = intializeEmptyListWithout2x2(functionCheckerArray);

if(JSON.stringify(values[0]) == JSON.stringify(correctFunctionCheckerArray)){
  console.log("the number of empty arrays made for the allocation of tags is correct")
}

if(values[1]== correctMax){
  console.log("found the largest tag number in the excel file correctly")
}

function fillUpBigList(List,list){
  for (let i = 0; i < list.length; i++) {
    List[list[i].tag - 1].push(list[i]);
  }
  return List;
}

let afterFillUpBigList = fillUpBigList(values[0],functionCheckerArray)
if(JSON.stringify(afterFillUpBigList) == JSON.stringify(correctFillingUp)){
  console.log("the array was filled up correctly according to tag");
}














//-----------------------------------------------------------------------------------------//
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
