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
            plan.events.forEach((zajecia) => {
                if (zajecia.id == prosba.idZajec) {
                    console.log(zajecia);
                    zajecia.start = prosba.newStart;
                    zajecia.end = prosba.newEnd;
                }
            });

            savePlan(plan);
            saveProsby(prosby);
            location.reload();
        });
        console.log(prosba);
    });
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
    let url = 'http://localhost:8080/plan/prosby';
    return fetch(url).
        then((response) => response.json());
}

function fetchZajecia() {
    let url = 'http://localhost:8080/plan/plann';
    return fetch(url).
        then((response) => response.json());
}

function fetchOsoby() {
    let url = 'http://localhost:8080/plan/osoby';
    return fetch(url).
        then((response) => response.json());
}
function saveProsby(prosby) {
    let url = 'http://localhost:8080/plan/prosby';
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
    let url = 'http://localhost:8080/plan/plann';
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
        // return response;
    });
}

fetchProsby().then((response) => prepareDataForTable(response.prosby).then(jsonToTable));
