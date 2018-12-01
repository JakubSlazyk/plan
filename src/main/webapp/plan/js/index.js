function getPlan() {
    let url = 'http://localhost:8080/plan/plann';
    fetch(url, {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache"
    }).then((response) => response.json())
        .then((planJson) => {
            console.log(planJson.events);
            $('#calendar').fullCalendar({
                theme: true,
                businessHours: true,
                editable: true,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                events: planJson.events,
                eventClick: openModal
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

function openModal(event) {
    console.log(event);
    $('#exampleModal').modal('show');
    $('#exampleModalLabel').text(event.title);
    let eventStart = new Date(event.start._i);
    let eventEnd = new Date(event.end._i);
    console.log(eventStart);
    console.log(eventStart);
    $('#modal-text').text(`Stara data: ${eventStart.getFullYear()}.${eventStart.getMonth()}.${eventStart.getDate()} ${eventStart.getHours()}:${eventStart.getMinutes()}-${eventEnd.getHours()}:${eventEnd.getMinutes()}\n`);
    $("#datepicker").datepicker();
    $('#event-id').text(event._id);
}
function przelozZajecia() {
    let blok = $('#blockpicker').val();
    let data = $("#datepicker").val();
    let startDate = new Date(data);
    let endDate = new Date(data);
    switch (blok) {
        case "1":
            startDate.setHours(8);
            startDate.setMinutes(0);
            endDate.setHours(9);
            endDate.setMinutes(35);
            break;
        case "2":
            startDate.setHours(9);
            startDate.setMinutes(50);
            endDate.setHours(11);
            endDate.setMinutes(25);
            break;
        case "3":
            startDate.setHours(11);
            startDate.setMinutes(40);
            endDate.setHours(13);
            endDate.setMinutes(15);
            break;
        case "4":
            startDate.setHours(13);
            startDate.setMinutes(30);
            endDate.setHours(15);
            endDate.setMinutes(5);
            break;
        case "5":
            startDate.setHours(15);
            startDate.setMinutes(45);
            endDate.setHours(17);
            endDate.setMinutes(20);
            break;
        case "6":
            startDate.setHours(17);
            startDate.setMinutes(35);
            endDate.setHours(19);
            endDate.setMinutes(10);
            break;
        case "7":
            startDate.setHours(19);
            startDate.setMinutes(25);
            endDate.setHours(21);
            endDate.setMinutes(0);
            break;

    }
    startDate.setHours(startDate.getHours() + 1);
    endDate.setHours(endDate.getHours() + 1);
    startDate = startDate.toISOString().slice(0, startDate.toISOString().length - 1);
    endDate = endDate.toISOString().slice(0, endDate.toISOString().length - 1);
    console.log(startDate);
    console.log(endDate);
    fetchPlan().then((json) => {
        // json.events[$('#event-id').text() - 1].start = startDate;
        // json.events[$('#event-id').text() - 1].end = endDate;
        let prosba = new Object();
        fetchProsby().then((prosby) => {
            let prosbyArray = prosby.prosby;
            let id;
            if (prosbyArray.length != 0)
                id = prosbyArray[prosbyArray.length - 1].idProsby;
            else
                id = 1;
            prosba.idProsby = id;
            prosba.idZajec = $('#event-id').text();
            prosba.dataProsby = new Date();
            prosba.newStart = startDate;
            prosba.newEnd = endDate;
            fetchLoggedUserData().then((user) => {
                console.log(user);
                let userId = user.id;
                prosba.idOsoby = userId;
                prosby.prosby.push(prosba);
                saveProsby(prosby);
            });
        });
        // uploadPlan(json).then(() => {

        // });
    })
}

function refreshPlan() {
    fetch("../plann", {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
        credentials: "include"
    }).then((response) => response.json())
        .then((planJson) => {
            $('#calendar').fullCalendar('removeEvents');
            planJson.events.forEach((event) => {
                $('#calendar').fullCalendar('renderEvent', event);
            });
        });
}
function fetchPlan() {
    let url = '../plann';
    return fetch(url, {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
        credentials: "include"
    }).then((response) => response.json());
}

function saveProsby(prosby) {
    let url = '../prosby';
    return fetch(url, {
        method: 'post',
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(prosby)
    });
}

let url = '../plann';
function uploadPlan(plan) {
    return fetch(url, {
        method: 'post',
        cache: "no-cache",
        pragma: "no-cache",
        credentials: "include",
        "cache-control": "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(plan)
    });
}

function fetchProsby() {
    let url = '../prosby';
    return fetch(url).
        then((response) => response.json());
}

function fetchLoggedUserData() {
    let url = '../user';
    return fetch(url).then((response) => response.json());
}

function fetchOsoby() {
    let url = '../osoby';
    return fetch(url).
        then((response) => response.json());
}