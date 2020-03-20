
const moveableBin = document.querySelector(".moveable");
const moveableBoxes = document.querySelector(".draggable_wp");
var targets = [moveableBin, moveableBoxes];

const moveable = new Moveable(document.body, {
  // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
  target: moveableBin,
  rotatable: true,
});

const frames = targets.map(() => ({
  translate: [0, 0],
  rotate: 0,
}));
moveable.on("rotateGroupStart", ({ events }) => {
  events.forEach((ev, i) => {
      const frame = frames[i];

      ev.set(frame.rotate);
      // If a drag event has already occurred, there is no dragStart.
      ev.dragStart && ev.dragStart.set(frame.translate);
  });
}).on("rotateGroup", ({ events }) => {
  events.forEach(({ target, beforeRotate, drag }, i) => {
      const frame = frames[i];

      frame.rotate = beforeRotate;

      // get drag event
      frame.translate = drag.beforeTranslate;
      target.style.transform
          = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) `
          + `rotate(${beforeRotate}deg)`;
  });
}).on("rotateGroupEnd", ({ targets, isDrag, clientX, clientY }) => {
  console.log("onRotateGroupEnd", targets, isDrag);
});

const frame = {
  rotate: 0,
};
moveable.on("rotateStart", ({ set }) => {
  set(frame.rotate);
}).on("rotate", ({ target, beforeRotate }) => {
  frame.rotate = beforeRotate;
  target.style.transform = `rotate(${beforeRotate}deg)`;
}).on("rotateEnd", ({ target, isDrag, clientX, clientY }) => {
  console.log("onRotateEnd", target, isDrag);
});