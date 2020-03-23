var editing = 0;
var numberOfBin = 0;
function resize() {
  document
    .getElementById("drawZone")
    .removeEventListener("mousedown", drawMouseDown);
  document
    .getElementById("drawZone")
    .removeEventListener("mouseup", drawMouseUp);
  document
    .getElementById("drawZone")
    .removeEventListener("mousemomve", drawMouseMove);
  btn = document.getElementById("editBtn");
  if (editing) {
    $("#drawZone").draggable('enable');
    editing = 0;
    btn.innerHTML = "Edit";
    resizables = document.querySelectorAll(".resizable");
    for (let index = 0; index < resizables.length; index++) {
      resizables[index].className = "box";
    }
  } else {
    $("#drawZone").draggable('disable');
    editing = 1;
    btn.innerHTML = "Editing...";
    bins = document.querySelectorAll(".box");
    for (let index = 0; index < bins.length; index++) {
      bins[index].className = "resizable";
    }
    makeResizableDiv(".resizable");
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
    $("#drawZone").draggable('enable');
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
  } else {
    $("#drawZone").draggable('disable');
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
    btn = document.getElementById("drawBtn");

  }
}
function drawMouseDown(e) {
  startX = e.clientX;
  startY = e.clientY;
  // 如果鼠标在 box 上被按下
  console.log(e.target);

  if (e.target.className.match(/box/)) {
    // 允许拖动
    dragging = true;
    // 设置当前 box 的 id 为 moving_box
    if (document.getElementById("moving_box") !== null) {
      document.getElementById("moving_box").removeAttribute("id");
    }
    e.target.id = "moving_box";
    // 计算坐标差值
    diffX = startX - e.target.offsetLeft;
    diffY = startY - e.target.offsetTop;
  } else {
    // 在页面创建 box
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
  // 更新 box 尺寸
  if (document.getElementById("active_box") !== null) {
    var ab = document.getElementById("active_box");
    ab.style.width = e.pageX - startX + "px";
    ab.style.height = e.pageY - startY + "px";
  }

  // 移动，更新 box 坐标
  if (document.getElementById("moving_box") !== null && dragging) {
    var mb = document.getElementById("moving_box");
    mb.style.top = e.pageY - diffY + "px";
    mb.style.left = e.pageX - diffX + "px";
  }
}
function drawMouseUp(e) {
  // 禁止拖动
  dragging = false;
  if (document.getElementById("active_box") !== null) {
    var ab = document.getElementById("active_box");
    ab.removeAttribute("id");
    resizersDiv = document.createElement("div");
    resizersDiv.className = "resizers";
    resizerLabels = [
      "resizer top-left",
      "resizer top-right",
      "resizer bottom-left",
      "resizer bottom-right",
      "resizer rotate"
    ];
    resizerLabels.forEach(resizerLabel => {
      div = document.createElement("div");
      div.className = resizerLabel;
      resizersDiv.appendChild(div);
    });
    ab.appendChild(resizersDiv);
    ab.setAttribute("name", "bin-" + numberOfBin);
    numberOfBin++;
    // 如果长宽均小于 3px，移除 box
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
