//______________________________________________________________________________
// Rect class
function Rect(x, y, width, height, tag, projID) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.tag = tag;
  this.projID = projID;
}

Rect.prototype.contains = function (r) {
  // Does this rectangle contain the specified rectangle?
  return (
    this.x <= r.x &&
    this.y <= r.y &&
    this.x + this.width >= r.x + r.width &&
    this.y + this.height >= r.y + r.height
  );
};

Rect.prototype.disjointFrom = function (r) {
  // Is this rectangle disjoint from the specified rectangle?
  return (
    this.x + this.width <= r.x ||
    this.y + this.height <= r.y ||
    r.x + r.width <= this.x ||
    r.y + r.height <= this.y
  );
};

Rect.prototype.intersects = function (r) {
  // Does this rectangle intersect the specified rectangle?
  return !this.disjointFrom(r);
};

Rect.prototype.copy = function () {
  // Create a copy of this rectangle.
  return new Rect(this.x, this.y, this.width, this.height);
};

//______________________________________________________________________________
// BinPacker class

// Uses MAXRECTS-BSSF-BNF bin packer algorithm from
// https://github.com/juj/RectangleBinPack
//
// MAXRECTS-BSSF-BNF stands for "Maximal Rectangles - Best Short Side Fit". It
// positions the rectangle against the short side of the free rectangle into
// which it fits most snugly.

function BinPacker(width, height) {
  this.width = width;
  this.height = height;

  // TODO: Allow for flexible width or height. If a rectangle doesn't fit into
  //       the bin extend the width or height to accommodate it.

  // Array of rectangles representing the free space in the bin
  this.freeRectangles = [new Rect(0, 0, width, height)];

  // Array of rectangles positioned in the bin
  this.positionedRectangles = [];

  // Array of rectangles that couldn't fit in the bin
  this.unpositionedRectangles = [];
}

BinPacker.prototype.insert = function (width, height) {
  // Insert a rectangle into the bin.
  //
  // If the rectangle was successfully positioned, add it to the array of
  // positioned rectangles and return an object with this information and the
  // rectangle object.
  //
  // If the rectangle couldn't be positioned in the bin, add it to the array of
  // unpositioned rectangles and return an object with this information and the
  // rectangle object (which as undefined x- and y-properties.

  // Find where to put the rectangle. Searches the array of free rectangles for
  // an open spot and returns one when it's found.
  var r = BinPacker.findPosition(width, height, this.freeRectangles);

  // Unpositioned rectangle (it has no x-property if it's unpositioned)
  if (r.x == undefined) {
    this.unpositionedRectangles.push(r);
    return { positioned: false, rectangle: r };
  }

  // Split the free rectangles based on where the new rectangle is positioned
  var n = this.freeRectangles.length;
  for (var i = 0; i < n; i++) {
    // splitRectangle() returns an array of sub-rectangles if the rectangle
    // was split (which is truthy) and false otherwise
    if (
      (new_rectangles = BinPacker.splitRectangle(this.freeRectangles[i], r))
    ) {
      // remove the free rectangle that was split
      this.freeRectangles.splice(i, 1);

      // append new free rectangles formed by the split															// split
      this.freeRectangles = this.freeRectangles.concat(new_rectangles);

      --i;
      --n;
    }
  }
  console.log("binpack");

  BinPacker.pruneRectangles(this.freeRectangles);

  this.positionedRectangles.push(r);

  return { positioned: true, rectangle: r };
};

BinPacker.findPosition = function (width, height, F) {
  // Decide where to position a rectangle (with side lengths specified by width
  // and height) within the bin. The bin's free space is defined in the array
  // of free rectangles, F.

  var bestRectangle = new Rect(undefined, undefined, width, height);

  var bestShortSideFit = Number.MAX_VALUE,
    bestLongSideFit = Number.MAX_VALUE;

  // Find the free rectangle into which this rectangle fits inside most snugly
  // (i.e., the one with the smallest amount of space leftover after positioning
  // the rectangle inside of it)
  for (var i = 0; i < F.length; i++) {
    var f = F[i]; // the current free rectangle

    // Does the rectangle we are positioning fit inside the free rectangle?
    if (f.width >= width && f.height >= height) {
      var leftoverHorizontal = Math.abs(f.width - width),
        leftoverVertical = Math.abs(f.height - height);

      var shortSideFit = Math.min(leftoverHorizontal, leftoverVertical),
        longSideFit = Math.max(leftoverHorizontal, leftoverVertical);

      // Does this free rectangle have the smallest amount of space leftover
      // after positioning?
      if (
        shortSideFit < bestShortSideFit ||
        (shortSideFit == bestShortSideFit && longSideFit < bestLongSideFit)
      ) {
        // Position rectangle in the bottom-left corner of the free rectangle
        // (or top-left if the y-axis is inverted like in browsers)
        bestRectangle.x = f.x;
        bestRectangle.y = f.y;
        bestShortSideFit = shortSideFit;
        bestLongSideFit = longSideFit;
      }
    }
  }

  return bestRectangle;
};

BinPacker.splitRectangle = function (f, r) {
  // Splits the rectangle f into at most four sub-rectangles that are formed by
  // taking the geometric difference of f from r and identifying the largest
  // rectangles that can be formed from the resulting polygon. Returns these
  // sub-rectangles if the f was split and false otherwise.

  // If they are disjoint then no splitting can be done, return false
  if (r.disjointFrom(f)) return false;

  var new_rectangles = [];

  // Does f contain r in terms of the x-axis?
  if (r.x < f.x + f.width && f.x < r.x + r.width) {
    // QUESTION: Does this make an assumption about how r is positioned relative
    //           to f? Couldn't it be that part of r could be outside of f in
    //           this first if-statement? It looks like this assumes r will be
    //           placed along one of the edges (which, in fact, is what this
    //           algorithm does).

    // TODO: Look into all of this in more depth. I don't fully understand why
    //       these conditionals are the way they are.

    // New rectangle is above r
    if (f.y < r.y && r.y < f.y + f.height) {
      var new_rectangle = f.copy();
      new_rectangle.height = r.y - new_rectangle.y;
      new_rectangles.push(new_rectangle);
    }

    // New rectangle is below r
    if (r.y + r.height < f.y + f.height) {
      var new_rectangle = f.copy();
      new_rectangle.y = r.y + r.height;
      new_rectangle.height = f.y + f.height - (r.y + r.height);
      new_rectangles.push(new_rectangle);
    }
  }

  // Does f contain r in terms of the y-axis?
  if (r.y < f.y + f.height && f.y < r.y + r.height) {
    // New rectangle is to the left of r
    if (f.x < r.x && r.x < f.x + f.width) {
      var new_rectangle = f.copy();
      new_rectangle.width = r.x - new_rectangle.x;
      new_rectangles.push(new_rectangle);
    }

    // New rectangle is to the right of r
    if (r.x + r.width < f.x + f.width) {
      var new_rectangle = f.copy();
      new_rectangle.x = r.x + r.width;
      new_rectangle.width = f.x + f.width - (r.x + r.width);
      new_rectangles.push(new_rectangle);
    }
  }

  return new_rectangles;
};

BinPacker.pruneRectangles = function (F) {
  // Go through the array of rectangles, F, and remove any that are
  // completely contained within another rectangle in F

  for (var i = 0; i < F.length; i++) {
    for (var j = i + 1; j < F.length; j++) {
      if (F[j].contains(F[i])) {
        F.splice(i, 1);
        --i;
        break;
      }
      if (F[i].contains(F[j])) {
        F.splice(j, 1);
        --j;
      }
    }
  }
};

function BinPack(binWidth, binHeight) {
  var binWidth = binWidth,
    binHeight = binHeight;

  var rectWidth = function (d) {
      return d.width;
    },
    rectHeight = function (d) {
      return d.height;
    };

  var sort = false;

  var binPacker = new BinPacker(binWidth, binHeight);
  // console.log(binPacker);

  var pack = {};

  pack.add = function (d) {
    var o = binPacker.insert(rectWidth(d), rectHeight(d));
    o.rectangle.datum = d;
    return pack;
  };

  //let readyToPack = ArrayMaker(rlist);
  // pack.addAll = function(array) {
  //   // readyToPack = ArrayMaker(array, binWidth, binHeight);
  //   readyToPack = array;
  //   if (sort) readyToPack.sort(sort);
  //   readyToPack.forEach(function(d, i) {
  //     var o = binPacker.insert(rectWidth(d), rectHeight(d));
  //     o.rectangle.datum = d;
  //   });

  //   return pack;
  // };
  pack.addAll = function (array) {
    let values = ArrayMaker(array, binWidth, binHeight);
    let readyToPack = values[0];
    let updatedList = values[1];
    for (let i = 0; i < updatedList.length; i++) {
      if (updatedList[i].projID == 1) {
        console.log("found the fella");
      }
      if (updatedList[i].projID == 3) {
        console.log("found his bro");
      }
    }
    console.log("I AM FINDING 1:", updatedList);
    let z = values[2];

    // for(let i = 0; i < bins.length; i++){
    //   for(let j=0; j < readyToPack.length; j++){

    //   }
    // }
    if (sort) readyToPack.sort(sort);
    readyToPack.forEach(function (d, i) {
      var o = binPacker.insert(rectWidth(d), rectHeight(d));
      o.rectangle.datum = d;
    });

    return [pack, updatedList, z];
  };

  pack.binWidth = function (_) {
    if (!arguments.length) return binWidth;
    binWidth = _;
    binPacker = new BinPacker(binWidth, binHeight);
    return pack;
  };

  pack.binHeight = function (_) {
    if (!arguments.length) return binHeight;
    binHeight = _;
    binPacker = new BinPacker(binWidth, binHeight);
    return pack;
  };

  pack.rectWidth = function (_) {
    return arguments.length ? ((rectWidth = _), pack) : rectWidth;
  };

  pack.rectHeight = function (_) {
    return arguments.length ? ((rectHeight = _), pack) : rectHeight;
  };

  pack.sort = function (_) {
    return arguments.length ? ((sort = _), pack) : sort;
  };

  Object.defineProperty(pack, "positioned", {
    get: function () {
      return binPacker.positionedRectangles;
    },
  });

  Object.defineProperty(pack, "unpositioned", {
    get: function () {
      return binPacker.unpositionedRectangles;
    },
  });

  return pack;
}

function Area(width, height) {
  let area = width * height;
  return area;
}
///////////////////////////////////////////////// working ArrayMaker, dun remove
// function ArrayMaker(rlist, width, height) {
//   this.z = 0;
//   // let currentTag;
//   // let currentList;
//   let bigList = [];
//   let toBePacked = [];
//   let tempArea = 0;
//   let splicedBigList = [];

//   let max = 0;
//   let totalLength = rlist.length;
//   let counter = 0;
//   rlist.forEach((element) => {
//     if (element.tag >= max) {
//       max = element.tag;
//     }
//   });
//   //console.log(max);

//   for (let i = 0; i < max; i++) {
//     bigList[i] = [];
//     splicedBigList[i] = [];
//   }

//   for (let i = 0; i < rlist.length; i++) {
//     bigList[rlist[i].tag - 1].push(rlist[i]);
//     splicedBigList[rlist[i].tag - 1].push(rlist[i]);
//   }

//   // for(let i=0; i<max; i++){
//   //   for(let j=0; i < rlist[j].length; j++){
//   //     if((tempArea += bigList[i][j]) < BinArea(20, 20)){
//   //       tempArea += bigList[i][j];
//   //       toBePacked.push(bigList[i][j])
//   //     }
//   //   }
//   // }
//   // for(let i = 0; i < max; i++){
//   let i = 0;
//   let j = -1;
//   let z;

//   while (tempArea <= Area(width, height) * 0.9) {
//     if (counter == totalLength) {
//       return [toBePacked, rlist, z];
//     }
//     if (bigList.length != 1) {
//       z = "if";
//       if (i == max - 1) {
//         i = 0;
//       }
//       if (i == 0) {
//         j++;
//       }
//       if (j < bigList[i].length) {
//         if (
//           tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
//           Area(width, height) * 0.9
//         ) {
//           toBePacked.push(bigList[i][j]);
//           tempArea += Area(bigList[i][j].width, bigList[i][j].height);
//           for (let z = 0; z < rlist.length; z++) {
//             if (rlist[z] == bigList[i][j]) {
//               rlist.splice(z, 1);
//             }
//           }
//         }
//       }
//       i++;
//       counter++;
//     } else {
//       // if (i == max - 1) {
//       //   i = 0;
//       // }
//       z = "else";
//       if (i == 0) {
//         j++;
//       }
//       // console.log("j", j);
//       // console.log(bigList[i][j]);

//       if (j < bigList[i].length) {
//         if (
//           tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
//           Area(width, height) * 0.9
//         ) {
//           toBePacked.push(bigList[i][j]);

//           tempArea += Area(bigList[i][j].width, bigList[i][j].height);
//           for (let z = 0; z < rlist.length; z++) {
//             if (rlist[z] == bigList[i][j]) {
//               rlist.splice(z, 1);
//             }
//           }
//         }
//       }
//       // i++;
//       counter++;
//     }
//   }
//   // console.log(rlist);
//   //console.log("tobepacked", toBePacked);

//   //return [toBePacked, rlist];
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function ArrayMaker(rlist, width, height) {
//   let currentTag;
//   let currentList;
//   let bigList = [];
//   let toBePacked = [];
//   let tempArea = 0;

//   let max = 0;
//   rlist.forEach((element) => {
//     if (element.tag >= max) {
//       max = element.tag;
//     }
//   });
//   //console.log(max);

//   for (let i = 0; i < max; i++) {
//     bigList[i] = [];
//   }

//   for (let i = 0; i < rlist.length; i++) {
//     bigList[rlist[i].tag - 1].push(rlist[i]);
//   }

//   // for(let i=0; i<max; i++){
//   //   for(let j=0; i < rlist[j].length; j++){
//   //     if((tempArea += bigList[i][j]) < BinArea(20, 20)){
//   //       tempArea += bigList[i][j];
//   //       toBePacked.push(bigList[i][j])
//   //     }
//   //   }
//   // }
//   // for(let i = 0; i < max; i++){
//   let i = 0;
//   let j = -1;

//   while (tempArea < Area(width, height) * 0.8) {
//     //i = i%max;
//     if (i == max - 1) {
//       i = 0;
//     }
//     if (i == 0) {
//       j++;
//     }
//     console.log(bigList[i]);
//     if (j < bigList[i].length) {
//       if (
//         tempArea + Area(bigList[i][j].width, bigList[i][j].height) <
//         Area(width, height)
//       ) {
//         toBePacked.push(bigList[i][j]);
//         tempArea += Area(bigList[i][j].width, bigList[i][j].height);
//       }
//     }
//     i++;
//   }
//   // }
//   //var packer = new BinPack();
//   console.log(toBePacked);
//   //console.log(packer.positioned);
//   return toBePacked;
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////// tharun
// function ArrayMaker(rlist, width, height) {
//   this.z = 0;
//   // let currentTag;
//   // let currentList;
//   let bigList = [];
//   let toBePacked = [];
//   let tempArea = 0;
//   let splicedBigList = [];
//   let twoTwoList = [];
//   let smallerList = [];
//   let y = 0;
//   let copyList = rlist;
//   let max = 0;
//   let totalLength = rlist.length;
//   let counter = 0;

//   rlist.forEach((element) => {
//     if (element.tag >= max) {
//       max = element.tag;
//     }
//   });
//   //console.log(max);
//   //

//   for (let i = 0; i < max + 1; i++) {
//     bigList[i] = [];
//   }
//   for (let i = 0; i < max; i++) {
//     smallerList[i] = [];
//   }

//   for (let i = 0; i < rlist.length; i++) {
//     if (rlist[i].width == 2 && rlist[i].height == 2) {
//       twoTwoList.push(rlist[i]);
//     }
//   }

//   // for (let i = 0; i < max; i++) {
//   //   if(smallerList[i].length != 0){
//   //       y = 1;
//   //   }
//   // }

//   if (twoTwoList.length == 0) {
//     for (let i = 0; i < rlist.length; i++) {
//       //splicedBigLiist[rlist[i].tag - 1].push(rlist[i]);
//       bigList[rlist[i].tag - 1].push(rlist[i]);
//     }
//   } else {
//     for (let i = 0; i < twoTwoList.length; i++) {
//       smallerList[rlist[i].tag - 1].push(rlist[i]);
//     }
//     for (let i = 0; i < rlist.length; i++) {
//       for (let j = 0; j < twoTwoList.length; j++)
//         if (twoTwoList[j] == copyList[i]) {
//           copyList.splice(i, 1);
//         }
//     }
//     // console.log(copyList[0].tag);
//     console.log(bigList);

//     bigList[0] = smallerList;
//     for (let i = 0; i < copyList.length; i++) {
//       bigList[copyList[i].tag].push(copyList[i]);
//     }
//   }

//   // for(let i=0; i<max; i++){
//   //   for(let j=0; i < rlist[j].length; j++){
//   //     if((tempArea += bigList[i][j]) < BinArea(20, 20)){
//   //       tempArea += bigList[i][j];
//   //       toBePacked.push(bigList[i][j])
//   //     }
//   //   }
//   // }
//   // for(let i = 0; i < max; i++){
//   // let i = 0;
//   // let j = -1;
//   // let z;

//   // while (tempArea <= Area(width, height) * 0.9) {
//   //   if (counter == totalLength) {
//   //     return [toBePacked, rlist, z];
//   //   }
//   //   if (bigList.length != 1) {
//   //     z = "if";
//   //     if (i == max - 1) {
//   //       i = 0;
//   //     }
//   //     if (i == 0) {
//   //       j++;
//   //     }
//   //     if (j < bigList[i].length) {
//   //       if (
//   //         tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
//   //         Area(width, height) * 0.9
//   //       ) {
//   //         toBePacked.push(bigList[i][j]);
//   //         tempArea += Area(bigList[i][j].width, bigList[i][j].height);
//   //         for (let z = 0; z < rlist.length; z++) {
//   //           if (rlist[z] == bigList[i][j]) {
//   //             rlist.splice(z, 1);
//   //           }
//   //         }
//   //       }
//   //     }
//   //     i++;
//   //     counter++;
//   //   } else {
//   //     // if (i == max - 1) {
//   //     //   i = 0;
//   //     // }
//   //     z = "else";
//   //     if (i == 0) {
//   //       j++;
//   //     }
//   //     // console.log("j", j);
//   //     // console.log(bigList[i][j]);

//   //     if (j < bigList[i].length) {
//   //       if (
//   //         tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
//   //         Area(width, height) * 0.9
//   //       ) {
//   //         toBePacked.push(bigList[i][j]);

//   //         tempArea += Area(bigList[i][j].width, bigList[i][j].height);
//   //         for (let z = 0; z < rlist.length; z++) {
//   //           if (rlist[z] == bigList[i][j]) {
//   //             rlist.splice(z, 1);
//   //           }
//   //         }
//   //       }
//   //     }
//   //     // i++;
//   //     counter++;
//   //   }
//   // }

//   let i = 0;
//   let j = -1;
//   let z;
//   let i2 = 1;
//   let j2 = -1;
//   let z2;

//   while (tempArea <= Area(width, height) * 0.9) {
//     if (counter == totalLength) {
//       return [toBePacked, rlist, z];
//     }
//     //if (bigList.length != 1) {
//     //z = "if";
//     for (let x = 0; x < twoTwoList.length; x++) {
//       if (i == max - 1) {
//         i = 0;
//       }
//       if (i == 0) {
//         j++;
//       }
//       if (j < bigList[0][i].length) {
//         if (tempArea + 4 <= Area(width, height) * 0.9) {
//           toBePacked.push(bigList[0][i][j]);
//           tempArea += Area(bigList[0][i][j].width, bigList[0][i][j].height);
//           for (let z = 0; z < rlist.length; z++) {
//             if (rlist[z] == bigList[i][j]) {
//               rlist.splice(z, 1);
//             }
//           }
//         }
//       }
//       i++;
//       counter++;
//     }

//     if (i2 == max) {
//       i2 = 1;
//     }
//     if (i2 == 1) {
//       j2++;
//     }
//     if (j2 < bigList[i2].length) {
//       if (
//         tempArea + Area(bigList[i2][j2].width, bigList[i2][j2].height) <=
//         Area(width, height) * 0.9
//       ) {
//         toBePacked.push(bigList[i2][j2]);
//         tempArea += Area(bigList[i2][j2].width, bigList[i2][j2].height);
//         for (let z2 = 0; z2 < rlist.length; z2++) {
//           if (rlist[z2] == bigList[i2][j2]) {
//             rlist.splice(z2, 1);
//           }
//         }
//       }
//     }
//     i++;
//     counter++;
//     //}
//   }
//   //   } else {
//   //   // if (i == max - 1) {
//   //   //   i = 0;
//   //   // }
//   //   //z = "else";
//   //     if (i == 0) {
//   //       j++;
//   //     }
//   //   // console.log("j", j);
//   //   // console.log(bigList[i][j]);

//   //     if (j < bigList[i].length) {
//   //       if (
//   //         tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
//   //         Area(width, height) * 0.9
//   //       ) {
//   //         toBePacked.push(bigList[i][j]);

//   //         tempArea += Area(bigList[i][j].width, bigList[i][j].height);
//   //         for (let z = 0; z < rlist.length; z++) {
//   //           if (rlist[z] == bigList[i][j]) {
//   //             rlist.splice(z, 1);
//   //           }
//   //        }
//   //       }
//   //    }
//   //   // i++;
//   //   counter++;
//   // }
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////// tharun 2x2

function ArrayMaker(rlist, width, height) {
  this.z = 0;
  let bigList = [];
  let toBePacked = [];
  let tempArea = 0;
  let twoTwoList = [];
  let smallerList = [];

  let max = 0;
  let totalLength = rlist.length;
  let counter = 0;
  let c = 0;

  twoTwoList = get2x2(rlist);
  max = getMax(rlist);
  if (max == undefined) {
    console.error("tag in excel must be positive integer");
    return;
  }
  if (twoTwoList.length > 0) {
    let emptyArrays = intializeEmptyListWith2x2(max);
    bigList = emptyArrays[0];
    smallerList = emptyArrays[1];
    twoTwoList = get2x2(rlist);
    smallerList = separateListByTag(smallerList, twoTwoList);
    bigList = fillEmptyList(rlist, bigList, smallerList, twoTwoList);
    let z;
    let i2 = 1;
    let j2 = -1;
    let k = 0;
    let i = 0;
    let j = -1;
    while (tempArea <= Area(width, height) * 0.9) {
      if (counter == totalLength) {
        return [toBePacked, rlist, "z"];
      }
      // c = 0, allocate 2 by 2 first
      if (c == 0) {
        while (k < twoTwoList.length) {
          if (i == max) {
            i = 0;
          }
          if (i == 0) {
            j++;
          }
          if (typeof bigList[0][i][j] !== "undefined") {
            k += 1;
            counter++;
          }
          if (j < bigList[0][i].length) {
            if (
              tempArea +
                Area(bigList[0][i][j].width, bigList[0][i][j].height) <=
              Area(width, height) * 0.9
            ) {
              toBePacked.push(bigList[0][i][j]);
              tempArea += Area(bigList[0][i][j].width, bigList[0][i][j].height);
              rlist = rlist.filter(function (element) {
                return element != bigList[0][i][j];
              });
            }
          }
          i++;
        }
        c = 1;
        console.log("tobePacked22:", toBePacked);
        console.log("after rm 2x2:", rlist);
        console.log("Temparea after allocating 2x2:", tempArea);
        console.log("finished allocating 2*2, now trying to allocate the rest");
      }
      // c != 0, allocate non 2 by 2
      if (i2 == parseInt(max) + parseInt(1)) {
        i2 = 1;
      }
      if (typeof bigList[i2][j2] !== "undefined") {
        counter++;
      }
      if (i2 == 1) {
        j2++;
      }
      if (j2 < bigList[i2].length) {
        if (
          tempArea + Area(bigList[i2][j2].width, bigList[i2][j2].height) <=
          Area(width, height) * 0.9
        ) {
          toBePacked.push(bigList[i2][j2]);
          tempArea += Area(bigList[i2][j2].width, bigList[i2][j2].height);

          rlist = rlist.filter(function (element) {
            return element != bigList[i2][j2];
          });
        }
      }
      counter++;
      i2++;
    }
  } else {
    bigList = intializeEmptyListWithout2x2(max);
    bigList = separateListByTag(bigList, rlist);
    let i = 0;
    let j = -1;
    let z;

    while (tempArea <= Area(width, height) * 0.9) {
      if (counter == totalLength) {
        return [toBePacked, rlist, z];
      }

      if (bigList.length != 1) {
        z = "if";
        if (i == max) {
          i = 0;
        }
        if (i == 0) {
          j++;
        }
        if (typeof bigList[i][j] !== "undefined") {
          counter++;
        }
        if (j < bigList[i].length) {
          if (
            tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
            Area(width, height) * 0.9
          ) {
            toBePacked.push(bigList[i][j]);
            tempArea += Area(bigList[i][j].width, bigList[i][j].height);
            console.log("i am allocating smth so");

            rlist = rlist.filter(function (element) {
              return element != bigList[i][j];
            });
          }
        }
        i++;
        //counter++;
      } else {
        z = "else";
        j += 1;

        if (j < bigList[0].length) {
          if (
            tempArea + Area(bigList[0][j].width, bigList[0][j].height) <=
            Area(width, height) * 0.9
          ) {
            toBePacked.push(bigList[0][j]);
            tempArea += Area(bigList[0][j].width, bigList[0][j].height);
            rlist = rlist.filter(function (element) {
              return element != bigList[0][j];
            });
          }
          // i++;
          counter++;
        }
      }
    }
  }
}

// Test: result from rlist with highest tag x should be x
// Test: result from rlist with any tag non positive integer should be undefined
function getMax(rlist) {
  let max = 0;
  for (let index = 0; index < rlist.length; index++) {
    const element = rlist[index];
    let n = parseInt(element.tag);
    if (n % 1 != 0 || n < 0) {
      return undefined;
    } else {
      if (n >= max) {
        max = n;
      }
    }
  }
  return max;
}
// Test: result[0] is 2D array with max number of empty array, result[1] is 3D array with max + 1 number of empty array, result[1][0] is result[0]
function intializeEmptyListWith2x2(max) {
  let bigList = [];
  let smallerList = [];

  for (let i = 0; i < parseInt(max) + parseInt(1); i++) {
    bigList[i] = [];
  }

  console.log("debug biglist", bigList);
  for (let i = 0; i < max; i++) {
    smallerList[i] = [];
  }
  console.log("debug max", max);
  console.log("debug", smallerList);

  return [bigList, smallerList];
}
// Test: rlist without 2by2 should return empty array
// Test: rlist with 2by2 should return an array with all the 2by2 in it
function get2x2(rlist) {
  let twotwoList = [];
  for (let i = 0; i < rlist.length; i++) {
    if (rlist[i].width == 2 && rlist[i].height == 2) {
      twotwoList.push(rlist[i]);
    }
  }
  return twotwoList;
}
// Test: result[0] is 2D array with "max" number of empty array
function intializeEmptyListWithout2x2(max) {
  let List = [];
  for (let i = 0; i < max; i++) {
    List[i] = [];
  }
  return List;
}
// Test: result is 2D array object separated by its tag
function separateListByTag(after, before) {
  for (let i = 0; i < before.length; i++) {
    after[before[i].tag - 1].push(before[i]);
  }
  return after;
}
// Test: biglist[0] should be smallerlist, else should be separated by tag
function fillEmptyList(rlist, bigList, smallerList, twoTwoList) {
  let copyList = [...rlist];
  for (let i = 0; i < rlist.length; i++) {
    for (let j = 0; j < twoTwoList.length; j++)
      if (twoTwoList[j] == copyList[i]) {
        copyList.splice(i, 1);
      }
  }
  bigList[0] = smallerList;

  for (let i = 0; i < copyList.length; i++) {
    bigList[copyList[i].tag].push(copyList[i]);
  }
  return bigList;
}
