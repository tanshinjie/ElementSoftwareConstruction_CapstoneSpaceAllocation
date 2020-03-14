window.onload = function() {
  var resizerTop = document.querySelectorAll(
    ".resizable .resizers .resizer.top"
  );
  var parentBin;
  var drag;
  var original_top_x;
  var original_top_y;
  var orientation;
  var width = 100;
  var height = 200;
  var centerX = 100 + width / 2;
  var centerY = 100 + height / 2;
  addEventListener("mousemove", function(e) {
    if (drag) {
      orientation = Math.atan2(
        e.pageY - original_top_x,
        e.pageX - original_top_x
      );
      parentBin.style.transform = "rotate(" + orientation + "rad)";
    }
    console.log(e.pageX, e.pageY);
  });
  addEventListener("mousedown", function(e) {
    parentBin = e.target.parentNode.parentNode;
    original_top_x =
      parentBin.getBoundingClientRect().left +
      parentBin.getBoundingClientRect().width / 2;
    original_top_y =
      parentBin.getBoundingClientRect().top +
      parentBin.getBoundingClientRect().height / 2;

    drag = true;
  });
  addEventListener("mouseup", function(e) {
    console.log(getPixelsByAngle(centerX, centerY, width, height, orientation));
    drag = false;
  });
  function getPixelsByAngle(x, y, width, height, angle) {
    var radians = (angle * Math.PI) / 180;
    return [
      //upper left
      [
        x +
          width / 2 +
          (width / -2) * Math.cos(radians) -
          (height / -2) * Math.sin(radians),
        y +
          height / 2 +
          (width / -2) * Math.sin(radians) +
          (height / -2) * Math.cos(radians)
      ],
      //upper right
      [
        x +
          width / 2 +
          (width / 2) * Math.cos(radians) -
          (height / -2) * Math.sin(radians),
        y +
          height / 2 +
          (width / 2) * Math.sin(radians) +
          (height / -2) * Math.cos(radians)
      ],
      //bottom right
      [
        x +
          width / 2 +
          (width / 2) * Math.cos(radians) -
          (height / 2) * Math.sin(radians),
        y +
          height / 2 +
          (width / 2) * Math.sin(radians) +
          (height / 2) * Math.cos(radians)
      ],
      //bottom left
      [
        x +
          width / 2 +
          (width / -2) * Math.cos(radians) -
          (height / 2) * Math.sin(radians),
        y +
          height / 2 +
          (width / -2) * Math.sin(radians) +
          (height / 2) * Math.cos(radians)
      ]
    ];
  }
};
