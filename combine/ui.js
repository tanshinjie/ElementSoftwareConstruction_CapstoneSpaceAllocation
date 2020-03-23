var editing = 0;
var numberOfBin = 0;
function resize() {
  // document
  //   .getElementById("drawZone")
  //   .removeEventListener("mousedown", drawMouseDown);
  // document
  //   .getElementById("drawZone")
  //   .removeEventListener("mouseup", drawMouseUp);
  // document
  //   .getElementById("drawZone")
  //   .removeEventListener("mousemomve", drawMouseMove);
  btn = document.getElementById("editBtn");
  if (editing) {
    editing = 0;
    btn.innerHTML = "Edit";
    controlBoxes = document.querySelectorAll(".moveable-control-box");
    for (let index = 0; index < controlBoxes.length; index++) {
      const element = controlBoxes[index];
      document.body.removeChild(element);
    }
    boxes = document.querySelectorAll(".box");
    for (let index = 0; index < boxes.length; index++) {
      const element = boxes[index];
      $(element).draggable("enable");
      element.style.backgroundColor = null;
      element.style.opacity = null;
    }

    // resizables = document.querySelectorAll(".resizable");
    // for (let index = 0; index < resizables.length; index++) {
    //   resizables[index].className = "box";
    // }
  } else {
    let currentSelected;
    editing = 1;
    btn.innerHTML = "Editing...";
    boxes = document.querySelectorAll(".box");
    let moveables = [];
    for (let index = 0; index < boxes.length; index++) {
      const element = boxes[index];
      element.style.backgroundColor = "#F0ADFE";
      element.style.opacity = 0.5;
      $(element).draggable("disable");
      moveables.push(Rotate(element));
    }
    document
      .getElementById("drawZone")
      .addEventListener("mousedown", function(e) {
        console.log(e.target);
        currentSelected = e.target;
      });

    document
      .getElementById("drawZone")
      .addEventListener("keydown", function(e) {
        if (e.keyCode == 46 && currentSelected != null) {
          console.log("delete", currentSelected.getAttribute("name"));
          // console.log(currentSelected.parentNode);
          document.getElementById("drawZone").removeChild(currentSelected);
        }
      });

    // for (let index = 0; index < controlBoxes.length; index++) {
    //   const element = controlBoxes[index];
    //   element.appendChild(boxes[index]);
    //   console.log(element);

    // $(element).draggable();
    // console.log(1);
    // }
    // for (let index = 0; index < boxes.length; index++) {
    //   const element = boxes[index];
    //   $(element).draggable();
    // }

    // bins = document.querySelectorAll(".box");
    // for (let index = 0; index < bins.length; index++) {
    //   bins[index].className = "resizable";
    // }
    // makeResizableDiv(".resizable");
  }

  /*Make resizable div by Hung Nguyen*/
  function makeResizableDiv(div) {
    const elements = document.querySelectorAll(div);
    const resizers = document.querySelectorAll(div + " .resizer");
    var element;
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    let original_top_x;
    let original_top_y;
    let orientation;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener("mousedown", function(e) {
        currentBin = e.target.parentNode.parentNode;
        currentBinIndex = parseInt(
          currentBin.getAttribute("name").replace(/[^0-9\.]/g, ""),
          10
        );
        element = elements[currentBinIndex];
        e.preventDefault();
        original_width = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        original_height = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("height")
            .replace("px", "")
        );
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_top_x = original_x + element.getBoundingClientRect().width / 2;
        original_top_y =
          original_y + element.getBoundingClientRect().height / 2;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
      });

      function resize(e) {
        console.log(currentResizer.classList);
        if (currentResizer.classList.contains("bottom-right")) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height + (e.pageY - original_mouse_y);
          if (width > minimum_size) {
            element.style.width = width + "px";
          }
          if (height > minimum_size) {
            element.style.height = height + "px";
          }
        } else if (currentResizer.classList.contains("bottom-left")) {
          const height = original_height + (e.pageY - original_mouse_y);
          const width = original_width - (e.pageX - original_mouse_x);
          if (height > minimum_size) {
            element.style.height = height + "px";
          }
          if (width > minimum_size) {
            element.style.width = width + "px";
            element.style.left =
              original_x + (e.pageX - original_mouse_x) + "px";
          }
        } else if (currentResizer.classList.contains("top-right")) {
          const width = original_width + (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size) {
            element.style.width = width + "px";
          }
          if (height > minimum_size) {
            element.style.height = height + "px";
            element.style.top =
              original_y + (e.pageY - original_mouse_y) + "px";
          }
        } else if (currentResizer.classList.contains("top-left")) {
          const width = original_width - (e.pageX - original_mouse_x);
          const height = original_height - (e.pageY - original_mouse_y);
          if (width > minimum_size) {
            element.style.width = width + "px";
            element.style.left =
              original_x + (e.pageX - original_mouse_x) + "px";
          }
          if (height > minimum_size) {
            element.style.height = height + "px";
            element.style.top =
              original_y + (e.pageY - original_mouse_y) + "px";
          }
        } else if (currentResizer.classList.contains("rotate")) {
          orientation = Math.atan2(
            e.pageY - original_top_y,
            e.pageX - original_top_x
          );
          element.style.transform = "rotate(" + orientation + "rad)";
        }
      }
      function stopResize() {
        window.removeEventListener("mousemove", resize);
      }
    }
  }
}

var dragging = false;
var startX, startY, diffX, diffY;
var drawing = 0;
function draw() {
  btn = document.getElementById("drawBtn");
  if (drawing) {
    drawing = 0;
    btn.innerHTML = "Draw";
    document
      .getElementById("drawZone")
      .removeEventListener("mousedown", drawMouseDown);
    document
      .getElementById("drawZone")
      .removeEventListener("mousemove", drawMouseMove);
    document
      .getElementById("drawZone")
      .removeEventListener("mouseup", drawMouseUp);
    $("#our-canvas").draggable("enable");
  } else {
    drawing = 1;
    btn.innerHTML = "Drawing...";
    document
      .getElementById("drawZone")
      .addEventListener("mousedown", drawMouseDown);
    document
      .getElementById("drawZone")
      .addEventListener("mousemove", drawMouseMove);
    document
      .getElementById("drawZone")
      .addEventListener("mouseup", drawMouseUp);
    $("#our-canvas").draggable("disable");
  }
}
function drawMouseDown(e) {
  startX = e.pageX;
  startY = e.pageY;
  // if click on the box

  // if (e.target.className.match(/box/)) {
  //   // allow dragging
  //   dragging = true;
  //   // set current box's id to be moving_box
  //   if (document.getElementById("moving_box") !== null) {
  //     document.getElementById("moving_box").removeAttribute("id");
  //   }
  //   e.target.id = "moving_box";
  //   // calculate difference in coordinates
  //   diffX = startX - e.target.offsetLeft;
  //   diffY = startY - e.target.offsetTop;
  // } else
  {
    // create box in website
    var active_box = document.createElement("div");
    active_box.id = "active_box";
    active_box.className = "box";
    active_box.style.top = startY + "px";
    active_box.style.left = startX + "px";
    document.getElementById("drawZone").appendChild(active_box);
    active_box = null;
  }
}
function drawMouseMove(e) {
  // update box dimension
  if (document.getElementById("active_box") !== null) {
    var ab = document.getElementById("active_box");
    ab.style.width = e.pageX - startX + "px";
    ab.style.height = e.pageY - startY + "px";
  }

  // move and update box coordinates
  if (document.getElementById("moving_box") !== null && dragging) {
    var mb = document.getElementById("moving_box");
    mb.style.top = e.pageY - diffY + "px";
    mb.style.left = e.pageX - diffX + "px";
  }
}
function drawMouseUp(e) {
  // forbid dragging
  dragging = false;
  if (document.getElementById("active_box") !== null) {
    var ab = document.getElementById("active_box");
    ab.removeAttribute("id");
    // resizersDiv = document.createElement("div");
    // resizersDiv.className = "resizers";
    // resizerLabels = [
    //   "resizer top-left",
    //   "resizer top-right",
    //   "resizer bottom-left",
    //   "resizer bottom-right",
    //   "resizer rotate"
    // ];
    // resizerLabels = [
    //   "resizer top-left",
    //   "resizer top-right",
    //   "resizer bottom-left",
    //   "resizer bottom-right"
    // ];
    // resizerLabels.forEach(resizerLabel => {
    //   div = document.createElement("div");
    //   div.className = resizerLabel;
    //   resizersDiv.appendChild(div);
    // });
    // ab.appendChild(resizersDiv);
    ab.setAttribute("name", "bin-" + numberOfBin);
    $(ab).draggable();
    numberOfBin++;
    // if height and weight less than 5px remove box
    if (ab.offsetWidth < 5 || ab.offsetHeight < 5) {
      numberOfBin--;
      document.getElementById("drawZone").removeChild(ab);
    }
  }
  // if (document.getElementById("moving_box") !== null) {
  // document.getElementById("moving_box").removeAttribute("id");
  // }

  console.log("numberOfBin", numberOfBin);
}
