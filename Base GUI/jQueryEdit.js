function initEditable(numOfBox) {
  console.log("initEditable called");

  $("#bin-" + numOfBox)
    .resizable()
    .rotatable();
  $("#bin-" + numOfBox).draggable();
  $("#bin-" + numOfBox)
    .resizable("disable")
    .rotatable("disable");
  $("#bin-" + numOfBox).draggable("disable");

  let ui_rotate = document.querySelectorAll(".ui-rotatable-handle");
  ui_rotate.forEach((element) => {
    element.style.visibility = "hidden";
  });
}

function startEdit() {
  console.log("startEdit called");
  let bins = document.querySelectorAll(".box");
  $(bins[0]).resizable("enable").rotatable("enable");
  $(bins[0]).draggable("enable");
  let ui_rotate = document.querySelectorAll(".ui-rotatable-handle");
  ui_rotate.forEach((element) => {
    element.style.visibility = "visible";
  });
}

function stopEdit() {
  console.log("stopEdit called");
  let bins = document.querySelectorAll("box");
  bins.forEach((bin) => {
    $(bin).resizable("disable").rotatable("disable");
    $(bin).draggable("disable");
  });
  let ui_rotate = document.querySelectorAll(".ui-rotatable-handle");
  ui_rotate.forEach((element) => {
    element.style.visibility = "hidden";
  });
}
