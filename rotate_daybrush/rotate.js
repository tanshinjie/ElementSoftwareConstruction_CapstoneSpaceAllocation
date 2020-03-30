function initMoveable(moveableObject, bin, binsinboxes) {
  if (moveableObject.moveable == null) {
    console.log("new");
    moveableObject.frame = {
      translate: [0, 0],
      scale: [1, 1],
      rotate: 0
    };
    moveableObject.name = bin.getAttribute("name");
  } else {
    console.log("old");
  }
  frame = moveableObject.frame;
  console.log(frame.translate);
  moveableObject.moveable = new Moveable(document.getElementById("container"), {
    target: bin,
    rotatable: true,
    draggable: true,
    scalable: true,
    keepRatio: false,
    throttleScale: 0,
    throttleDrag: 0,
    throttleRotate: 0,
    throttleDragRotate: 0,
    origin: true,
    snapThreshold: 0,
    snappable: true,
    bounds: {
      left: 0,
      top: 0,
      bottom: document.getElementById("container").offsetHeight,
      right: document.getElementById("container").offsetWidth
    }
  });
  if (binsinboxes) {
    moveableObject.moveable.scalable = false;
  } else {
    moveableObject.moveable.scalable = true;
  }
  if (moveableObject.frame.rotate != 0) {
    moveableObject.moveable.scalable = false;
  }
  moveableObject.moveable
    .on("rotateStart", ({ set }) => {
      frame = moveableObject.frame;
      set(frame.rotate);
    })
    .on("rotate", ({ target, beforeRotate }) => {
      frame.rotate = beforeRotate;
      editor(target);
    })
    .on("dragStart", ({ set }) => {
      frame = moveableObject.frame;
      console.log(moveableObject.name, moveableObject.frame.translate);
      set(frame.translate);
    })
    .on("drag", ({ target, beforeTranslate }) => {
      frame.translate = beforeTranslate;
      editor(target);
    })
    .on("scaleStart", ({ set, dragStart }) => {
      frame = moveableObject.frame;
      set(frame.scale);
      dragStart && dragStart.set(frame.translate);
    })
    .on("scale", ({ target, drag, scale }) => {
      frame.scale = scale;
      frame.translate = drag.beforeTranslate;
      editor(target);
    });
  function editor(target) {
    const { translate, scale, rotate } = frame;
    target.style.transform = `translate(${translate[0]}px, ${translate[1]}px) scale(${scale[0]}, ${scale[1]}) rotate(${rotate}deg)`;
  }
  return moveableObject;
}

// function initMoveable(bin, binsinboxes, name) {
//   let frame = {
//     translate: [0, 0],
//     scale: [1, 1],
//     rotate: 0
//   };
//   let moveable = new Moveable(document.getElementById("container"), {
//     // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
//     target: bin,
//     rotatable: true,
//     draggable: true,
//     scalable: true,
//     keepRatio: false,
//     // throttleScale: 0,
//     // throttleDrag: 0,
//     // throttleRotate: 0,
//     // throttleDragRotate: 0,
//     // origin: true,
//     // snapThreshold: 0,
//     snappable: true,
//     bounds: {
//       left: 0,
//       top: 0,
//       bottom: document.getElementById("container").offsetHeight,
//       right: document.getElementById("container").offsetWidth
//     }
//   });
//   if (binsinboxes) {
//     moveable.scalable = false;
//   } else {
//     moveable.scalable = true;
//   }
//   moveable
//     .on("rotateStart", ({ set }) => {
//       set(frame.rotate);
//     })
//     .on("rotate", ({ target, beforeRotate }) => {
//       frame.rotate = beforeRotate;
//       editor(target);
//     })
//     .on("dragStart", ({ set }) => {
//       set(frame.translate);
//     })
//     .on("drag", ({ target, beforeTranslate }) => {
//       frame.translate = beforeTranslate;
//       editor(target);
//     })
//     .on("scaleStart", ({ set, dragStart }) => {
//       set(frame.scale);
//       dragStart && dragStart.set(frame.translate);
//     })
//     .on("scale", ({ target, drag, scale }) => {
//       console.log("scale");
//       frame.scale = scale;
//       frame.translate = drag.beforeTranslate;
//       editor(target);
//     });
//   function editor(target) {
//     const { translate, scale, rotate } = frame;
//     target.style.transform = `translate(${translate[0]}px, ${translate[1]}px) scale(${scale[0]}, ${scale[1]}) rotate(${rotate}deg)`;
//   }
//   moveableObject = {
//     moveable,
//     frame,
//     name
//   };
//   return moveableObject;
// }
// const frame = {
//   translate: [0, 0],
//   scale: [1, 1],
//   rotate: 0
// };

// function Rotate(bin, binsinboxes) {
//   // document.getElementById("drawZone").removeEventListener("mousedown", dra)

//   moveable = new Moveable(document.getElementById("container"), {
//     // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
//     target: bin,
//     rotatable: true,
//     draggable: true,
//     keepRatio: false,
//     throttleScale: 0,
//     throttleDrag: 0,
//     throttleRotate: 0,
//     throttleDragRotate: 0,
//     origin: true,
//     snappable: true,
//     snapThreshold: 0,
//     bounds: {
//       left: 0,
//       top: 0,
//       bottom: document.getElementById("our-canvas").offsetHeight,
//       right: document.getElementById("our-canvas").offsetWidth
//     }
//   });

//   if (binsinboxes) {
//     moveable.scalable = false;
//   } else {
//     moveable.scalable = true;
//   }

//   moveable
//     .on("rotateStart", ({ set }) => {
//       set(frame.rotate);
//     })
//     .on("rotate", ({ target, beforeRotate }) => {
//       frame.rotate = beforeRotate;
//       editor(target);
//     })
//     .on("dragStart", ({ target, clientX, clientY }) => {
//       console.log("onDragStart", target);
//     })
//     .on("dragStart", ({ set }) => {
//       set(frame.translate);
//     })
//     .on("drag", ({ target, beforeTranslate }) => {
//       frame.translate = beforeTranslate;
//       editor(target);
//     })
//     .on("scaleStart", ({ set, dragStart }) => {
//       set(frame.scale);
//       dragStart && dragStart.set(frame.translate);
//     })
//     .on("scale", ({ target, drag, scale }) => {
//       frame.scale = scale;
//       frame.translate = drag.beforeTranslate;
//       editor(target);
//     });
//   // .on("rotateStart", ({ target, clientX, clientY }) => {
//   //   console.log("onRotateStart", target);
//   // })
//   // .on(
//   //   "rotate",
//   //   ({ target, beforeDelta, delta, dist, transform, clientX, clientY }) => {
//   //     console.log("onRotate", dist);
//   //     target.style.transform = transform;
//   //   }
//   // )
//   // .on("rotateEnd", ({ target, isDrag, clientX, clientY }) => {
//   //   console.log("onRotateEnd", target, isDrag);
//   // })
//   // .on("scaleStart", ({ target, clientX, clientY }) => {
//   //   console.log("onScaleStart", target);
//   // })
//   // .on(
//   //   "scale",
//   //   ({ target, scale, dist, delta, transform, clientX, clientY }) => {
//   //     console.log("onScale scale", scale);
//   //     target.style.transform = transform;
//   //   }
//   // )
//   // .on("scaleEnd", ({ target, isDrag, clientX, clientY }) => {
//   //   console.log("onScaleEnd", target, isDrag);
//   // })
//   // .on(
//   //   "drag",
//   //   ({
//   //     target,
//   //     transform,
//   //     left,
//   //     top,
//   //     right,
//   //     bottom,
//   //     beforeDelta,
//   //     beforeDist,
//   //     delta,
//   //     dist,
//   //     clientX,
//   //     clientY
//   //   }) => {
//   //     console.log("onDrag left, top", left, top);
//   //     target.style.left = `${left}px`;
//   //     target.style.top = `${top}px`;
//   //     // console.log("onDrag translate", dist);
//   //     target.style.transform = transform;
//   //   }
//   // )
//   // .on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
//   //   console.log("onDragEnd", target, isDrag);
//   // });

//   return moveable;
// }

// function editor(target) {
//   const { translate, scale, rotate } = frame;

//   target.style.transform = `translate(${translate[0]}px, ${translate[1]}px) scale(${scale[0]}, ${scale[1]}) rotate(${rotate}deg)`;
// }

// function UnRotate(bin) {
//   console.log("unrotate");

//   moveable = new Moveable(document.body, {
//     // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
//     target: bin,
//     draggable: false
//   });
//   return moveable;
// }
