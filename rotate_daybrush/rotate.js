function Rotate(bin) {
  // const moveableBin = document.querySelector(".moveable");
  // const moveableBoxes = document.querySelector(".draggable_wp");
  // const boxes = document.querySelectorAll(".box");
  // var targets = [moveableBin, moveableBoxes];

  // var moveable;
  // for (let index = 0; index < boxes.length; index++) {
  // const element = boxes[index];
  moveable = new Moveable(document.body, {
    // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
    target: bin,
    rotatable: true,
    scalable: true,
    draggable: true,
    keepRatio: false,
    throttleScale: 0,
    throttleDrag: 0,
    throttleRotate: 0
  });
  // }

  // const frames = targets.map(() => ({
  //   translate: [0, 0],
  //   rotate: 0
  // }));
  // moveable
  //   .on("rotateGroupStart", ({ events }) => {
  //     events.forEach((ev, i) => {
  //       const frame = frames[i];

  //       ev.set(frame.rotate);
  //       // If a drag event has already occurred, there is no dragStart.
  //       ev.dragStart && ev.dragStart.set(frame.translate);
  //     });
  //   })
  //   .on("rotateGroup", ({ events }) => {
  //     events.forEach(({ target, beforeRotate, drag }, i) => {
  //       const frame = frames[i];

  //       frame.rotate = beforeRotate;

  //       // get drag event
  //       frame.translate = drag.beforeTranslate;
  //       target.style.transform =
  //         `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) ` +
  //         `rotate(${beforeRotate}deg)`;
  //     });
  //   })
  //   .on("rotateGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
  //     console.log("onRotateGroupEnd", targets, isDrag);
  //   });

  const frame = {
    rotate: 0,
    scale: [1, 1],
    translate: [0, 0]
  };
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
        // target!.style.transform = transform;
      }
    )
    .on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
      console.log("onDragEnd", target, isDrag);
    });

  return moveable;
}
