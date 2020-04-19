let editing = 0;
let numberOfBin = 0;
let boxesinbins = 0;
let moveableObjectList = [];
let moveableObject;
let moveable = null;
let frame = null;
let name = null;

function resize() {
  btn = document.getElementById("editBtn");
  if (editing) {
    if (
      $("#container").data("ui-draggable") &&
      $("#container2").data("ui-draggable")
    ) {
      $("#container").draggable("enable");
      $("#container2").draggable("enable");
    } else if ($("#container").data("ui-draggable")) {
      $("#container").draggable("enable");
    } else {
      $("#container2").draggable("enable");
    }
    document.getElementById("drawBtn").disabled = false;
    document.getElementById("runBtn").disabled = false;
    editing = 0;
    btn.innerHTML = "Edit";
    bins = document.querySelectorAll(".bin");
    recreateBin(bins);
    console.log("debug", "exit editing");

    controlBoxes = document.querySelectorAll(".moveable-control-box");
    for (let index = 0; index < controlBoxes.length; index++) {
      const element = controlBoxes[index];
      element.parentNode.removeChild(element);
    }
    setBtnState();
  } else {
    if (
      $("#container").data("ui-draggable") &&
      $("#container2").data("ui-draggable")
    ) {
      $("#container").draggable("disable");
      $("#container2").draggable("disable");
    } else if ($("#container").data("ui-draggable")) {
      $("#container").draggable("disable");
    } else {
      $("#container2").draggable("disable");
    }
    document.getElementById("drawBtn").disabled = true;
    document.getElementById("runBtn").disabled = true;
    editing = 1;
    btn.innerHTML = "Editing...";
    boxes = document.querySelectorAll(".bin");

    var zone1 = document.getElementById("drawZone");
    zone1_width = zone1.offsetWidth;
    zone1_height = zone1.offsetHeight;
    console.log("debug", "enter editing");
    for (let index = 0; index < boxes.length; index++) {
      const element = boxes[index];
      element.style.backgroundColor = "#0C97C9";
      element.style.opacity = 0.5;
      if (element.childNodes.length > 0) {
        boxesinbins = 1;
      } else {
        boxesinbins = 0;
      }
      let bin_txt = document.createElement("p");
      bin_txt.className = "boxTxt";
      bin_txt.setAttribute("align", "center");
      bin_txt.setAttribute("vertical-align", "middle");
      // bin_txt.setAttribute("position", "static")
      bin_txt.setAttribute("marginTop", "50%");
      bin_txt.setAttribute("fontSize", "12px");
      bin_txt.setAttribute("textAlign", "center");
      bin_txt.setAttribute("id", element.getAttribute("name") + "Txt");
      bin_txt.style.zIndex = 1;
      var bin_vals = element.getAttribute("value");
      var bin_dims = bin_vals.split(",");
      var transform = element.style.transform;
      var inner_str = transform.substring(
        transform.lastIndexOf("scale(") + 6,
        transform.length
      );
      var scale_str = inner_str.substring(0, inner_str.indexOf(")"));
      var scales = scale_str.split(",");
      var scale = parseFloat(scales[0]);

      // bin_txt.style.fontSize = 25 + "px"
      bin_txt.setAttribute("fontSize", Math.round(12 / scale) + "px");
      bin_txt.innerText =
        "Height: " +
        Math.round(bin_dims[0] * bin_dims[2] * scale * 100) / 100 +
        "m\nWidth: " +
        Math.round(bin_dims[0] * bin_dims[1] * scale * 100) / 100 +
        "m";
      element.appendChild(bin_txt);
      initMoveable(moveableObjectList[index], element, boxesinbins, index);
    }
    document
      .getElementById("container")
      .addEventListener("mousedown", function (e) {
        if (e.target.className == "bin") {
          currentSelected = e.target;
          console.log("currentSelected", currentSelected);
        }
      });
    document.addEventListener("keydown", function (e) {
      if (e.keyCode == 46 && currentSelected != null) {
        console.log("delete", currentSelected.getAttribute("name"));
        let removeIndex;
        // console.log("moveableObject", moveableObjectList);
        for (let index = 0; index < moveableObjectList.length; index++) {
          const element = moveableObjectList[index];
          // console.log(element.name);
          if (element.name == currentSelected.getAttribute("name")) {
            removeIndex = index;
          }
        }
        moveableObjectList.splice(removeIndex, 1);
        currentSelected.parentNode.removeChild(currentSelected);
        currentSelected = null;
      }
    });
    document
      .getElementById("container2")
      .addEventListener("mousedown", function (e) {
        if (e.target.className == "bin") {
          currentSelected = e.target;
          console.log("currentSelected", currentSelected);
        }
      });
    // document.addEventListener("keydown", function (e) {
    //   if (e.keyCode == 46 && currentSelected != null) {
    //     console.log("delete", currentSelected.getAttribute("name"));
    //     let removeIndex;
    //     // console.log("moveableObject", moveableObjectList);
    //     for (let index = 0; index < moveableObjectList.length; index++) {
    //       const element = moveableObjectList[index];
    //       // console.log(element.name);
    //       if (element.name == currentSelected.getAttribute("name")) {
    //         removeIndex = index;
    //       }
    //     }
    //     // console.log(removeIndex);
    //     moveableObjectList.splice(removeIndex, 1);
    //     // console.log(moveableObjectList);
    //     document.getElementById("container2").removeChild(currentSelected);
    //     currentSelected = null;
    //   }
    // });
  }
}
function recreateBin(bins) {
  console.log("debug recreateBins", bins);

  for (let index = 0; index < bins.length; index++) {
    var element = bins[index];
    let div = document.createElement("div");
    div.style.left = element.style.left;
    div.style.top = element.style.top;
    div.style.width = element.style.width;
    div.style.height = element.style.height;
    div.style.transform = element.style.transform;
    while (element.childNodes.length > 0) {
      div.appendChild(element.childNodes[0]);
    }
    div.style.position = element.style.position;
    div.className = element.className;
    div.id = element.id;
    div.style.zIndex = element.style.zIndex;
    div.setAttribute("name", element.getAttribute("name"));
    div.setAttribute("value", element.getAttribute("value"));
    element.parentNode.appendChild(div);
    element.parentNode.removeChild(element);
    console.log("debug bin_txt ID", div.getAttribute("name") + "Txt");

    let bin_txt = document.getElementById(div.getAttribute("name") + "Txt");
    // element.style.backgroundColor = null;
    // element.style.opacity = null;
    console.log("debug bin_txt", bin_txt);
    bin_txt.remove();
  }
}
// var dragging = false;
// let startX, startY, diffX, diffY, rect;
// var drawing = 0;
// function draw() {
//   btn = document.getElementById("drawBtn");
//   if (drawing) {
//     $("#container").draggable("enable");
//     $("#container2").draggable("enable");
//     document.getElementById("editBtn").disabled = false;
//     drawing = 0;
//     btn.innerHTML = "Draw";
//     document
//       .getElementById("drawZone")
//       .removeEventListener("mousedown", function (e) {
//         drawMouseDown(e);
//       });
//     document
//       .getElementById("drawZone")
//       .removeEventListener("mousemove", drawMouseMove);
//     document
//       .getElementById("drawZone")
//       .removeEventListener("mouseup", drawMouseUp);
//     document
//       .getElementById("drawZone2")
//       .removeEventListener("mousedown", function (e) {
//         drawMouseDown(e);
//       });
//     document
//       .getElementById("drawZone2")
//       .removeEventListener("mousemove", drawMouseMove);
//     document
//       .getElementById("drawZone2")
//       .removeEventListener("mouseup", drawMouseUp);
//     // $("#our-canvas").draggable(true);

//     // var childs = document.getElementsByClassName(
//     //   "ui-draggable ui-draggable-handle"
//     // );
//     // var i;

//     // for (i = 0; i < childs.length; i++) {
//     //   childs[i].draggable("true");
//     // }
//   } else {
//     $("#container").draggable("disable");
//     $("#container2").draggable("disable");
//     document.getElementById("editBtn").disabled = true;
//     drawing = 1;
//     btn.innerHTML = "Drawing...";
//     document
//       .getElementById("drawZone")
//       .addEventListener("mousedown", drawMouseDown);
//     document
//       .getElementById("drawZone")
//       .addEventListener("mousemove", drawMouseMove);
//     document
//       .getElementById("drawZone")
//       .addEventListener("mouseup", drawMouseUp);
//     document
//       .getElementById("drawZone2")
//       .addEventListener("mousedown", drawMouseDown);
//     document
//       .getElementById("drawZone2")
//       .addEventListener("mousemove", drawMouseMove);
//     document
//       .getElementById("drawZone2")
//       .addEventListener("mouseup", drawMouseUp);
//     // $("#our-canvas").draggable(false);

//     // var childs = document.getElementsByClassName(
//     //   "ui-draggable ui-draggable-handle"
//     // );
//     // var i;

//     // for (i = 0; i < childs.length; i++) {
//     //   childs[i].draggable("false");
//     // }
//   }
// }
// function drawMouseDown(e) {
//   console.log(e.target.id);
//   let parentContainer = document.getElementById(e.target.id).parentElement;
//   console.log(parentContainer);

//   rect = document.getElementById(e.target.id).getBoundingClientRect();

//   startX = e.pageX - rect.x;
//   startY = e.pageY - rect.y;

//   var active_box = document.createElement("div");
//   active_box.id = "active_box";
//   active_box.className = "box";
//   active_box.style.top = startY + "px";
//   active_box.style.left = startX + "px";
//   active_box.style.position = "absolute";
//   active_box.style.zIndex = 1000;

//   parentContainer.appendChild(active_box);
//   container.active_box = null;
// }
// function drawMouseMove(e) {
//   console.log(e.clientX);

//   // update box dimension
//   if (document.getElementById("active_box") !== null) {
//     var ab = document.getElementById("active_box");
//     ab.style.width = e.pageX - startX - rect.x + "px";
//     ab.style.height = e.pageY - startY - rect.y + "px";
//   }

//   // move and update box coordinates
//   if (document.getElementById("moving_box") !== null && dragging) {
//     var mb = document.getElementById("moving_box");
//     mb.style.top = e.pageY - diffY + "px";
//     mb.style.left = e.pageX - diffX + "px";
//   }
// }
// function drawMouseUp(e) {
//   // forbid dragging
//   dragging = false;
//   if (document.getElementById("active_box") !== null) {
//     var ab = document.getElementById("active_box");
//     ab.removeAttribute("id");
//     ab.setAttribute("name", "bin-" + numberOfBin);
//     name = "bin-" + numberOfBin;
//     numberOfBin++;
//     console.log(ab);

//     if (ab.offsetWidth < 15 || ab.offsetHeight < 15) {
//       numberOfBin--;
//       document.getElementById("container").removeChild(ab);
//     }
//   }
//   moveableObject = {
//     moveable,
//     frame,
//     name,
//   };
//   moveableObjectList.push(moveableObject);

//   console.log("numberOfBin", numberOfBin);
// }
