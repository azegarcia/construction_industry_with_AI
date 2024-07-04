axios.get('http://localhost:5000/weather')
    .then(function (response) {
        var res = response.data;
        var data = res.data;
        // handle success
        console.log(data);
        if (data.length > 0) {
            var temp = "";
            data.forEach((itemData) => {
              temp += "<tr>";
              temp += "<td>6 am</td>";
              temp += "<td>" + itemData.six_am + "</td>";
              temp += "<td>" + itemData.six_am_status + "</td>";
              temp += "<tr>";
              temp += "<tr>";
              temp += "<td>9 am</td>";
              temp += "<td>" + itemData.nine_am + "</td>";
              temp += "<td>" + itemData.nine_am_status + "</td>";
              temp += "<tr>";
              temp += "<tr>";
              temp += "<td>12 pm</td>";
              temp += "<td>" + itemData.twelve_pm + "</td>";
              temp += "<td>" + itemData.twelve_pm_status + "</td>";
              temp += "<tr>";
              temp += "<tr>";
              temp += "<td>3 pm</td>";
              temp += "<td>" + itemData.three_pm + "</td>";
              temp += "<td>" + itemData.three_pm_status + "</td>";
              temp += "<tr>";
              temp += "<tr>";
              temp += "<td>6 pm</td>";
              temp += "<td>" + itemData.six_pm + "</td>";
              temp += "<td>" + itemData.six_pm_status + "</td>";
              temp += "<tr>";
            });
            document.getElementById('data').innerHTML = temp;
          }
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });