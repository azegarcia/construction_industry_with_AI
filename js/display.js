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
    document.getElementById('projectlabel').textContent = pname + ' Project Check';
    document.getElementById('schedulelabel').textContent = pname + ' Schedule (Diagram)';
    document.getElementById('manpowerlabel').textContent = pname + ' Man Power Assignment';
    document.getElementById('documentslabel').textContent = pname + ' Documents';
    document.getElementById('sectionPart').style.display = "block";
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
}

toDatabase();
