function jsonToTable(json) {
    console.log(json);
    const keys = Object.keys(json[0]);
    console.log(keys);
    const table = document.getElementById('prosby');

    json.forEach((key) => {
        let row = createRow(key);
        table.appendChild(row);
    });
}
function createRow(json) {
    const tr = document.createElement('tr');
    const values = Object.keys(json);
    values.forEach((value) => {
        const td = document.createElement('td');
        if (!value.includes("id")) {
            td.textContent = json[value];
            tr.appendChild(td);
        }
    });
    const acceptButton = document.createElement('button');
    acceptButton.textContent = "Zaakceptuj";
    acceptButton.classList.add('btn');
    acceptButton.classList.add('btn-primary');
    acceptButton.setAttribute('id', json.idProsby);
    acceptButton.onclick = acceptProsba;
    const rejectButton = document.createElement('button');
    rejectButton.textContent = "Odrzuć";
    rejectButton.classList.add('btn');
    rejectButton.classList.add('btn-danger');
    rejectButton.setAttribute('id', json.idProsby);
    rejectButton.onclick = rejectProsba;
    tr.appendChild(acceptButton);
    tr.appendChild(rejectButton);
    return tr;
}

function acceptProsba(event) {
    let prosbaId = event.path[0].getAttribute('id');
    fetchProsby().then((prosby) => {
        let prosbyArray = prosby.prosby;
        prosby.prosby = prosbyArray.filter((prosba) => prosba.idProsby != prosbaId);
        let prosba = prosbyArray.filter((prosba) => prosba.idProsby == prosbaId)[0];
        fetchZajecia().then((plan) => {
            let className;
            let oldDate;
            let newDate;
            plan.events.forEach((zajecia) => {
                if (zajecia.id == prosba.idZajec) {
                    console.log(zajecia);
                    oldDate = parseDate(zajecia.start);
                    zajecia.start = prosba.newStart;
                    zajecia.end = prosba.newEnd;
                    className = zajecia.title;
                    newDate = parseDate(zajecia.start);
                }
            });
            fetchOsoby().then((osoby) => {
                osobyArray = osoby.osoby;
                console.log(osobyArray);
                console.log(prosba);
                let osoba = osobyArray.filter((osoba) => osoba.id === prosba.idOsoby)[0];
                const email = osoba.email;
                const replyTo = "plan@wat.edu.pl";
                const toName = `${osoba.imie} ${osoba.nazwisko}`;
                sendEmail(email, replyTo, className, toName, oldDate, newDate).then((response) => {
                    savePlan(plan);
                    saveProsby(prosby);
                    location.reload();
                })
            });
        });
    });
}
function parseDate(stringDate) {
    let date = new Date(stringDate);
    let parsedDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    return parsedDate;
}

function sendEmail(toEmail, replyTo, className, toName, oldDate, newDate) {
    var template_params = {
        "toEmail": toEmail,
        "replyTo": replyTo,
        "className": className,
        "toName": toName,
        "oldDate": oldDate,
        "newDate": newDate
    }
    var service_id = "default_service";
    var template_id = "template_1APnUedw";
    return emailjs.send(service_id, template_id, template_params);
}

function rejectProsba(event) {
    let prosbaId = event.path[0].getAttribute('id');
    fetchProsby().then((prosby) => {
        let prosbyArray = prosby.prosby;
        prosby.prosby = prosbyArray.filter((prosba) => prosba.idProsby != prosbaId);
        saveProsby(prosby);
        location.reload();
    });
}

function fetchProsby() {
    let url = '../prosby';
    return fetch(url).
        then((response) => response.json());
}

function fetchZajecia() {
    let url = '../plann';
    return fetch(url).
        then((response) => response.json());
}

function fetchOsoby() {
    let url = '../osoby';
    return fetch(url).
        then((response) => response.json());
}
function saveProsby(prosby) {
    let url = '../prosby';
    return fetch(url, {
        method: 'post',
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(prosby)
    });
}
function savePlan(plan) {
    let url = '../plann';
    return fetch(url, {
        method: 'post',
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(plan)
    });
}

function prepareDataForTable(prosby) {
    return fetchZajecia().then((response) => {
        let plan = response.events;
        prosby.forEach((prosba) => {
            prosba["title"] = plan[prosba.idZajec - 1].title;
        });
        return prosby;
    }).then((response) => {
        return fetchOsoby().then((osoby) => {
            let osobyWsz = osoby.osoby;
            response.forEach((prosba) => {
                prosba.imie = osobyWsz[prosba.idOsoby - 1].imie;
                prosba.nazwisko = osobyWsz[prosba.idOsoby - 1].nazwisko;
                prosba.grupa = osobyWsz[prosba.idOsoby - 1].grupa;
            });
            return response;
        });
    });
}
function updateNavbar() {
    fetchLoggedUserData().then((userInfo) => {
        if (userInfo.role === "WYKLADOWCA") {
            document.getElementById('prosbyLink').style.display = "inline-block";
        } else {
            document.getElementById('prosbyLink').style.display = "none";
        }
        let id = userInfo.id;
        fetchOsoby().then(osoby => {
            let osobyArray = osoby.osoby;
            const osoba = osobyArray.filter(osoba => osoba.id === id)[0];
            const grupa = osoba.grupa;
            const userName = `${osoba.imie} ${osoba.nazwisko}`;
            document.getElementById('user').textContent = userName;
            document.getElementById('grupa').textContent = grupa;
        });

    });
}


function searchProsby() {
    // Declare variables 
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchPros");
    filter = input.value.toUpperCase();
    table = document.getElementById("prosby");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
        let tdArr = [...tr[i].getElementsByTagName("td")];
        let shouldBeVisible = false;
        tdArr.forEach((td) => {
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    shouldBeVisible = true;
                } else {
                    if (!shouldBeVisible)
                        tr[i].style.display = "none";
                }
            }
        });

    }
}

function fetchLoggedUserData() {
    let url = '../user';
    return fetch(url).then((response) => response.json());
}

fetchProsby().then((response) => prepareDataForTable(response.prosby).then(jsonToTable));
updateNavbar();

