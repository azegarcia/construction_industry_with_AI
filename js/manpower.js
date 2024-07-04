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

let messagesRef1 = firebase.database()
    .ref('collected_data').child('workers');

let messagesRef2 = firebase.database()
    .ref('collected_data').child('equipments');

document.getElementById('workerForm')
    .addEventListener('submit', submitForm1);

document.getElementById('equipmentForm')
    .addEventListener('submit', submitForm2);

function submitForm1(e) {
    e.preventDefault();

    // Get values
    let labor = getInputVal('labor');
    let laborQuantity = getInputVal('laborQuantity');
    let laborHours = getInputVal('laborHours');
    let laborSalary = getInputVal('laborSalary');

    saveMessage1(labor, laborQuantity, laborHours, laborSalary);
    document.getElementById('workerForm').reset();
    toDatabase1();
}

function submitForm2(e) {
    e.preventDefault();

    // Get values
    let equipment = getInputVal('equipment');
    let equipmentQuantity = getInputVal('equipmentQuantity');
    let equipmentDays = getInputVal('equipmentDays');
    let equipmentCost = getInputVal('equipmentCost');

    saveMessage2(equipment, equipmentQuantity, equipmentDays, equipmentCost);
    document.getElementById('equipmentForm').reset();
    toDatabase2();
}

// Function to get form values
function getInputVal(id) {
    return document.getElementById(id).value;
}

function saveMessage1(labor, laborQuantity, laborHours, laborSalary) {
    let newMessageRef = messagesRef1.push();
    newMessageRef.set({
        labor: labor,
        laborQuantity: laborQuantity,
        laborHours: laborHours,
        laborSalary: laborSalary,
        laborTotal: parseInt(laborQuantity) * parseInt(laborHours) * parseInt(laborSalary)
    });
}

function saveMessage2(equipment, equipmentQuantity, equipmentDays, equipmentCost) {
    let newMessageRef = messagesRef2.push();
    newMessageRef.set({
        equipment: equipment,
        equipmentQuantity: equipmentQuantity,
        equipmentDays: equipmentDays,
        equipmentCost: equipmentCost,
        equipmentTotal: parseInt(equipmentQuantity) * parseInt(equipmentDays) * parseInt(equipmentCost)
    });
}

function deleteRow(projectKey) {
    console.log('projectKey', projectKey);
    deleteToDatabase('activity', projectKey);
    $("#" + projectKey).remove();
}

function deleteToDatabase(table, key) {
    var database = firebase.database();
    // create DatabaseReference
    const dbRef = database.ref(`collected_data/${table}/` + key);
    dbRef.remove();
    console.log("dbRef" + dbRef);
    // remove(dbRef).then(() => console.log("Deleted"))
}

function toDatabase1() {
    var database = firebase.database();
    database.ref('collected_data').child('workers').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var totalContent = '';
            snapshot.forEach(function (data) {
                var val = data.val();
                // console.log('data', data.key);  getting key of the row
                content += '<tr>';
                content += '<td>' + val.labor + '</td>';
                content += '<td>' + val.laborQuantity + '</td>';
                content += '<td>' + val.laborHours + '</td>';
                content += '<td>' + val.laborSalary + '</td>';
                content += '<td><button type="submit" class="btn btn-danger">Remove</button></td>';
                content += '</tr>';

                totalContent += '<tr>';
                totalContent += '<td>' + val.labor + ': ₱ ' + val.laborTotal + '</td>';
                totalContent += '<tr>';
            });
            $('#worker-table').append(content);
            $('#result-table').append(totalContent);
        }
    });
}

function toDatabase2() {
    var database = firebase.database();
    database.ref('collected_data').child('equipments').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var totalContent = '';
            snapshot.forEach(function (data) {
                var val = data.val();
                // console.log('data', data.key);  getting key of the row
                content += '<tr>';
                content += '<td>' + val.equipment + '</td>';
                content += '<td>' + val.equipmentQuantity + '</td>';
                content += '<td>' + val.equipmentDays + '</td>';
                content += '<td>' + val.equipmentCost + '</td>';
                content += '<td><button type="submit" class="btn btn-danger">Remove</button></td>';
                content += '</tr>';

                totalContent += '<tr>';
                totalContent += '<td>' + val.equipment + ': ₱ ' + val.equipmentTotal + '</td>';
                totalContent += '<tr>';
            });
            $('#equipment-table').append(content);
            $('#result-table').append(totalContent);
        }
    });
}
toDatabase1();
toDatabase2();
