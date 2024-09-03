let firebaseConfig = {
    apiKey: "AIzaSyAUps0u952FCNFslPPn0VOwtVQLXEg1JnM",
    authDomain: "construction-industry-wi-70272.firebaseapp.com",
    databaseURL: "https://construction-industry-wi-70272-default-rtdb.firebaseio.com",
    projectId: "construction-industry-wi-70272",
    storageBucket: "construction-industry-wi-70272.appspot.com",
    messagingSenderId: "494097993743",
    appId: "1:494097993743:web:85219ddf87e2e9ae75d37a"
};
firebase.initializeApp(firebaseConfig);

let messagesRef = firebase.database().ref("collected_data").child("activity");

function getQueryParams() {
const params = Object.fromEntries(new URLSearchParams(location.search));
return params;
}

var params = getQueryParams();
let projectName = params.file;
let startDate = params.startdate;
if (projectName) {
    document.getElementById('projectname').textContent = projectName;
    document.getElementById('startingdate').textContent = startDate;
}

// Function to get form values
function getInputVal(id) {
    var inputValue = document.getElementById(id).value;
    return inputValue.trim();
}

document.getElementById("add_input").addEventListener("submit", submitProject);

document.getElementById("addprogress").addEventListener("click", () => {
    document.getElementById('add_row').style.display = "block";
    document.getElementById('addprogress').style.display = "none";
});

function submitProject(e) {
    e.preventDefault();

    var formValues = [
        "givendate",
        "previous",
        "thisperiod",
        "cummulative"
    ];

    // Get values
    var projectDetail = {};
  
    formValues.forEach((field) => {
      projectDetail[field] = getInputVal(field);
    });
  
    
    var anameInput = document.getElementById('activityInput').value;
    var itemLetter = "";
    var anamevalue = "";

    if (anameInput == "") {
        itemLetter = document.getElementById('activityname').value;
        anamevalue = document.querySelector('#activityname option:checked').textContent;
    } else {
        itemLetter = document.getElementById('itemLetter').value;
        anamevalue = document.getElementById('activityInput').value;
    }

    saveProject(projectDetail, itemLetter, anamevalue);
    document.getElementById("add_input").reset();
    toDatabase();
    document.getElementById('add_row').style.display = "none";
    document.getElementById('addprogress').style.display = "block";
}
  
// Save message to firebase
function saveProject(projectDetail, itemL, aname) {
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        ...projectDetail,
        itemL: itemL,
        aname: aname,
        pname: projectName
    });
}

function deleteToDatabase(table, key) {
    var database = firebase.database();
    // create DatabaseReference
    const dbRef = database.ref(`collected_data/${table}/` + key);
    dbRef.remove();
}

function editProjectRow(projectKey) {

    window.location.href = window.location.href + "&edit=" + projectKey;
}

function deleteProjectRow(projectKey) {
    deleteToDatabase("activity", projectKey);
    $("#" + projectKey).remove();
}

function toDatabase() {
    $("#act-table tbody > tr").remove();
    var database = firebase.database();
    var params = getQueryParams();
    var projectName = params.file ? params.file : "";
    var projectEdit = params.edit;
    database
      .ref("collected_data")
      .child("activity")
      .orderByChild("itemL")
      .once("value", function (snapshot) {
        if (snapshot.exists()) {
          var content = "";
          var activityKey = [];
          var str = "";
          snapshot.forEach(function (data) {
            var val = data.val();
            if (projectName.toUpperCase().trim() === val.pname.toUpperCase().trim()) {
                var bgColor = 'style="background: #90EE90;"';
                if (!val.givendate) {
                    content += `<tr id='${data.key}'>`;
                    content += "<td>" + val.itemL + "</td>";
                    content += "<td>" + val.aname + "</td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += `<td></td>`;
                    content += `<td></td>`;    
                } else {
                    content += `<tr id='${data.key}' ${bgColor}>`;
                    content += "<td>" + val.itemL + "</td>";
                    content += "<td>" + val.aname + "</td>";
                    content += "<td>" + val.givendate + "</td>";
                    content += "<td>" + val.previous + "</td>";
                    content += "<td>" + val.thisperiod + "</td>";
                    content += "<td>" + val.cummulative + "</td>";

                    if (data.key === projectEdit) {
                        content += `<td>
                        <button type="button" class="btn btn-primary" id="edit_${data.key}" disabled>Edit</button>
                        </td>`;
                        content += `<td>
                        <button type="button" class="btn btn-danger" id="del_${data.key}" disabled>Remove</button>
                        </td>`;

                        // whole process for edit
                        document.getElementById('addprogress').style.display = "none";
                        document.getElementById('add_row').style.display = "block";
                        document.getElementById('activityname').style.display = "none";
                        document.getElementById('itemLetter').style.display = "block";
                        document.getElementById('itemLetter').value = val.itemL;
                        document.getElementById('activityInput').style.display = "block";
                        document.getElementById('activityInput').value = val.aname;
                        document.getElementById('givendate').value = val.givendate;
                        document.getElementById('previous').value = val.previous;
                        document.getElementById('thisperiod').value = val.thisperiod;
                        document.getElementById('cummulative').value = val.cummulative;
                        document.getElementById("add_input").addEventListener("submit", () => {
                            submitProject;
                            deleteProjectRow(projectEdit);
                            document.getElementById('add_row').style.display = "none";
                            document.getElementById('addprogress').style.display = "block";
                            window.location.href = "progress.html?file=" + projectName + "&startdate=" + startDate;
                        });

                    } else {
                        content += `<td>
                        <button type="button" class="btn btn-primary" id="edit_${data.key}">Edit</button>
                        </td>`;
                        content += `<td>
                        <button type="button" class="btn btn-danger" id="del_${data.key}">Remove</button>
                        </td>`;
                    }

                    activityKey.push(data.key);
                }
            
                content += "</tr>";

                str += `<option value='${val.itemL}'>` + val.aname + "</option>"
                document.getElementById("activityname").innerHTML = str;
            }
        });
  
        $("#act-table").append(content);
        console.log(activityKey)

        // FOR EDIT
        activityKey.forEach((key) => {
            document.querySelector("#edit_" + key).addEventListener("click", () => {
                editProjectRow(key);
            });
        });
  
        // FOR DELETE
        activityKey.forEach((key) => {
            document.querySelector("#del_" + key).addEventListener("click", () => {
                deleteProjectRow(key);
            });
        });
    };
    });
};

toDatabase();
