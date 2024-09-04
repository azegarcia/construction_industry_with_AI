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

function submitProject(e) {
    e.preventDefault();
  
    var anamevalue = document.getElementById('activityname').textContent;
    var itemLetter = document.getElementById('itemLetter').textContent;
    var givenDate = document.getElementById('givendate').value;
    var previous = document.getElementById('previous').value;
    var thisPeriod = document.getElementById('thisperiod').value;

    saveProject(itemLetter, anamevalue, givenDate, previous, thisPeriod);
    document.getElementById("add_input").reset();
    toDatabase();
    document.getElementById('add_row').style.display = "none";
}
  
// Save message to firebase
function saveProject(itemL, aname, givendate, previous, thisperiod) {
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        itemL: itemL,
        aname: aname,
        pname: projectName,
        givendate: givendate,
        thisperiod: thisperiod,
        previous: previous,
        cummulative: (parseInt(previous) + parseInt(thisperiod))
    });
}

function deleteToDatabase(table, key) {
    var database = firebase.database();
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
          var progressKey = [];
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
                    content += `<td>
                    <button type="button" class="btn btn-primary" id="add_${data.key}">Add</button>
                    </td>`;
                    content += `<td>
                    <button type="button" class="btn btn-secondary" id="edit_${data.key}" disabled>Edit</button>
                    </td>`;
                    content += `<td>
                    <button type="button" class="btn btn-danger" id="del_${data.key}" disabled>Remove</button>
                    </td>`;

                    activityKey.push(data.key);
                } else {
                    content += `<tr id='${data.key}' ${bgColor}>`;
                    content += "<td>" + val.itemL + "</td>";
                    content += "<td>" + val.aname + "</td>";
                    content += "<td>" + val.givendate + "</td>";
                    content += "<td>" + val.previous + "%</td>";
                    content += "<td>" + val.thisperiod + "%</td>";
                    content += "<td>" + val.cummulative + "%</td>";

                    if (data.key === projectEdit) {
                        content += `<td>
                        <button type="button" class="btn btn-primary" id="add_${data.key}" disabled>Add</button>
                        </td>`;
                        content += `<td>
                        <button type="button" class="btn btn-secondary" id="edit_${data.key}" disabled>Edit</button>
                        </td>`;
                        content += `<td>
                        <button type="button" class="btn btn-danger" id="del_${data.key}" disabled>Remove</button>
                        </td>`;

                        // whole process for edit
                        document.getElementById('add_row').style.display = "block";
                        document.getElementById('itemLetter').textContent = val.itemL;
                        document.getElementById('activityname').textContent = val.aname;
                        document.getElementById('givendate').value = val.givendate;
                        document.getElementById('previous').value = val.previous;
                        document.getElementById('thisperiod').value = val.thisperiod;
                        // set previous input textbox as read only when edit
                        document.getElementById('previous').readOnly = true;
                        document.getElementById('thisperiod').readOnly = true;
                        document.getElementById("add_input").addEventListener("submit", () => {
                            submitProject;
                            deleteProjectRow(projectEdit);
                            document.getElementById('add_row').style.display = "none";
                            window.location.href = "progress.html?file=" + projectName + "&startdate=" + startDate;
                        });

                    } else {
                        content += `<td>
                        <button type="button" class="btn btn-primary" id="add_${data.key}" disabled>Add</button>
                        </td>`;
                        content += `<td>
                        <button type="button" class="btn btn-secondary" id="edit_${data.key}">Edit</button>
                        </td>`;
                        content += `<td>
                        <button type="button" class="btn btn-danger" id="del_${data.key}">Remove</button>
                        </td>`;
                    }

                    progressKey.push(data.key);
                }
                content += "</tr>";
            }
        });
  
        $("#act-table").append(content);
        

        // FOR ADD
        activityKey.forEach((key) => {
            document.querySelector("#add_" + key).addEventListener("click", () => {
                document.getElementById('add_row').style.display = "block";
                var itemL = document.querySelector('#' + key + '> td:nth-child(1)').textContent;
                var aname = document.querySelector('#' + key + '> td:nth-child(2)').textContent;
                document.getElementById('itemLetter').textContent = itemL;
                document.getElementById('activityname').textContent = aname;
            });
        });

        // FOR EDIT
        progressKey.forEach((key) => {
            document.querySelector("#edit_" + key).addEventListener("click", () => {
                editProjectRow(key);
            });
        });
  
        // FOR DELETE
        progressKey.forEach((key) => {
            document.querySelector("#del_" + key).addEventListener("click", () => {
                deleteProjectRow(key);
            });
        });
    };
    });
};

toDatabase();
