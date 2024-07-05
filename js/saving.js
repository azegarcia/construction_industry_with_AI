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

let messagesRef = firebase.database()
    .ref('collected_data').child('activity');

let messagesRef1 = firebase.database()
    .ref('collected_data').child('workers');

let messagesRef2 = firebase.database()
    .ref('collected_data').child('equipments');

document.getElementById('inputForm')
    .addEventListener('submit', submitForm);

document.getElementById('workerForm')
    .addEventListener('submit', submitForm1);

document.getElementById('equipmentForm')
    .addEventListener('submit', submitForm2);


// document.querySelector('#projectDrop').addEventListener('change', () => {console.log('test')});

$('#projectDrop').change(function () {
    console.log($(this).val());
    let params = new URLSearchParams();
    params.set('projectname', $(this).val());
    window.location.href = window.location.pathname + '?' + params.toString();
})

function getQueryParams() {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    return params;
}
function submitForm(e) {
    e.preventDefault();

    // Get values
    let pname = getInputVal('pname');
    let startDate = getInputVal('startDate');
    let itemL = getInputVal('itemL');
    let aname = getInputVal('aname');
    let impre = getInputVal('impre');
    let timeA = getInputVal('timeA');
    let timeM = getInputVal('timeM');
    let timeB = getInputVal('timeB');

    saveMessage(pname, startDate, itemL, aname, impre, timeA, timeM, timeB);
    document.getElementById('inputForm').reset();
    toDatabase();
}

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

// Save message to firebase
function saveMessage(pname, startDate, itemL, aname, impre, timeA, timeM, timeB) {
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        pname: pname,
        startDate: startDate,
        itemL: itemL,
        aname: aname,
        impre: impre,
        timeA: timeA,
        timeM: timeM,
        timeB: timeB,
        timeT: (parseInt(timeA) + 4 * (parseInt(timeM)) + parseInt(timeB)) / 6
    });
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

// Function to download the CSV file
const download = (data, projectName, getDate) => {
    // Create a Blob with the CSV data and type
    const blob = new Blob([data], { type: 'text/csv' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor tag for downloading
    const a = document.createElement('a');

    // Set the URL and download attribute of the anchor tag
    a.href = url;
    a.download = 'download_' + projectName + '_' + getDate + '.csv';

    // Trigger the download by clicking the anchor tag
    a.click();
}

const dateToday = () => {
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var secs = today.getSeconds();

    today = mm + '-' + dd + '-' + yyyy + '_' + hour + minute + secs;
    return today;
}

// Function to create a CSV string from an object
const csvmaker = (data) => {
    // Get the keys (headers) of the object
    var headers = data.headers;

    // Get the values of the object
    var values = data.values;
    var rows = [];
    for (var i = 0; i < values.length; i++) {
        rows.push(values[i].join(','));
    }

    console.log(rows);
    // Join the headers and values with commas and newlines to create the CSV string
    console.log([headers.join(','), rows.join('\n')].join('\n'));
    return [headers.join(','), rows.join('\n')].join('\n');
}

async function get(getDate) {
    var rows = [];
    for (var j = 0; j < $('#act-table tbody > tr').length; j++) {
        var itemChar = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[0].textContent;
        var impre = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[3].textContent;
        var timeT = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[7].textContent;

        var projectName = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[1].textContent;
        if (impre.toUpperCase() === 'START') {
            impre = '-'
        }
        rows.push([itemChar, impre, timeT]);
    }

    var csvData = {
        headers: ['ac', 'pr', 'du'],
        values: rows,
    }
    // Create the CSV string from the data
    const csvdata = csvmaker(csvData);
    console.log(csvData);

    // Download the CSV file
    download(csvdata, projectName, getDate);
    var csvName = 'download_' + projectName + ' ' + getDate;
    await runPertCPM(csvName, csvData);

    let params = new URLSearchParams();
    params.set('file', csvName);


    return "/pertcpm.html?" + params.toString();
}

async function runPertCPM(name, data) {
    console.log('runPertCPM', runPertCPM);

    const json = JSON.stringify({ 'cpm_data': data });


    const res = await axios.post('http://localhost:5000/cpm/' + name, json, {
        headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
        }
    });

    console.log(res.data);
}

async function myPert() {
    var getDate = dateToday();
    var params = await get(getDate);
    window.location.href = params;
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
function toDatabase() {
    var params = getQueryParams();
    var projectName = params.projectname ? params.projectname : '';
    var database = firebase.database();
    var projectNameList = [];
    database.ref('collected_data').child('activity').orderByChild('itemL').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var projectList = '';
            var n = 0;
            snapshot.forEach(function (data) {
                // console.log('data', data.key);  getting key of the row
                var val = data.val();
                if (projectName === "All" || projectName === '' || projectName.trim() === val.pname.trim()) {
                    content += `<tr id='${data.key}'>`;
                    content += '<td>' + val.itemL + '</td>';
                    content += '<td>' + val.pname + '</td>';
                    content += '<td>' + val.aname + '</td>';
                    content += '<td>' + val.impre + '</td>';
                    content += '<td>' + val.timeA + '</td>';
                    content += '<td>' + val.timeM + '</td>';
                    content += '<td>' + val.timeB + '</td>';
                    content += '<td>' + val.timeT + '</td>';
                    content += `<td>
                                    <button type="button" class="btn btn-danger" onclick="deleteRow('${data.key}')">Remove</button>
                                </td>`;
                    content += '</tr>';
                }
                if (!projectNameList.includes(val.pname)) {
                    projectNameList.push(val.pname);

                    projectList += projectName == val.pname ? '<option selected>' + val.pname + '</option>' : '<option>' + val.pname + '</option>';
                }
            });
            $('#act-table').append(content);
            $('#projectDrop').append(projectList);
        }
    });
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

toDatabase();
toDatabase1();
toDatabase2();
