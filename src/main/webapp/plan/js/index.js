function getPlan() {
    let url = '../plann';
    fetch(url, {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache"
    }).then((response) => response.json())
        .then((planJson) => {
            let eventy = planJson.events;
            let grupa = getAllUrlParams(window.location.href);
            fetchLoggedUserData().then((userInfo) => {
                let id = userInfo.id;
                fetchOsoby().then(osoby => {
                    if (Object.keys(grupa).length < 1) {
                        let osobyArray = osoby.osoby;
                        const osoba = osobyArray.filter(osoba => osoba.id === id)[0];
                        if (osoba.grupa != "")
                            eventy = eventy.filter((event) => event.grupa == osoba.grupa);
                        else
                            eventy = eventy.filter((event) => event.idWykladowcy == osoba.id);
                    } else {
                        eventy = eventy.filter((event) => event.grupa == grupa.grupa);
                    }
                    $('#calendar').fullCalendar({
                        theme: true,
                        businessHours: false,
                        editable: false,
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay'
                        },
                        events: eventy,
                        eventClick: openModal
                    });
                });
            });

        });
}
function updateNavbar(osoba) {
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
    getUserRole().then((role) => {
        if (role !== "STUDENT") {
            $('#exampleModal').modal('show');
            $('#exampleModalLabel').text(event.title);
            let eventStart = new Date(event.start._i);
            let eventEnd = new Date(event.end._i);
            console.log(eventStart);
            console.log(eventStart);
            $('#modal-text').text(`Stara data: ${eventStart.getFullYear()}.${eventStart.getMonth()}.${eventStart.getDate()} ${eventStart.getHours()}:${eventStart.getMinutes()}-${eventEnd.getHours()}:${eventEnd.getMinutes()}\n`);
            $("#datepicker").datepicker();
            $('#event-id').text(event._id);
        } else {
            toastr.error("Tylko starosta moze wystepować o przełozenie zajęć.");
        }
    });
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
                saveProsby(prosby).then((response) => {
                    $('#exampleModal').modal('hide');
                    toastr.success("Prośba została przesłana do prowadzącego.");
                });
            });
        });
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

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}

function getUserRole() {
    return fetchLoggedUserData().then((user) => user.role);
}

function searchForGroup() {
    const groupToSearch = document.getElementById('grupaSearch').value;
    window.location.replace(window.location.href.split('?')[0] + `?grupa=${groupToSearch}`);
}