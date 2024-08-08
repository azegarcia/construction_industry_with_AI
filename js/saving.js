import { projectValidation } from "./project.js";

let firebaseConfig = {
  apiKey: "AIzaSyAUps0u952FCNFslPPn0VOwtVQLXEg1JnM",
  authDomain: "construction-industry-wi-70272.firebaseapp.com",
  databaseURL:
    "https://construction-industry-wi-70272-default-rtdb.firebaseio.com",
  projectId: "construction-industry-wi-70272",
  storageBucket: "construction-industry-wi-70272.appspot.com",
  messagingSenderId: "494097993743",
  appId: "1:494097993743:web:85219ddf87e2e9ae75d37a",
};
firebase.initializeApp(firebaseConfig);

let messagesRef = firebase.database().ref("collected_data").child("activity");

let messagesRef1 = firebase.database().ref("collected_data").child("workers");

let messagesRef2 = firebase
  .database()
  .ref("collected_data")
  .child("equipments");

function getParams() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  return params;
}

let params = getParams()
let client = params.get('clientname');
let project = params.get('projectname').toUpperCase();
let sdate = params.get('startdate');

var items;
if (project.includes("ROAD")) {
  items = ["", "Site Preparation", "Earthworks and Grading", "Drainage and Utilities", "Subbase and Base Course Construction", "Paving", "Curbs, Gutters, and Sidewalks", "Guardrails and Barriers", "Traffic Control Devices", "Quality Control and Testing", "Final Touches", "Others"]
} else if (project.includes("REPLACE")) {
  items = ["", "Preparation", "Removing Damaged Tiles", "Preparing the Surface", "Applying Adhesive", "Placing the New Tile", "Grouting", "Cleaning and Finishing", "Sealing", "Final Inspection", "Others"]
} else if (project.includes("BUILDING")) {
  items = ["", "Site Preparation", "Foundation Work", "Structural Framework", "Roof Construction", "Wall Construction", "Windows and Doors", "Mechanical, Electrical, and Plumbing (MEP) Work", "Interior Finishes", "Exterior Finishes", "Final Inspections and Handover", "Others"]
} else if (project.includes("FENCE")) {
  items = ["", "Site Preparation", "Foundation Work", "Post Installation", "Installing Fence Panels/Materials", "Gates Installation", "Finishing Touches", "Inspection and Testing", "Cleanup", "Others"]
} else if (project.includes("PIPING")) {
  items = ["", "Site Preparation", "Demolition and Removal", "Excavation and Trenching", "Piping Installation", "Valve and Fitting Installation", "Pressure Testing", "Insulation and Coating", "Instrumentation and Control Installation", "System Integration", "Commissioning", "Site Cleanup", "Others"]
} else if (project.includes("BRIDGE")) {
  items = ["", "Site Preparation", "Excavation and Earthworks", "Foundation Work", "Substructure Construction", "Superstructure Construction", "Deck Construction", "Bridge Parapets and Barriers", "Utilities and Drainage", "Roadway and Approach Work", "Quality Control and Testing", "Final Touches", "Others"]
} else if (project.includes("ELECTRICAL")) {
  items = ["", "Site Preparation", "Foundation Work", "Installation of Substations", "Cable Laying and Trenching", "Overhead Line Installation", "Installation of Switchgear and Transformers", "Installation of Protective Relays and Control Systems", "Installation of Backup Power Systems", "Lighting and Earthing Systems", "Auxiliary Systems Installation", "System Integration and Testing", "Final Inspections and Approvals", "Others"]
} else if (project.includes("GUTTER")) {
  items = ["", "Preparation and Safety Measures", "Removal of Old Gutters", "Cleaning and Inspection", "Measuring and Cutting New Gutters", "Installing the Gutters", "Sealing and Securing", "Installing Downspouts", "Final Inspection and Testing", "Cleanup", "Others"]
} else if (project.includes("CLASSROOM")) {
  items = ["", "Site Preparation and Demolition", "Structural Work", "Plumbing and Electrical Work", "HVAC Installation", "Framing and Drywall", "Flooring Installation", "Painting and Finishing", "Install Fixtures and Fittings", "Final Inspection and Touch-Ups", "Clean-Up and Final Preparation", "Others"]
} else if (project.includes("FACILITY")) {
  items = ["", "Assessment and Planning", "Site Preparation", "Structural Work", "Plumbing and Electrical Work", "HVAC Installation", "Isolation and Safety Features", "Interior Finishes", "Install Fixtures and Equipment", "Final Inspection and Testing", "Clean-Up and Preparation for Use", "Others"]
} else {
  items = ["", "Site Preparation", "Excavation and Foundation", "Substructure Work", "Framing", "Roofing", "Exterior Work", "Interior Work", "Mechanical, Electrical, and Plumbing (MEP) Work", "Interior Finishes", "Kitchen and Bathroom Installation", "Exterior Landscaping", "Quality Control and Inspections", "Final Touches", "Others"]
}
var str = ""
for (var item of items) {
  str += "<option>" + item + "</option>"
}
document.getElementById("aname").innerHTML = str;

$("#aname").change(function () {
  if (this.value.includes('Others')){
      document.getElementById('anameInput').style.display = "block";
  }
  else {
      document.getElementById('anameInput').style.display = "none";
  }
});

document.getElementById('header').textContent = "Setting Immediate Predecessors & Time Estimates for " + client + " " + project;

document.getElementById("inputForm").addEventListener("submit", submitProject);

document.getElementById("workerForm").addEventListener("submit", submitForm1);

document.getElementById("action").addEventListener("click", myPert);

document
  .getElementById("equipmentForm")
  .addEventListener("submit", submitForm2);

$("#projectDrop").change(function () {
  let params = new URLSearchParams();
  params.set("projectname", $(this).val());
  window.location.href = window.location.pathname + "?" + params.toString();
});

function getQueryParams() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  return params;
}
function submitProject(e) {
  e.preventDefault();

  var formValues = [
    "itemL",
    "aname",
    "impre",
    "timeA",
    "timeM",
    "timeB",
  ];

  var invalid = false;
  formValues.every((el) => {
    var [isValid, errorMessage] = isFieldValid(el);
    if (!isValid) {
      invalid = true;
      $("#" + el).focus();
      alert(errorMessage);
      return false;
    }
    return true;
  });

  if (invalid) {
    return;
  }
  // Get values

  var projectDetail = {};

  formValues.forEach((field) => {
    projectDetail[field] = getInputVal(field);
  });

  var anamevalue = document.getElementById('aname').value;
  if (anamevalue.includes("Others")) {
    aname = document.getElementById('anameInput').value;
  } else {
    aname = document.getElementById('aname').value;
  }

  saveProject(projectDetail, aname);
  document.getElementById("inputForm").reset();
  toDatabase();
}

function submitForm1(e) {
  e.preventDefault();

  // Get values
  let labor = getInputVal("labor");
  let laborQuantity = getInputVal("laborQuantity");
  let laborHours = getInputVal("laborHours");
  let laborSalary = getInputVal("laborSalary");

  saveMessage1(labor, laborQuantity, laborHours, laborSalary, project);
  console.log(project)
  document.getElementById("workerForm").reset();
  reloadWorkerEquipment();
}

function submitForm2(e) {
  e.preventDefault();

  // Get values
  let equipment = getInputVal("equipment");
  let equipmentQuantity = getInputVal("equipmentQuantity");
  let equipmentDays = getInputVal("equipmentDays");
  let equipmentCost = getInputVal("equipmentCost");

  saveMessage2(equipment, equipmentQuantity, equipmentDays, equipmentCost, project);
  document.getElementById("equipmentForm").reset();
  reloadWorkerEquipment();
}

// Function to get form values
function getInputVal(id) {
  var inputValue = document.getElementById(id).value;
  return inputValue.trim();
}

function isFieldValid(inputId, inputValue) {
  var inputId = document.getElementById(inputId).id;
  var inputValue = document.getElementById(inputId).value;
  return projectValidation(inputId, inputValue);
}

// Save message to firebase
function saveProject(projectDetail, aname) {
  var impre = projectDetail.impre.toUpperCase()
    ? projectDetail.impre.toUpperCase()
    : "START";
  let newMessageRef = messagesRef.push();
  newMessageRef.set({
    ...projectDetail,
    client: client,
    pname: project,
    sdate: sdate,
    aname: aname,
    itemL: projectDetail.itemL.toUpperCase(),
    impre: impre,
    timeT:
      (parseInt(projectDetail.timeA) +
        4 * parseInt(projectDetail.timeM) +
        parseInt(projectDetail.timeB)) /
      6,
  });
}

function saveMessage1(labor, laborQuantity, laborHours, laborSalary, project) {
  let newMessageRef = messagesRef1.push();
  newMessageRef.set({
    client: client,
    pname: project,
    sdate: sdate,
    labor: labor,
    laborQuantity: laborQuantity,
    laborHours: laborHours,
    laborSalary: laborSalary,
    laborTotal:
      parseInt(laborQuantity) * parseInt(laborHours) * parseInt(laborSalary),
  });
}

function saveMessage2(
  equipment,
  equipmentQuantity,
  equipmentDays,
  equipmentCost,
  project
) {
  let newMessageRef = messagesRef2.push();
  newMessageRef.set({
    client: client,
    pname: project,
    sdate: sdate,
    equipment: equipment,
    equipmentQuantity: equipmentQuantity,
    equipmentDays: equipmentDays,
    equipmentCost: equipmentCost,
    equipmentTotal:
      parseInt(equipmentQuantity) *
      parseInt(equipmentDays) *
      parseInt(equipmentCost),
  });
}

// Function to download the CSV file
const download = (data, projectName, getDate) => {
  // Create a Blob with the CSV data and type
  const blob = new Blob([data], { type: "text/csv" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor tag for downloading
  const a = document.createElement("a");

  // Set the URL and download attribute of the anchor tag
  a.href = url;
  a.download = "download_" + projectName + "_" + getDate + ".csv";

  // Trigger the download by clicking the anchor tag
  a.click();
};

const dateToday = () => {
  var today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var minute = today.getMinutes();
  var secs = today.getSeconds();

  today = mm + "-" + dd + "-" + yyyy + "_" + hour + minute + secs;
  return today;
};

// Function to create a CSV string from an object
const csvmaker = (data) => {
  // Get the keys (headers) of the object
  var headers = data.headers;

  // Get the values of the object
  var values = data.values;
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    rows.push(values[i].join(","));
  }

  return [headers.join(","), rows.join("\n")].join("\n");
};

async function get(getDate) {
  var rows = [];
  for (var j = 0; j < $("#act-table tbody > tr").length; j++) {
    var itemChar = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[0]
      .textContent;
    var impre = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[3]
      .textContent;
    var timeT = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[7]
      .textContent;

    var projectName = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[1]
      .textContent;
    if (impre.toUpperCase() === "START") {
      impre = "-";
    }
    rows.push([itemChar, impre, timeT]);
  }

  var csvData = {
    headers: ["ac", "pr", "du"],
    values: rows,
  };
  // Create the CSV string from the data
  const csvdata = csvmaker(csvData);

  // Download the CSV file
  download(csvdata, projectName, getDate);
  var csvName = projectName;
  await runPertCPM(csvName, csvData);

  let params = new URLSearchParams();
  params.set("file", csvName);

  return "/pertcpm.html?" + params.toString();
}

async function runPertCPM(name, data) {
  console.log("runPertCPM", runPertCPM);

  const json = JSON.stringify({ cpm_data: data });

  const res = await axios.post("http://localhost:5000/cpm/" + name, json, {
    headers: {
      // Overwrite Axios's automatically set Content-Type
      "Content-Type": "application/json",
    },
  });

  console.log(res.data);
}

async function myPert() {
  var getDate = dateToday();
  var params = await get(getDate);
  window.location.href = params;
}

function deleteProjectRow(projectKey) {
  deleteToDatabase("activity", projectKey);
  $("#" + projectKey).remove();
  disablePertCPMBtn();
}

function deleteWorkerRow(projectKey) {
  deleteToDatabase("workers", projectKey);
  $("#workers_" + projectKey).remove();
  reloadWorkerEquipment();
}

function deleteEquipmentRow(projectKey) {
  deleteToDatabase("equipments", projectKey);
  $("#equipments_" + projectKey).remove();
  reloadWorkerEquipment();
}

function reloadWorkerEquipment() {
  $("#result-table tbody > tr").remove();
  toDatabase1();
  toDatabase2();
}

function deleteToDatabase(table, key) {
  var database = firebase.database();
  // create DatabaseReference
  const dbRef = database.ref(`collected_data/${table}/` + key);
  dbRef.remove();
}

function toDatabase() {
  $("#act-table tbody > tr").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.projectname ? params.projectname : "";
  database
    .ref("collected_data")
    .child("activity")
    .orderByChild("itemL")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.toUpperCase().trim() === val.pname.trim()) {
            content += `<tr id='${data.key}'>`;
            content += "<td>" + val.itemL + "</td>";
            content += "<td>" + val.aname + "</td>";
            content += "<td>" + val.impre + "</td>";
            content += "<td>" + val.timeA + "</td>";
            content += "<td>" + val.timeM + "</td>";
            content += "<td>" + val.timeB + "</td>";
            content += "<td>" + val.timeT + "</td>";
            content += `<td>
                          <button type="button" class="btn btn-danger" id="btn_${data.key}"">Remove</button>
                        </td>`;
            content += "</tr>";

            activityKey.push(data.key);
          }
        });
        content = content.trim();
        console.log(content)

        if (!content) {
          content = "<tr><td colspan='9'>Project empty.</td></tr>";
          $("#action").prop("disabled", true);
          disablePertCPMBtn();
        }

        $("#act-table").append(content);
        
        activityKey.forEach((key) => {
          document
            .querySelector("#btn_" + key)
            .addEventListener("click", () => {
              deleteProjectRow(key);
            });
        });
      }; 
    });
}

function disablePertCPMBtn() {
  if ($('[id^="btn_"]').length === 0) {
    $("#action").prop("disabled", true);
  }
}

function toDatabase1() {
  $("#worker-table tbody > tr:not(:first-child)").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.projectname ? params.projectname : "";
  database
    .ref("collected_data")
    .child("workers")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var totalContent = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.trim() === val.pname.trim()) {
            content += `<tr id='workers_${data.key}'>`;
            content += "<td>" + val.labor + "</td>";
            content += "<td>" + val.laborQuantity + "</td>";
            content += "<td>" + val.laborHours + "</td>";
            content += "<td>" + val.laborSalary + "</td>";
            content +=
              '<td><button type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.labor +
              "</div><div>₱ " +
              val.laborTotal +
              "</div></td>";
            totalContent += "<tr>";
          }

          activityKey.push(data.key);
        });
        $("#worker-table").append(content);
        $("#result-table").append(totalContent);

        activityKey.forEach((key) => {
          document
            .querySelector("#workers_" + key)
            .addEventListener("click", () => {
              deleteWorkerRow(key);
            });
        });
      }
    });
}

function toDatabase2() {
  $("#equipment-table tbody > tr:not(:first-child)").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.projectname ? params.projectname : "";
  database
    .ref("collected_data")
    .child("equipments")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var totalContent = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.trim() === val.pname.trim()) {
            content += `<tr id='equipments_${data.key}'>`;
            content += "<td>" + val.equipment + "</td>";
            content += "<td>" + val.equipmentQuantity + "</td>";
            content += "<td>" + val.equipmentDays + "</td>";
            content += "<td>" + val.equipmentCost + "</td>";
            content +=
              '<td><button type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.equipment +
              "</div><div>₱ " +
              val.equipmentTotal +
              "</div></td>";
            totalContent += "<tr>";
          }

          activityKey.push(data.key);
        });
        $("#equipment-table").append(content);
        $("#result-table").append(totalContent);

        activityKey.forEach((key) => {
          document
            .querySelector("#equipments_" + key)
            .addEventListener("click", () => {
              deleteEquipmentRow(key);
            });
        });
      }
    });
}

toDatabase();
toDatabase1();
toDatabase2();
