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

function showDiv(client, pname, sdate) {
    window.location.href = window.location.pathname + "?clientname=" + client + "&projectname=" + pname + "&startdate=" + sdate;
}
  
function getQueryParams() {
const params = Object.fromEntries(new URLSearchParams(location.search));
return params;
}

function nextPage(loc) {
    var params = getQueryParams();
    var projectName = params.projectname;
    window.location = loc + "?file=" + projectName;
}

function editPage(loc) {
    var params = getQueryParams();
    var clientName = params.clientname;
    var projectName = params.projectname;
    var startDate = params.startdate;
    window.location = loc + "?clientname=" + clientName + "&projectname=" + projectName + "&startdate=" + startDate;
}

function toDatabase() {
    var database = firebase.database();
    var projectNameList = [];
    database.ref('collected_data').child('activity').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            snapshot.forEach(function (data) {
                // console.log('data', data.key);  getting key of the row
                var val = data.val();
                if (!projectNameList.includes(val.pname)) {
                    projectNameList.push(val.pname);
                    content += `<tr>`;
                    content += '<td>' + val.client + '</td>';
                    content += '<td>' + val.pname + '</td>';
                    content += '<td>' + val.sdate + '</td>';
                    content += `<td><button type="button" class="btn btn-success" onclick="showDiv('` + val.client + `','` + val.pname + `','` + val.sdate + `'); return false;">Select</button>
                                </td>`;
                    content += '</tr>';
                }
            });
            $('#client_list').append(content);
        }
    });
    var params = getQueryParams();
    var projectName = params.projectname;
    if (projectName) {
        document.getElementById('editproject').textContent = "Edit " + projectName + ' Project';
        document.getElementById('projectlabel').textContent = projectName + ' Project Check';
        document.getElementById('schedulelabel').textContent = projectName + ' Schedule (Diagram)';
        document.getElementById('manpowerlabel').textContent = projectName + ' Man Power, Equipment Assignment and Overtime Calculations';
        document.getElementById('documentslabel').textContent = projectName + ' Documents';
        document.getElementById('sectionPart').style.display = "block";
    }
    else {
        document.getElementById('projectlabel2').textContent = 'No Project Selected';
        document.getElementById('noSectionPart').style.display = "block";
    }
}

toDatabase();
