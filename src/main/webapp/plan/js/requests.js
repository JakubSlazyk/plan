const mock = '{"prosby":[{"className":"abc","oldDate":"2018-11-14T09:50:00.000","newDate":"2018-11-13T09:50:00.000","email":"obndzoyt@sharklasers.com"},{"className":"def","oldDate":"2018-11-15T11:40:00.000","newDate":"2018-11-13T13:30:00.000","email":"obndzoyt@sharklasers.com"}]}';

function showRequestsModal(event) {
    $("#requests-modal").modal("show");
    let s = [];
    let obj = JSON.parse(mock).prosby;
    let txt = "<table border='1'>";
    for (x in obj) {
        txt += "<tr><td>" + obj[x].className + " " + obj[x].oldDate + " " + obj[x].newDate + " " + obj[x].email + "</td><td>" +
            "<button type=\"button\" class=\"btn btn-primary\" onclick=\"acceptChangeRequest(" + x + ")\" id=\"accept-request\">Akceptuj</button>\n" +
            "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"declineChangeRequest(" + x + ")\" id=\"decline-request\">Odrzuć</button></td>" +
            "</tr>";
    }
    txt += "</table>";
    document.getElementById("requests-text").innerHTML = txt;
}


function acceptChangeRequest(index) {
    let req = document.getElementById("requests-text");
    req.innerHTML = "";
    let obj = JSON.parse(mock).prosby;
    let xhr = new XMLHttpRequest();
    let url = "../sendNotification";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.email + ", " + json.password);
        }
    };
    xhr.send(JSON.stringify(obj[index]));
    obj = obj.splice(index, 1);
    let txt = "<table border='1'>";
    for (x in obj) {
        txt += "<tr><td>" + obj[x].className + " " + obj[x].oldDate + " " + obj[x].newDate + " " + obj[x].email + "</td><td>" +
            "<button type=\"button\" class=\"btn btn-primary\" onclick=\"acceptChangeRequest(" + x + ")\" id=\"accept-request\">Akceptuj</button>\n" +
            "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"declineChangeRequest(" + x + ")\" id=\"decline-request\">Odrzuć</button></td>" +
            "</tr>";
    }
    txt += "</table>";
    req.innerHTML = txt;
}


function declineChangeRequest(index) {
    let req = document.getElementById("requests-text");
    req.innerHTML = "";
    let obj = JSON.parse(mock).prosby;
    obj = obj.splice(index, 1);
    let txt = "<table border='1'>";
    for (x in obj) {
        txt += "<tr><td>" + obj[x].className + " " + obj[x].oldDate + " " + obj[x].newDate + " " + obj[x].email + "</td><td>" +
            "<button type=\"button\" class=\"btn btn-primary\" onclick=\"acceptChangeRequest(" + x + ")\" id=\"accept-request\">Akceptuj</button>\n" +
            "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"declineChangeRequest(" + x + ")\" id=\"decline-request\">Odrzuć</button></td>" +
            "</tr>";
    }
    txt += "</table>";
    req.innerHTML = txt;
}