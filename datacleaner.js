var packer = new BinPack();
var rlist = [];

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
      new Rect(index, undefined, undefined, dimensions[index][0], dimensions[index][1])
    );
  }

  var dvExcel = document.getElementById("dvExcel");
  dvExcel.innerHTML = "";
  dvExcel.appendChild(table);
}

function Run() {
  packer.addAll(rlist);
  console.log("all boxes\n", rlist);
  Unpack();
  console.log("Positioned boxes\n", packer.positioned);
  console.log("Unpositioned boxes\n", packer.unpositioned);

}

function Unpack(){

  var tbUnpack = document.getElementById("tbUnpack");
  tbUnpack.border = 1

  var header = tbUnpack.insertRow(0);
  var hd1 = header.insertCell(0);
  var hd2 = header.insertCell(1);
  hd1.innerHTML = "Positioned Boxes"
  hd2.innerHTML = "Unpositioned Boxes"

  var unpackSize = 0;
  (packer.positioned.length > packer.unpositioned.length) ? unpackSize = packer.positioned.length : unpackSize = packer.unpositioned.length;

  for (var i = 0; i < unpackSize; i++){

    var packedBox = tbUnpack.insertRow(-1);
    var pb1 = packedBox.insertCell(0);
    var pb2 = packedBox.insertCell(1);
    if(i < packer.positioned.length)
        pb1.innerHTML = packer.positioned[i]["index"]
    
    if(i < packer.unpositioned.length)
        pb2.innerHTML = packer.unpositioned[i]["index"]
  }


}