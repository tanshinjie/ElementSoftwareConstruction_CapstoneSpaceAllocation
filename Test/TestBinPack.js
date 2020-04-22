let margin = 0.9;

let widths = [100, 500, 1000];
let heights = [200, 400, 5000];
console.log(" #################### Unit Testing #################### ");
console.log("--- Testing BinPack function ---");
console.log("Test 1: Checking sureFitW 1");
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
console.log("Test 2: Checking sureFitW 2");
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
console.log("Test 3: Checking FitW 2");
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
console.log("Test 4: Checking FitW 2");
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
console.log("Test 5: Basic function test 1");
packer = new BinPack(0, 0);
boxes = [new Rect(undefined, undefined, 10, 10, 1, 1)];
packer.addAll(boxes);
if (packer.positioned.length == 0) {
  console.log(true);
} else {
  console.log(false);
}

console.log("Test 6: Basic function test 2");
packer = new BinPack(20, 20);
boxes = [new Rect(undefined, undefined, 10, 10, 1, 1)];
packer.addAll(boxes);
if (packer.positioned[0].x == 0 && packer.positioned[0].y == 0) {
  console.log(true);
} else {
  console.log(false);
}

console.log("Test 7: Basic function test 3");
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

console.log("Test 8: Basic function test 4");
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

// //---------BRANCH COVERAGE---------------//
// console.log(" #################### Branch Coverage #################### ");
// packer = new BinPack(200, 15);
// boxes = [
//   new Rect(undefined, undefined, 10, 10, 1, 1),
//   new Rect(undefined, undefined, 10, 10, 1, 1),
// ];
// values = packer.addAll(boxes);
// if (values[2] == "else") {
//   console.log(true);
// } else {
//   console.log(false);
// }

// packer = new BinPack(200, 15);
// boxes = [
//   new Rect(undefined, undefined, 10, 10, 1, 1),
//   new Rect(undefined, undefined, 10, 10, 2, 2),
// ];
// values = packer.addAll(boxes);
// if (values[2] == "if") {
//   console.log(true);
// } else {
//   console.log(false);
// }

// packer = new BinPack(200, 15);
// boxes = [];
// packer.addAll(boxes);
// console.log(packer.positioned);
// if (packer.positioned.length == 0) {
//   console.log(true);
// } else {
//   console.log(false);
// }
