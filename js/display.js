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

function showDiv(pname) {
    let params = new URLSearchParams();
    params.set("projectname", pname);
    window.location.href = window.location.pathname + "?" + params.toString();
}
  
function getQueryParams() {
const params = Object.fromEntries(new URLSearchParams(location.search));
return params;
}

function nextPage(loc) {
    var params = getQueryParams();
    var projectName = params.projectname;
    window.location = loc + "?projectname=" + projectName;
}

function toDatabase() {
    var database = firebase.database();
    var projectNameList = [];
    database.ref('collected_data').child('activity').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var n = 0;
            snapshot.forEach(function (data) {
                // console.log('data', data.key);  getting key of the row
                var val = data.val();
                if (!projectNameList.includes(val.pname)) {
                    projectNameList.push(val.pname);
                    content += `<tr>`;
                    content += '<td>' + val.pname + '</td>';
                    content += '<td>' + val.startDate + '</td>';
                    content += '<td>Ongoing</td>';
                    content += `<td><button type="button" class="btn btn-success" onclick="showDiv('` + val.pname + `'); return false;">Select</button>
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
        document.getElementById('projectlabel').textContent = projectName + ' Project Check';
        document.getElementById('schedulelabel').textContent = projectName + ' Schedule (Diagram)';
        document.getElementById('manpowerlabel').textContent = projectName + ' Man Power Assignment';
        document.getElementById('documentslabel').textContent = projectName + ' Documents';
        document.getElementById('sectionPart').style.display = "block";
    }
    else {
        document.getElementById('projectlabel2').textContent = 'No Project Selected';
        document.getElementById('noSectionPart').style.display = "block";
    }
}

toDatabase();
