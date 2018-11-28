mock = '{"prosby" : [' +
    '{"prosba": "prosba 1"},' +
    '{"prosba": "prosba 2"}]}';

function showRequestsModal(event) {
    $("#requests-modal").modal("show");
    let s = [];
    let obj = JSON.parse(mock).prosby;
    let txt = "<table border='1'>";
    for (x in obj) {
        txt += "<tr><td>" + obj[x].prosba + "</td><td>" +
            "<button type=\"button\" class=\"btn btn-primary\" onclick=\"acceptChangeRequest(obj[x], x)\" id=\"accept-request\">Akceptuj</button>\n" +
            "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"declineChangeRequest(obj[x], x)\" id=\"decline-request\">Odrzuć</button></td>" +
            "</tr>";
    }
    txt += "</table>";
    document.getElementById("requests-text").innerHTML = txt;
}



function acceptChangeRequest(changeRequest, index) {

}

function declineChangeRequest(changeRequest, index) {
    let req = document.getElementById("requests-text");
    req.innerHTML = "";
    let obj = JSON.parse(mock).prosby;
    obj = obj.splice(index, 1);
    let txt = "<table border='1'>";
    for (x in obj) {
        txt += "<tr><td>" + obj[x].prosba + "</td><td>" +
            "<button type=\"button\" class=\"btn btn-primary\" onclick=\"acceptChangeRequest(obj[x], x)\" id=\"accept-request\">Akceptuj</button>\n" +
            "<button type=\"button\" class=\"btn btn-secondary\" onclick=\"declineChangeRequest(obj[x], x)\" id=\"decline-request\">Odrzuć</button></td>" +
            "</tr>";
    }
    txt += "</table>";
    req.innerHTML = txt;
}