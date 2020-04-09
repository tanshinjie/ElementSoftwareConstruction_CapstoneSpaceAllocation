// sdgervrelvbre;
let rlist = [];
var positioned = [];
var unpositioned = [];
var scale = 50;
var numberOfBox = 0;

function Upload() {
  //Reference the FileUpload element.
  // var fileUpload = document.getElementById("fileUpload");
  var fileUpload = document.getElementById("uploaded-excel");

  // THARUN DID SMTG
  //Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof FileReader != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsBinaryString) {
        reader.onload = function (e) {
          ProcessExcel(e.target.result);
        };
        reader.readAsBinaryString(fileUpload.files[0]);
      } else {
        //For IE Browser.
        reader.onload = function (e) {
          var data = "";
          var bytes = new Uint8Array(e.target.result);
          for (var i = 0; i < bytes.byteLength; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          ProcessExcel(data);
        };
        reader.readAsArrayBuffer(fileUpload.files[0]);
      }
    } else {
      alert("This browser does not support HTML5.");
    }
  } else {
    alert("Please upload a valid Excel file.");
  }
}
function ProcessExcel(data) {
  //Read the Excel File data.
  var workbook = XLSX.read(data, {
    type: "binary",
  });

  //Fetch the name of First Sheet.
  var firstSheet = workbook.SheetNames[0];

  /////////////////////
  var excelRows = XLSX.utils.sheet_to_row_object_array(
    workbook.Sheets[firstSheet]
  );

  console.log(excelRows);

  //Create a HTML Table element.
  var table = document.createElement("table");
  table.border = "1";

  //Add the header row.
  var row = table.insertRow(-1);

  //Add the header cells.
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = "Exhibit";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Project";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Tag";
  row.appendChild(headerCell);

  headerCell = document.createElement("TH");
  headerCell.innerHTML = "Allocation";
  row.appendChild(headerCell);

  dimensions = [];
  tags = [];
  projIDs = [];
  //Add the data rows from Excel file.
  for (var i = 1; i < excelRows.length; i++) {
    //Add the data row.
    var row = table.insertRow(-1);

    //Add the data cells.
    var cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].Exhibit;

    var projName = "__EMPTY";
    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i][projName];

    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].Tag;

    cell = row.insertCell(-1);
    cell.id = "assign" + i;
    cell.innerHTML = "Unallocated";

    // cell = row.insertCell(-1);
    // cell.innerHTML = excelRows[i][projID];

    spaceNeeded = "Showcase Space Needed: L x W x H";
    var dimension = excelRows[i][spaceNeeded];
    if (dimension != undefined) {
      d = dimension.split("x");
      for (let index = 0; index < d.length; index++) {
        // d[index] = parseInt(d[index].replace(/[^0-9\.]/g, ""), 10);
        d[index] = parseFloat(d[index].replace(/^[+-]?\d+(\.\d+)?$/g, ""));
      }
      dimensions.push(d);
    }

    var tag = excelRows[i].Tag;

    tags.push(tag);
    projIDs.push(excelRows[i].Exhibit);
  }

  for (let index = 0; index < dimensions.length; index++) {
    rlist.push(
      new Rect(
        undefined,
        undefined,
        dimensions[index][0],
        dimensions[index][1],
        tags[index],
        projIDs[index]
      )
    );
  }

  var tablescroll = document.getElementById("table-scroll");
  tablescroll.innerHTML = "";
  tablescroll.appendChild(table);

  ////////////////////
  // Read all rows from First Sheet into an JSON array.
  // var excelRows = XLSX.utils.sheet_to_row_object_array(
  //   workbook.Sheets[firstSheet]
  // );

  // //Create a HTML Table element.
  // var table = document.createElement("table");
  // table.border = "1";

  // //Add the header row.
  // var row = table.insertRow(-1);

  // //Add the header cells.
  // var headerCell = document.createElement("TH");
  // headerCell.innerHTML = "Exhibit";
  // row.appendChild(headerCell);

  // headerCell = document.createElement("TH");
  // headerCell.innerHTML = "Project";
  // row.appendChild(headerCell);
  // dimensions = [];

  // //Add the data rows from Excel file.
  // for (var i = 1; i < excelRows.length; i++) {
  //   //Add the data row.
  //   var row = table.insertRow(-1);

  //   //Add the data cells.
  //   var cell = row.insertCell(-1);
  //   cell.innerHTML = excelRows[i].Exhibit;

  //   spaceNeeded = "Showcase Space Needed: L x W x H";
  //   cell = row.insertCell(-1);
  //   cell.innerHTML = excelRows[i][spaceNeeded];

  //   var dimension = excelRows[i][spaceNeeded];
  //   if (dimension != undefined) {
  //     d = dimension.split("x");
  //     for (let index = 0; index < d.length; index++) {
  //       d[index] = parseInt(d[index].replace(/[^0-9\.]/g, ""), 10);
  //     }
  //     dimensions.push(d);
  //   }
  // }
  // for (let index = 0; index < dimensions.length; index++) {
  //   rlist.push(
  //     new Rect(
  //       index,
  //       undefined,
  //       undefined,
  //       dimensions[index][0],
  //       dimensions[index][1]
  //     )
  //   );
  // }
  // var dvExcel = document.getElementById("dvExcel");
  // dvExcel.innerHTML = "";
  // dvExcel.appendChild(table);
}

function List(group, positioned) {
  divTable = document.createElement("div");

  //Create a HTML Table element.
  var table = document.createElement("table");
  table.border = "1";

  //Add the header row.
  var row = table.insertRow(-1);

  //Add the header cells.
  var headerCell = document.createElement("TH");
  headerCell.innerHTML = positioned ? "Positioned" : "Unpositioned";
  row.appendChild(headerCell);

  //Add the data rows from Excel file.
  for (var i = 1; i < group.length; i++) {
    //Add the data row.
    var row = table.insertRow(-1);

    //Add the data cells.
    var cell = row.insertCell(-1);
    cell.innerHTML = i;

    divTable.innerHTML = "";
    divTable.appendChild(table);
    document.body.appendChild(divTable);
  }
}

function Run() {
  // cWidth = 500;
  // cHeight = 500;
  // let packer = new BinPack(cWidth / scale, cHeight / scale);
  // packer.addAll(rlist);
  // console.log(packer.positioned);
  // console.log(packer.unpositioned);
  let packer;
  let containers = [];
  // unpositioned = rlist;
  let updatedList = [...rlist];

  bins = document.getElementsByClassName("box");
  for (const bin of bins) {
    bin.innerHTML = null;
    containers.push(bin);
  }
  containers.forEach((container) => {
    console.log(container);

    cWidth = parseInt(container.style.width.replace(/[^0-9\.]/g, ""), 10);
    cHeight = parseInt(container.style.height.replace(/[^0-9\.]/g, ""), 10);
    // packer = new BinPack(cWidth / scale, cHeight / scale);
    // console.log(unpositioned);
    // packer.addAll(unpositioned);
    // unpositioned = packer.unpositioned;

    packer = new BinPack(cWidth / scale, cHeight / scale);
    let values = packer.addAll(updatedList);
    updatedList = values[1];
    console.log("updatedList inside", updatedList);

    positioned = packer.positioned;
    // List(positioned, true);
    // console.log("Positioned boxes\n", packer.positioned);
    packer.positioned.forEach((element) => {
      div = document.createElement("div");
      div.id = numberOfBox;
      div.style.left = element.x * scale + "px";
      div.style.top = element.y * scale + "px";
      div.style.width = element.width * scale + "px";
      div.style.height = element.height * scale + "px";
      div.style.position = "absolute";
      div.style.backgroundColor = getColor(element.datum.tag);
      div.style.opacity = "1";
      div.style.border = "1px solid black";
      div.innerHTML = element.datum.projID;
      document.getElementById("assign" + element.datum.projID).innerHTML =
        "Allocated";
      container.appendChild(div);
      numberOfBox++;
    });
    //getElementById("dv").innerHTML = "Allocated";
  });
  // List(unpositioned, false);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getColor(tag) {
  switch (parseInt(tag)) {
    case 1:
      return "#FF5733";
    case 2:
      return "#74FF33";
    case 3:
      return "#33E6ff";
    case 4:
      return "#334CFF";
    case 5:
      return "#DD33FF";
  }
}

// console.log("Unpositioned boxes\n", packer.unpositioned);
// var rlist = [];
// for (i = 0; i < 10; i++) {
//   randomWidth = Math.floor(Math.random() * 10);
//   randomHeight = Math.floor(Math.random() * 10);
//   randomWidth = randomWidth < 2 ? 2 : randomWidth;
//   randomHeight = randomHeight < 2 ? 2 : randomHeight;
//   rlist.push(new Rect(undefined, undefined, randomWidth, randomHeight));
// }
// packer.addAll(rlist);
// packer.positioned.forEach((element, index) => {
//   div = document.createElement("div");
//   div.id = index;
//   div.style.left = element.x * scale + "px";
//   div.style.top = element.y * scale + "px";
//   div.style.width = element.width * scale + "px";
//   div.style.height = element.height * scale + "px";
//   div.style.position = "absolute";
//   div.style.backgroundColor = getRandomColor();
//   document.getElementById("container").appendChild(div);
// });
$(function () {
  $(".table-scroll").scroll(function () {
    $(".table-scroll table").width(
      $(".table-scroll").width() + $(".table-scroll").scrollLeft()
    );
  });

  var tableTdWidths = new Array();
  var tableWidth = 0;
  var tableTr0Width = 0;
  var tableThNum = 0;
  var tableTr1Width = 0;

  // tableWidth = $(".table-scroll table").css("width").replace("px", "");
  tableThNum = $(".table-scroll tr:eq(0)").children("th").length;

  if ($(".table-scroll tr").length == 1) {
    // header only
    if (tableWidth > tableTr0Width) {
      $(".table-scroll tr:eq(0)")
        .children("th")
        .each(function (i) {
          $(this).width(
            parseInt(
              // $(this).css("width").replace("px", "") +
              parseInt(Math.floor((tableWidth - tableTr0Width) / tableThNum))
            ) + "px"
          );
        });
    }
  } else {
    // header and body
    // tableTr1Width = $(".table-scroll tr:eq(1)").css("width").replace("px", "");
    $(".table-scroll tr:eq(1)")
      .children("td")
      .each(function (i) {
        // tableTdWidths[i] = $(this).css("width").replace("px", "");
      });
    $(".table-scroll tr:eq(0)")
      .children("th")
      .each(function (i) {
        if (
          // parseInt($(this).css("width").replace("px", "")) >
          parseInt(tableTdWidths[i])
        ) {
          // tableTdWidths[i] = $(this).css("width").replace("px", "");
        }
      });

    if (tableWidth > tableTr1Width) {
      //set all th td width
      $(".table-scroll tr").each(function (i) {
        $(this)
          .children()
          .each(function (j) {
            $(this).css(
              "min-width",
              parseInt(tableTdWidths[j]) +
                parseInt(
                  Math.floor((tableWidth - tableTr1Width) / tableThNum)
                ) +
                "px"
            );
          });
      });
    } else {
      //method 1 : set all th td width
      $(".table-scroll tr").each(function (i) {
        $(this)
          .children()
          .each(function (j) {
            $(this).css("min-width", tableTdWidths[j] + "px");
          });
      });
    }
  }
});
