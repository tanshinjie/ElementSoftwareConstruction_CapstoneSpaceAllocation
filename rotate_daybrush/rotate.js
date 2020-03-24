function Rotate(bin, binsinboxes) {

if(binsinboxes){
  moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: bin,
    rotatable: true,
    scalable: false,
    draggable: true,
    keepRatio: true,
    throttleScale: 0,
    throttleDrag: 0,
    throttleRotate: 0,
    origin: true,  });

}else{
  moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: bin,
    rotatable: true,
    scalable: true,
    draggable: true,
    keepRatio: true,
    throttleScale: 0,
    throttleDrag: 0,
    throttleRotate: 0,
    origin: true,  });

}

  moveable
    .on("rotateStart", ({ target, clientX, clientY }) => {
      console.log("onRotateStart", target);
    })
    .on(
      "rotate",
      ({ target, beforeDelta, delta, dist, transform, clientX, clientY }) => {
        console.log("onRotate", dist);
        target.style.transform = transform;
      }
    )
    .on("rotateEnd", ({ target, isDrag, clientX, clientY }) => {
      console.log("onRotateEnd", target, isDrag);
    })
    .on("scaleStart", ({ target, clientX, clientY }) => {
      console.log("onScaleStart", target);
    })
    .on(
      "scale",
      ({ target, scale, dist, delta, transform, clientX, clientY }) => {
        console.log("onScale scale", scale);
        target.style.transform = transform;
      }
    )
    .on("scaleEnd", ({ target, isDrag, clientX, clientY }) => {
      console.log("onScaleEnd", target, isDrag);
    })
    .on("dragStart", ({ target, clientX, clientY }) => {
      console.log("onDragStart", target);
    })
    .on(
      "drag",
      ({
        target,
        transform,
        left,
        top,
        right,
        bottom,
        beforeDelta,
        beforeDist,
        delta,
        dist,
        clientX,
        clientY
      }) => {
        console.log("onDrag left, top", left, top);
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        // console.log("onDrag translate", dist);
        target.style.transform = transform;
      }
    )
    .on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
      console.log("onDragEnd", target, isDrag);
    });
  return moveable;
}

function UnRotate(bin) {
  console.log("unrotate");

  moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: bin,
    draggable: false
  });
  return moveable;
}
