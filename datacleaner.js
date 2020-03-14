var packer = new BinPack(10, 10);
var rlist = [];
var positioned = [];
var unpositioned = [];
var scale = 50;
var numberOfBox = 0;

function Upload() {
  //Reference the FileUpload element.
  var fileUpload = document.getElementById("fileUpload");
  // THARUN DID SMTG
  //Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof FileReader != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsBinaryString) {
        reader.onload = function(e) {
          ProcessExcel(e.target.result);
        };
        reader.readAsBinaryString(fileUpload.files[0]);
      } else {
        //For IE Browser.
        reader.onload = function(e) {
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
    type: "binary"
  });

  //Fetch the name of First Sheet.
  var firstSheet = workbook.SheetNames[0];

  //Read all rows from First Sheet into an JSON array.
  var excelRows = XLSX.utils.sheet_to_row_object_array(
    workbook.Sheets[firstSheet]
  );

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
  headerCell.innerHTML = "Space";
  row.appendChild(headerCell);
  dimensions = [];

  //Add the data rows from Excel file.
  for (var i = 1; i < excelRows.length; i++) {
    //Add the data row.
    var row = table.insertRow(-1);

    //Add the data cells.
    var cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i].Exhibit;

    spaceNeeded = "Showcase Space Needed: L x W x H";
    cell = row.insertCell(-1);
    cell.innerHTML = excelRows[i][spaceNeeded];

    var dimension = excelRows[i][spaceNeeded];
    if (dimension != undefined) {
      d = dimension.split("x");
      for (let index = 0; index < d.length; index++) {
        d[index] = parseInt(d[index].replace(/[^0-9\.]/g, ""), 10);
      }
      dimensions.push(d);
    }
  }
  for (let index = 0; index < dimensions.length; index++) {
    rlist.push(
      new Rect(undefined, undefined, dimensions[index][0], dimensions[index][1])
    );
  }
  var dvExcel = document.getElementById("dvExcel");
  dvExcel.innerHTML = "";
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
  let packer;
  unpositioned = rlist;
  containers = document.querySelectorAll(".container");
  containers.forEach(container => {
    cWidth = parseInt(container.style.width.replace(/[^0-9\.]/g, ""), 10);
    cHeight = parseInt(container.style.height.replace(/[^0-9\.]/g, ""), 10);
    packer = new BinPack(cWidth / scale, cHeight / scale);
    packer.addAll(unpositioned);
    unpositioned = packer.unpositioned;
    positioned = packer.positioned;
    List(positioned, true);
    console.log("Positioned boxes\n", packer.positioned);
    packer.positioned.forEach(element => {
      div = document.createElement("div");
      div.id = numberOfBox;
      div.style.left = element.x * scale + "px";
      div.style.top = element.y * scale + "px";
      div.style.width = element.width * scale + "px";
      div.style.height = element.height * scale + "px";
      div.style.position = "absolute";
      div.style.backgroundColor = getRandomColor();
      div.style.opacity = "0.5";
      container.appendChild(div);
      numberOfBox++;
    });
  });
  List(unpositioned, false);

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
  console.log("Unpositioned boxes\n", packer.unpositioned);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
