var editing = 0;
var numberOfBin = 0;
function resize() {
  document.removeEventListener("mousedown", drawMouseDown);
  document.removeEventListener("mouseup", drawMouseUp);
  document.removeEventListener("mousemomve", drawMouseMove);
  btn = document.getElementById("resizeBtn");
  if (editing) {
    editing = 0;
    btn.innerHTML = "Resize";
    resizables = document.querySelectorAll(".resizable");
    for (let index = 0; index < resizables.length; index++) {
      resizables[index].className = "box";
    }
  } else {
    editing = 1;
    btn.innerHTML = "Done";
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
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener("mousedown", function(e) {
        currentBin = e.target.parentNode.parentNode;
        currentBinIndex = parseInt(currentBin.id.replace(/[^0-9\.]/g, ""), 10);
        element = elements[currentBinIndex];
        console.log(element);
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
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
      });

      function resize(e) {
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
        } else if (currentResizer.classList.contains("top")) {
          console.log(1);
          rectX = element.style.width / 2;
          rectY = element.style.height / 2;
          element.style.transform =
            "rotate(" + Math.atan2(e.pageY - rectY, e.pageX - rectX) + "rad)";
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

function draw() {
  document.addEventListener("mousedown", drawMouseDown);
  document.addEventListener("mousemove", drawMouseMove);
  document.addEventListener("mouseup", drawMouseUp);
}
function drawMouseDown(e) {
  startX = e.pageX;
  startY = e.pageY;

  // 如果鼠标在 box 上被按下
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
    document.body.appendChild(active_box);
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
      "resizer top"
    ];
    resizerLabels.forEach(resizerLabel => {
      div = document.createElement("div");
      div.className = resizerLabel;
      resizersDiv.appendChild(div);
    });
    ab.appendChild(resizersDiv);
    ab.id = "bin-" + numberOfBin;
    numberOfBin++;
    // 如果长宽均小于 3px，移除 box
    if (ab.offsetWidth < 3 || ab.offsetHeight < 3) {
      numberOfBin--;
      document.body.removeChild(ab);
    }
  }
  // if (document.getElementById("moving_box") !== null) {
  // document.getElementById("moving_box").removeAttribute("id");
  // }
  console.log("numberOfBin", numberOfBin);
}
