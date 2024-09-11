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
let clientName = params.client;
let projectName = params.project;
let coveredPeriod = params.date;
if (projectName) {
    document.getElementById('clientname').textContent = clientName;
    document.getElementById('projectname').textContent = projectName;
    document.getElementById('startingdate').textContent = coveredPeriod;
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
    var amount = document.getElementById('amount').value;
    var previous = document.getElementById('previous').value;
    var thisPeriod = document.getElementById('thisperiod').value;

    saveProject(itemLetter, anamevalue, amount, previous, thisPeriod);
    document.getElementById("add_input").reset();
    toDatabase();
    document.getElementById('add_row').style.display = "none";
}
  
// Save message to firebase
function saveProject(itemL, aname, amount, previous, thisperiod) {
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        itemL: itemL,
        aname: aname,
        pname: projectName,
        cov_period: coveredPeriod,
        contract_amount: amount,
        thisperiod: thisperiod,
        period_amount: amount * thisperiod / 100,
        previous: previous,
        previous_amount: amount * previous / 100,
        cummulative: (parseInt(previous) + parseInt(thisperiod)),
        cummulative_amount: (parseInt(previous_amount) + parseInt(period_amount))
    });
}

function deleteToDatabase(table, key) {
    var database = firebase.database();
    const dbRef = database.ref(`collected_data/${table}/` + key);
    dbRef.remove();
}

function deleteProjectRow(projectKey) {
    deleteToDatabase("activity", projectKey);
    $("#" + projectKey).remove();
}

function toDatabase() {
    $("#act-table tbody > tr").remove();
    var database = firebase.database();
    var params = getQueryParams();
    var projectName = params.project ? params.project : "";
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
                if (!val.cov_period) {
                    content += `<tr id='${data.key}'>`;
                    content += "<td>" + val.itemL + "</td>";
                    content += "<td>" + val.aname + "</td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += "<td></td>";
                    content += `<td>
                    <button type="button" class="btn btn-primary" id="add_${data.key}">Add</button>
                    </td>`;
                    content += `<td>
                    <button type="button" class="btn btn-danger" id="del_${data.key}" disabled>Remove</button>
                    </td>`;

                    activityKey.push(data.key);
                } else {
                    content += `<tr id='${data.key}'>`;
                    content += "<td>" + val.itemL + "</td>";
                    content += "<td>" + val.aname + "</td>";
                    content += "<td>" + val.contract_amount + "</td>";
                    content += "<td></td>";
                    content += "<td>" + val.previous + "</td>";
                    content += "<td>" + val.previous_amount + "</td>";
                    content += "<td>" + val.thisperiod + "</td>";
                    content += "<td>" + val.period_amount + "</td>";
                    content += "<td>" + val.cummulative + "</td>";
                    content += "<td>" + val.cummulative_amount + "%</td>";
                    content += `<td>
                    <button type="button" class="btn btn-primary" id="add_${data.key}" disabled>Add</button>
                    </td>`;
                    content += `<td>
                    <button type="button" class="btn btn-danger" id="del_${data.key}">Remove</button>
                    </td>`;

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
