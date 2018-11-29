function jsonToTable(json) {
    console.log(json.prosby);
    const keys = Object.keys(json.prosby[0]);
    const table = document.getElementById('prosby');


    json.prosby.forEach((key) => {
        let row = createRow(key);
        table.appendChild(row);
    });
}
function createRow(json) {
    const tr = document.createElement('tr');
    const values = Object.values(json);
    values.forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
    });
    return tr;
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
console.log(fetchZajecia());
fetchProsby().then(jsonToTable);
