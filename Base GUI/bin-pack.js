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

// module.exports.Rect = Rect;
// module.exports.BinPack = BinPack;

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
  //this.z = 0;
  // let currentTag;
  // let currentList;
  let bigList = [];
  let toBePacked = [];
  let tempArea = 0;
  //let splicedBigList = [];
  let twoTwoList = [];
  let smallerList = [];
  let y = 0;
  let copyList = [...rlist];
  let max = 0;
  let totalLength = rlist.length;
  let counter = 0;
  let c = 0;

  // rlist.forEach((element) => {
  //   if (element.tag >= max) {
  //     max = element.tag;
  //   }
  // });

  //console.log(max)

  //console.log("rlistMostUpadated:",rlist);
  for (let i = 0; i < rlist.length; i++) {
    if (rlist[i].width == 2 && rlist[i].height == 2) {
      console.log("found atleast 1 2x2");
      y = 1;
    }
  }
  if (y == 1) {
    // let thwalkkk = [];

    // for (let i = 0; i < rlist.length; i++) {
    //   thwalkkk.push(rlist[i].projID);
    // }

    // console.log("projIDs before going into the 2x2:",thwalkkk);
    
    rlist.forEach((element) => {
      if (element.tag >= max) {
        max = element.tag;
      }
    });

    console.log("i am here because i have atleast one 2x2");
    //console.log(max)
    for (let i = 0; i < (parseInt(max)+parseInt(1)); i++) {
      bigList[i] = [];
      console.log("making empty arrays");
      console.log(bigList);
    }

    for (let i = 0; i < max; i++) {
      smallerList[i] = [];
    }

    console.log("smallList:", smallerList);

    for (let i = 0; i < rlist.length; i++) {
      if (rlist[i].width == 2 && rlist[i].height == 2) {
        twoTwoList.push(rlist[i]);
      }
    }

    console.log(twoTwoList.length);

    for (let i = 0; i < twoTwoList.length; i++) {
      smallerList[twoTwoList[i].tag - 1].push(twoTwoList[i]);
    }

    for (let i = 0; i < rlist.length; i++) {
      for (let j = 0; j < twoTwoList.length; j++)
        if (twoTwoList[j] == copyList[i]) {
          copyList.splice(i, 1);
        }
    }

    console.log("length without the 2x2:", copyList.length);
    console.log("2x2 length:", twoTwoList.length);

    bigList[0] = smallerList;

    console.log(bigList[0]);

    for (let i = 0; i < copyList.length; i++) {
      bigList[copyList[i].tag].push(copyList[i]);
    }

    console.log("Final Biglist Before:", bigList);
    //console.log("does 5 exist", bigList[0][4][1]);
    //console.log("checking width:", bigList[0][0][0]);
    //console.log("checking length of emptyness:", bigList[0][0].length);
    console.log("FULL AREA:", Area(width, height));
    let i = 0;
    let j = -1;
    let z;
    let i2 = 1;
    let j2 = -1;
    let k = 0;
    //let b = 0;
    //let lengthRemaining = copyList.length;
    //let debugCopy = [...rlist];

    while (tempArea <= Area(width, height) * 0.9) {
      if (counter == totalLength) {
        // let remaining = []

        // for(let i = 0; i < rlist.length; i++){
        //   remaining.push(rlist[i].projID);
        // }

        // for(let i = 0; i < rlist.length; i++){
        //   if(rlist[i].projID == 24){
        //     console.log("found 24")
        //   }
        // }        
        // console.log("remaining projIDs after running initial:", remaining)
        // console.log("I am a survivor:", rlist);
        return [toBePacked, rlist, z];
      }
      if (c == 0) {
        console.log("Begin allocating 2x2");
        console.log("checking twoTwoList", twoTwoList.length);
        while (k < twoTwoList.length) {
          //for(let k = 0; k < 21; k++){
          //console.log("Trying to allocate 2x2", k)
          //console.log("just making sure:",max - 1)
          if (i == max) {
            i = 0;
          }
          if (i == 0) {
            j++;
          }
          //if(Area(bigList[0][i][j].width, bigList[0][i][j].height) > 0){
          //k += 1;
          //}
          //console.log(typeof)
          if (typeof bigList[0][i][j] !== "undefined") {
            k += 1;
            counter++;
          }

          console.log("before splicing", rlist.length);

          let beforeGoing = []

          for(let i = 0; i < rlist.length; i++){
              beforeGoing.push(rlist[i].projID);
          }

          console.log("checking projIDs before going in", beforeGoing)




          if (j < bigList[0][i].length) {
            console.log("Trying to allocate this 2x2:", bigList[0][i][j]);
            if (
              tempArea +
              Area(bigList[0][i][j].width, bigList[0][i][j].height) <=
              Area(width, height) * 0.9
            ) {
              //console.log("testing:", tempArea + 4)
              //console.log("TEMPAREA:",tempArea + Area(bigList[0][i][j].width, bigList[0][i][j].height));
              //console.log("accepting:", bigList[0][i][j]);
              toBePacked.push(bigList[0][i][j]);
              tempArea += Area(bigList[0][i][j].width, bigList[0][i][j].height);
              //console.log(rlist);
              //for (let z = 0; z < debug.length; z++) {
              //if (debug[z] == bigList[i][j]) {
              // console.log("Allocate this 2x2", bigList[0][i][j])
              console.log("splicing...")

              
              rlist = rlist.filter(function (element) {
                return element != bigList[0][i][j];
               });

              //  for(let i = 0; i < rlist.length; i++){
              //   if(rlist[i].projID == 24){
              //     console.log("found 24")
              //   }
              // let remainingSpliced = []

               //for(let i = 0; i < rlist.length; i++){
                // remainingSpliced.push(rlist[i].projID);
               //}

               //console.log("right after splicing", remainingSpliced);
              
              // console.log("time to find the truth")
              // for(let z = 0; z < rlist.length; z++){
              //   console.log("id from biglist",bigList[0][i][j].projID)
              //   console.log("this is from rlist", rlist[z].projID)
              //  if (rlist[z].projID == bigList[0][i][j].projID) {
              //     console.log("this is what i am splicing")
              //       rlist.splice(z,1);
              //      }
              //  }
              // console.log(
              //   "debug",
              //   rlist.filter(function (index) {
              //     return rlist[index] != bigList[0][i][j];
              //   })
              // );
              //console.log(rlist);
              //}
              //}
            }
            console.log("after splicing", rlist.length);
          }

          i++;
        }
        //}
        c = 1;
        for(let i = 0; i < rlist.length; i++){
          let tempArray = []
          tempArray.push(rlist[i])
        }  


        console.log("tobePacked22:", toBePacked);
        console.log("after rm 2x2:", rlist);
        console.log("Temparea after allocating 2x2:", tempArea);
        console.log("finished allocating 2*2, now trying to allocate the rest");
      }

      //console.log("copyList length:",lengthRemaining);

      //while(b < lengthRemaining){
      if (i2 == (parseInt(max) + parseInt(1)) ) {
        i2 = 1;
      }

      //console.log("checking what i2 is:", i2);
      if (i2 == 1) {
        j2++;
      }

      // if(typeof  bigList[i2][j2] !== "undefined"){
      //   //b += 1;
      //   counter++;
      // }
      //console.log("checking how far i2 goes", bigList[i2]);

      if (j2 < bigList[i2].length) {
        //if(typeof bigList[i2][j2].width !== "undefined" ){
        console.log("Trying to allocate", bigList[i2][j2]);
        if (
          tempArea + Area(bigList[i2][j2].width, bigList[i2][j2].height) <=
          Area(width, height) * 0.9
        ) {
          console.log("allocate this one:", bigList[i2][j2]);
          toBePacked.push(bigList[i2][j2]);
          tempArea += Area(bigList[i2][j2].width, bigList[i2][j2].height);
          
          rlist = rlist.filter(function (element) {
            return element != bigList[i2][j2];
           });

          // for (let z2 = 0; z2 < rlist.length; z2++) {
          //   if (rlist[z2] == bigList[i2][j2]) {
          //     //if()
          //     rlist.splice(z2, 1);
          //     console.log("trying to find 1:", rlist);
          //   }
          // }
        }
      }
      //}

      i2++;
      counter++;
      //console.log(counter);
      console.log(toBePacked);
      console.log("final area used up:", tempArea);
    }
    //}
  } else {
    // console.log("FULLAREA:", Area(width, height));
    // console.log("NO MORE 2x2");
    // let thwalk = [];

    // for (let i = 0; i < rlist.length; i++) {
    //   thwalk.push(rlist[i].projID);
    // }
    // console.log("debugRlist:", rlist);
    // console.log("unallocated:", thwalk);

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

    function fillUpBigList(List,list){
      for (let i = 0; i < list.length; i++) {
        List[list[i].tag - 1].push(list[i]);
      }
      return List;
    }

    let values = intializeEmptyListWithout2x2(rlist);
    bigList = values[0];
    max = values[1];
    bigList = fillUpBigList(bigList,rlist);

    // rlist.forEach((element) => {
    //   if (element.tag >= max) {
    //     max = element.tag;
    //   }

    // });

    //console.log("max as it changes:",max)

    // for (let i = 0; i < max; i++) {
    //   bigList[i] = [];
    // }

    //console.log("length of bigList at start:", bigList.length);

    

    // for (let i = 0; i < rlist.length; i++) {
    //   bigList[rlist[i].tag - 1].push(rlist[i]);
    // }
    // console.log("pushBigList:", bigList);

    let i = 0;
    let j = -1;
    let z;

    while (tempArea <= Area(width, height) * 0.9) {
      if (counter == totalLength) {

        // let remainingSecond = []

        // for(let i = 0; i < rlist.length; i++){
        //   remainingSecond.push(rlist[i].projID);
        // }
        // console.log("remaining projIDs after running second algo:", remainingSecond)
        // console.log("I am a survivor:", rlist);
        // console.log("remaining:", rlist);
        // console.log("finalPack:", toBePacked);
        return [toBePacked, rlist, z];
      }

    //   function packAndFilter(i, j, bigList, rlist,max){
    //     if (bigList.length != 1) {
    //       z = "if";
    //       if (i == max) {
    //         i = 0;
    //       }
    //       if (i == 0) {
    //         j++;
    //       }
    //       if (typeof bigList[i][j] !== "undefined") {
    //         //k += 1;
    //         counter++;
    //       }
    //       if (j < bigList[i].length) {
    //         if (
    //           tempArea + Area(bigList[i][j].width, bigList[i][j].height) <=
    //           Area(width, height) * 0.9
    //         ) {
    //           toBePacked.push(bigList[i][j]);
    //           tempArea += Area(bigList[i][j].width, bigList[i][j].height);
    //           console.log("i am allocating smth so");
              
    //           rlist = rlist.filter(function (element) {
    //             return element != bigList[i][j];
    //            });
    //         }
    //       }
    //       i++;
    //   }
    // }
      if (bigList.length != 1) {
        z = "if";
        if (i == max) {
          i = 0;
        }
        if (i == 0) {
          j++;
        }
        if (typeof bigList[i][j] !== "undefined") {
          //k += 1;
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
            // for (let z = 0; z < rlist.length; z++) {
            //   if (rlist[z] == bigList[i][j]) {
            //     rlist.splice(z, 1);
            //     //rlist.filter(function(index){return rlist[index] != bigList[i][j]});
            //     console.log("I should end up here everytime");
            //   }
            // }
          }
        }
        i++;
        //counter++;
      } else {
        console.log("i am the last one left");
        // if (i == max - 1) {
        //   i = 0;
        // }
        z = "else";
        //if (i == 0) {
        j += 1;
        //}
        // console.log("j", j);
        // console.log(bigList[i][j]);

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
            //   for (let z = 0; z < rlist.length; z++) {
          //     if (rlist[z] == bigList[0][j]) {
          //       rlist.splice(z, 1);
          //     }
          //   }
          // }
        }
        // i++;
        counter++;
      }
    }
    // console.log(rlist);
    //console.log("tobepacked", toBePacked);

    //return [toBePacked, rlist];
  }
}
}